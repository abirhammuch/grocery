import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
    // Get token from multiple sources
    const token = req.headers.authorization?.split(' ')[1] || 
                  req.cookies?.token ||
                  req.headers['x-seller-token'];

    console.log("Auth middleware - Token received:", !!token);

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not Authorized - No token"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // ✅ IMPORTANT: Set both req.user and req.userId
        req.user = { id: decoded.id };
        req.userId = decoded.id;  // For backward compatibility
        
        console.log("Auth middleware - User ID:", req.user.id);
        next();
    } catch (error) {
        console.error("Auth middleware error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Not Authorized - Invalid token"
        });
    }
};

export default authUser;