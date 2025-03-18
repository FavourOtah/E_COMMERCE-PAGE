import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: String, required: true },
    category: {
        type: String, required: true, enum: ['Electronics', 'Gadgets', 'Clothings', 'Consumables'],
        message: '{VALUE} is not a valid category.'
    }
}, { timestamps: true })

const productModel = mongoose.model("product", productSchema)
export default productModel;