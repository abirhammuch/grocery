import Address from "../models/Address.js";

// ADd adress    /api/address/add
export const addAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized" });
    }

    const newAddress = await Address.create({ ...address, userId });
    res.json({
      success: true,
      message: "Address succcessfuly added",
      address: newAddress,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//get address  /api/address/get
export const getAddress = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized" });
    }

    const addresses = await Address.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, addresses });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
