import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "user" },
    products: [{
        productId: { type: mongoose.Types.ObjectId, ref: "product" },
        quantity: { type: Number, required: true },
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "shipped", "delivered"], default: "pending" },
    paymentStatus: { type: String, enum: ["pending", "completed"] }
}, { timestamps: true })

const orderModel = mongoose.model("order", orderSchema)
export default orderModel 