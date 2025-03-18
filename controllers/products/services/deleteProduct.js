import productModel from "../../../models/productModel.js";

export const deleteProduct = async (req, res) => {
    try {
        //get id
        const { id } = req.params;

        const { isAdmin } = req.token//just adding an additional check, though it is already handled in the authorization file
        if (!isAdmin) {
            return res.status(403).json({
                message: "Admins only"
            })
        }

        //getting and deletig the product
        const product = await productModel.findByIdAndDelete(id)
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
        };


        return res.status(200).json({
            message: "Product taken off the shelf."
        })



    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}