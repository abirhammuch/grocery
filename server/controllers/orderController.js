import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripe from 'stripe';
import User from '../models/User.js'

// Place order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, addressId } = req.body; // Changed 'address' to 'addressId'
        
        console.log("Order request:", { userId, items, addressId }); // Debug
        
        if (!addressId || !items || items.length === 0) {
            return res.json({ success: false, message: "Invalid Data" });
        }
        
        // Calculate amount using items - FIXED
        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product); // Fixed: Product.findById (capital P)
            if (product) {
                const price = product.offerPrice || product.price;
                amount += price * item.quantity;
            }
        }
        
        // Add tax charge (2%)
        amount += Math.floor(amount * 0.02);
        
        // Create order
        await Order.create({
            userId,
            items,
            amount,
            address: addressId, // Changed: 'address' to addressId value
            paymentType: "COD",
            isPaid: false
        });
        
        return res.json({ success: true, message: "Order placed Successfully" });
        
    } catch (error) {
        console.error("Place order error:", error);
        return res.json({ success: false, message: error.message });
    }
}

    // Place order using stripe : /api/order/stripe
// Place order using stripe : /api/order/stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, addressId } = req.body;
        const { origin } = req.headers;
        
        if (!addressId || !items || items.length === 0) {
            return res.json({ success: false, message: "Invalid Data" });
        }
        
        let productData = [];
        let amount = 0;

        // FIXED: Use for loop instead of async reduce
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (product) {
                const price = product.offerPrice || product.price;
                amount += price * item.quantity;
                
                productData.push({
                    name: product.name,
                    price: price,  // FIXED: Use product.offerPrice, not Product.offerPrice
                    quantity: item.quantity,
                });
            }
        }
        
        // Add tax charge (2%)
        amount += Math.floor(amount * 0.02);
        
        // Create order
        const order = await Order.create({
            userId,
            items,
            amount,
            address: addressId,
            paymentType: "Online",
            isPaid: false
        });

        // Stripe gateway initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        // Create line items for stripe
        const line_items = productData.map((item) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.floor(item.price * 100)  // FIXED: Remove tax from here
                },
                quantity: item.quantity,
            };
        });

        // Create session 
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        });

        return res.json({ success: true, url: session.url });
        
    } catch (error) {
        console.error("Place order error:", error);
        return res.json({ success: false, message: error.message });
    }
}


// stripe webhooks to verify payment action  : /stripe
// stripe webhooks to verify payment action : /stripe
export const stripeWebhooks = async (request, response) => {
    console.log("=== WEBHOOK HIT ===");
    console.log("Time:", new Date().toISOString());
    console.log("Event type from Stripe will be logged after verification");
    
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers["stripe-signature"];

    let event;

    try {
        const rawBody = request.body;
        console.log("Raw body length:", rawBody?.length || 0);
        
        event = stripeInstance.webhooks.constructEvent(
            rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        console.log("✅ Event verified:", event.type);
        console.log("Full event data:", JSON.stringify(event.data.object, null, 2).substring(0, 500));
    } catch (error) {
        console.error("❌ Webhook error:", error.message);
        return response.status(400).send(`Webhook Error: ${error.message}`);
    }

    if (event.type === "checkout.session.completed") {
        console.log("🎉 Processing checkout.session.completed");
        const session = event.data.object;
        const { orderId, userId } = session.metadata || {};
        
        console.log("Metadata received:", { orderId, userId });
        
        if (!orderId || !userId) {
            console.error("❌ Missing metadata! Session metadata:", session.metadata);
            return response.status(400).json({ received: false, error: "Missing metadata" });
        }

        try {
            // Update order
            const updateResult = await Order.findByIdAndUpdate(orderId, { isPaid: true });
            console.log("Order update result:", updateResult ? "Success" : "Order not found");
            
            // Clear cart
            const userUpdateResult = await User.findByIdAndUpdate(userId, { cartItems: {} });
            console.log("Cart clear result:", userUpdateResult ? "Success" : "User not found");
            
            console.log("✅ Cart cleared successfully!");
        } catch (dbError) {
            console.error("❌ Database error:", dbError.message);
            return response.status(500).json({ received: false, error: dbError.message });
        }
    } else {
        console.log(`⚠️ Ignoring event type: ${event.type}`);
    }
    
    response.json({ received: true });
    console.log("=== WEBHOOK FINISHED ===");
}



// Get order by user Id  /api/order/user
// Get order by user Id  /api/order/user
export const getUserOrder = async (req, res) => {
    try {
        // CHANGE THIS: Get userId from query params instead of body
        const userId = req.query.userId;
        
        console.log("Getting orders for userId:", userId); // Debug
        
        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: "User ID required" 
            });
        }
        
        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 });
        
        console.log(`Found ${orders.length} orders`); // Debug
        
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Get user orders error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}

// Get all orders for admin /api/order/seller
// Get all orders for admin /api/order/seller
export const getAllorder = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        })
        .populate("items.product", "name image category offerPrice price") // Specify which product fields
        .populate("address") // Populate the address reference
        .sort({ createdAt: -1 });
        
        console.log(`Found ${orders.length} orders for admin`); // Debug
        console.log("Sample order:", orders[0] ? {
            id: orders[0]._id,
            hasAddress: !!orders[0].address,
            addressType: typeof orders[0].address,
            itemsCount: orders[0].items?.length
        } : "No orders");
        
        res.json({ success: true, orders: orders || [] });
    } catch (error) {
        console.error("Get all orders error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}