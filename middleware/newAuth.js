const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.json("Unauthorized Access");
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.id).select("-password");
      req.user = user;
      next();
    } catch (error) {
      res.json({ message: "Invalid Token" });
    }
  }
};

const admin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    res.json("Access Denied");
  }

  next();
};

module.exports = {auth, admin}