import productModel from "../../../models/productModel.js";

export const updateProduct = async (req, res) => {
    try {
        //getting the id from params
        const { id } = req.params

        //searching for product with that id
        const productExist = await productModel.findById(id)
        if (!productExist) {
            return res.status(404).json({
                message: "Sorry, product not found."
            })
        };

        //getting updateData by spreading req.body
        const updateData = { ...req.body }

        //ensuring undefined fields are removed
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        })

        const updatedData = await productModel.findByIdAndUpdate(id, updateData, { new: true })
        return res.status(202).json({
            message: "Product Succesfully updated",
            product: updatedData
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Something went wrong."
        })

    }
}