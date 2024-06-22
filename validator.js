const Joi = require("joi")

const validator = (schema) => (payload) => schema.validate(payload)

const categorySchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string()
})

const productSchema = Joi.object({
    category: Joi.string().required(),
    name: Joi.string().required(),
    img: Joi.string(),
    price: Joi.number().required(),
    featured: Joi.boolean(),
    topSelling: Joi.boolean()
})

exports.validateCategory = validator(categorySchema)
exports.validateProduct = validator(productSchema)