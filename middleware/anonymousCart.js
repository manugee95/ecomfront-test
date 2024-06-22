const { v4: uuidv4 } = require("uuid");

const handleAnonymousCart = (req, res, next) => {
  if (!req.cookies.cartId) {
    const cartId = uuidv4();
    res.cookie("cartId", cartId, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    req.cartId = cartId;
  } else {
    req.cartId = req.cookies.cartId;
  }

  next();
};

module.exports = handleAnonymousCart;
