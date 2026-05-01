import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
  const token = req.cookies?.token;

  console.log("Auth check - Cookie received:", !!token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not Authorized - No token'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.id) {
      req.userId = decoded.id;
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: 'Not Authorized - Invalid token'
      });
    }
  } catch (error) {
    console.log("Token verification error:", error.message);
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

export default authUser;