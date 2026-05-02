import Address from "../models/Address.js";

// Add address    /api/address/add
export const addAddress = async (req, res) => {
    try {
        const { address } = req.body;
        // ✅ Try both formats
        const userId = req.user?.id || req.userId || req.body.userId;

        console.log("Add address - User ID:", userId);

        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: "Not Authorized - User ID missing" 
            });
        }

        const newAddress = await Address.create({ ...address, userId });
        res.json({
            success: true,
            message: "Address successfully added",
            address: newAddress,
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get address  /api/address/get
export const getAddress = async (req, res) => {
    try {
        // ✅ Try both formats
        const userId = req.user?.id || req.userId || req.query.userId;

        console.log("Get address - User ID:", userId);

        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: "Not Authorized - User ID missing" 
            });
        }

        const addresses = await Address.find({ userId }).sort({ createdAt: -1 });
        res.json({ success: true, addresses });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};