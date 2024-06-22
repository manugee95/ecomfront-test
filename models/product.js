const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    category: {type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true},
    name: {type: String, required: true},
    img: {type: String, required: true},
    price: {type: Number, required: true},
    featured: {type: Boolean, default: false},
    topSelling: {type: Boolean, default: false}
}, {timestamps: true})

module.exports = mongoose.model("Product", productSchema)