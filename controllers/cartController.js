const Cart = require("../models/cart");
const Product = require("../models/product");

//Calculate Amount
// const calculateAmount = async (productId, quantity) => {
//   const product = await Product.findById(productId);
//   if (!product) {
//     throw new Error("Product not found");
//   }

//   return product.price * quantity;
// };

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, products: [] });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
      cart.products[productIndex].amount =
        product.price * cart.products[productIndex].quantity;
    } else {
      cart.products.push({
        product: productId,
        quantity,
        amount: product.price * quantity,
      });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }

  // const { productId, quantity } = req.body;
  // const userId = req.user ? req.user.id : null;
  // const cartId = req.cartId;

  // try {
  //   let cart;
  //   if (userId) {
  //     cart =
  //       (await Cart.findOne({ user: userId })) ||
  //       (await Cart.findOne({ anonymousId: cartId }));
  //   } else {
  //     cart = await Cart.findOne({ anonymousId: cartId });
  //   }

  //   if (!cart) {
  //     cart = new Cart({ user: userId, anonymousId: userId ? null : cartId });
  //   }

  //   const productExist = cart.products.find(
  //     (item) => item.product.toString() === productId
  //   );

  //   if (productExist) {
  //     productExist.quantity += quantity;
  //     productExist.amount = await calculateAmount(productId, quantity);
  //   } else {
  //     const amount = await calculateAmount(productId, quantity);
  //     cart.products.push({ product: productId, quantity, amount });
  //   }

  //   await cart.save();
  //   res.json(cart);
  // } catch (error) {
  //   console.log(error);
  //   res.json({ error: error.message });
  // }
};

// Get cart for the authenticated user
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('products.product');
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    const item = cart.products.find(p => p.product.toString() === productId)

    const product = await Product.findById(productId);
    if (!product) {
      return res.json({ msg: 'Product not found' });
    }

    if (item) {
      item.quantity = quantity;
      item.amount = product.price * item.quantity

      await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ msg: 'Product not found in cart' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.removeItem = async (req, res) => {
  const { productId } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    await cart.save();
    const updatedCart = await Cart.findOne({ user: req.user.id }).populate('products.product');
    res.json(updatedCart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
