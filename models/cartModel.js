import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "user", default: null/*since guest wont have this*/ },
    cartId: { type: String, unique: true, sparse: true },//allows multiple null values for logged in users
    products: [{
        productId: { type: mongoose.Types.ObjectId, ref: "product", required: true },
        quantity: { type: Number, required: true, default: 1 },
        unitPrice: { type: Number, required: true }
    }]
}, { timestamps: true });

const cartModel = mongoose.model("cart", cartSchema)
export default cartModel