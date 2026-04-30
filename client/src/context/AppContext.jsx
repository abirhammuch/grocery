import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// Create context
const AppContext = createContext();

// Provider component
export const AppContextProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();
    
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState({});

    const normalizeProduct = (product) => ({
        ...product,
        image: product.image || [],
    });

    //fetch seller status
    const fetchSeller = async () => {
        try {
            const { data } = await axios.get('/api/seller/is-auth');
            if (data.success) {
                setIsSeller(true);
            } else {
                setIsSeller(false);
            }
        } catch (error) {
            setIsSeller(false);
        }
    };

    //fetch user auth status , user data and cart item
    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user/is-auth');
            if (data.success) {
                setUser(data.user);
                setCartItems(data.user.cartItems || {});
            }
        } catch (error) {
            setUser(null);
        }
    };

    //fetch all products
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/product/list');
            if (data.success) {
                setProducts(data.products.map(normalizeProduct));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Define updateCart outside useEffect
    const updateCart = async () => {
        if (!user) return;
        
        try {
            const { data } = await axios.post('/api/cart/update', { cartItems });
            if (!data.success) {
                console.error('Cart update failed:', data.message);
            }
        } catch (error) {
            console.error('Cart update error:', error.message);
        }
    };

    //add products to cart
    const addToCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success('Added to cart');
    };

    //update cart items quantity
    const updateCartItems = (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData);
        toast.success('Cart Updated');
    };

    //remove products from cart
    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] == 0) {
                delete cartData[itemId];
            }
        }
        toast.success('Removed from cart');
        setCartItems(cartData);
    };

    // get cart item count
    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            totalCount += cartItems[items];
        }
        return totalCount;
    };

    //get cart total amount
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0 && itemInfo) {
                totalAmount += (itemInfo.offerPrice || itemInfo.price) * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    };

    // Initial data fetch
    useEffect(() => {
        fetchUser();
        fetchSeller();
        fetchProducts();
    }, []);

    // Update database cart items when cart changes (with debounce)
    useEffect(() => {
        if (user) {
            const timeoutId = setTimeout(() => {
                updateCart();
            }, 1000);
            
            return () => clearTimeout(timeoutId);
        }
    }, [cartItems, user]);

    const value = {
        navigate,
        user,
        setUser,
        isSeller,
        setIsSeller,
        showUserLogin,
        setShowUserLogin,
        products,
        currency,
        addToCart,
        updateCartItems,
        removeFromCart,
        cartItems,
        searchQuery,
        setSearchQuery,
        getCartAmount,
        getCartCount,
        axios,
        fetchProducts,
        setCartItems
    };
    
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook
export const useAppContext = () => {
    return useContext(AppContext);
};

// Also export the context itself (for advanced use cases)
export { AppContext };