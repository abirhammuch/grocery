import jwt from "jsonwebtoken";

// login seller  : /api/seller/login
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      password === process.env.SELLER_PASSWORD &&
      email === process.env.SELLER_EMAIL
    ) {
      const sellerToken = jwt.sign(
        { role: "seller", email: email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );

      return res.json({
        success: true,
        message: "Seller logged in successfully",
        isSeller: true,
        token: sellerToken,
      });
    } else {
      // Invalid credentials
      return res.json({
        success: false,
        message: "Invalid seller credentials",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// seller isAuth : /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
  try {
    return res.json({ success: true, isSeller: true });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

//logout seller    /api/seller/logout
export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged out" });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};
