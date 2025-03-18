import productModel from "../../../models/productModel.js";


export const newProduct = async (req, res) => {
    try {
        //destructuring the payload fromt he req.body
        const { name, description, price, stock, image, category } = req.body

        //ensuring all field are provided
        if (!name || !description || !price || !stock || !image || !category) {
            return res.status(400).json({
                message: "All fields are required"
            })
        };

        //saving to database
        const newProduct = new productModel({ name, description, price, stock, image, category })
        await newProduct.save()

        //returning a response
        return res.status(200).json({
            message: "New product listing successful",
            product_details: { newProduct }
        });

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Oops, Something went wrong"
        })
    }
}