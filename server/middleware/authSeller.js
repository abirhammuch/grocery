import jwt from "jsonwebtoken";

const authSeller = (req, res, next) => {
  const cookieToken = req.cookies?.sellerToken;
  const headerToken =
    req.headers["x-seller-token"] || req.headers.authorization?.split(" ")[1];
  const sellerToken = headerToken || cookieToken;

  if (!sellerToken) {
    return res.json({ success: false, message: "Not Authorized" });
  }

  try {
    const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);
    if (tokenDecode.email === process.env.SELLER_EMAIL) {
      return next();
    } else {
      return res.json({ success: false, message: "Not Authorized" });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export default authSeller;
