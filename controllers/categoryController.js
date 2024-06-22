const Category = require("../models/category")
const {validateCategory} = require("../validator")

exports.createCategory = async (req, res)=>{
    try {
        const {error} = validateCategory(req.body)
        if (error) {
            res.json(error.details[0].message)
        }

        const category = new Category({
            name: req.body.name,
            description: req.body.description
        })

        const categoryItem = await category.save()
        res.json(categoryItem)
    } catch (error) {
        res.json({message: error.message})
    }
}