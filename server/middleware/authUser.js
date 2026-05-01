import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  const cookieToken = req.cookies?.token;
  const headerToken = req.headers.authorization?.split(" ")[1];
  const token = headerToken || cookieToken;

  console.log("Auth check - Token received:", !!token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized - No token",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id) {
      req.userId = decoded.id;
      req.user = { id: decoded.id };
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Not Authorized - Invalid token",
      });
    }
  } catch (error) {
    console.log("Token verification error:", error.message);
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export default authUser;
