const express = require("express")
const {auth} = require("../middleware/auth")
const paymentController = require("../controllers/paymentController")

const router = express.Router()

router.post("/initiate", auth, paymentController.initiatePayment)
router.post("/verify", auth, paymentController.verifyPayment)

module.exports = router 