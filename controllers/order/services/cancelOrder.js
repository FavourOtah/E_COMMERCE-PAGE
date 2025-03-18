import cartModel from "../../../models/cartModel.js";
import orderModel from "../../../models/orderModel.js";
import productModel from "../../../models/productModel.js";
import mongoose from "mongoose";

export const cancelOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        //getting the id of the order to be cancel
        const { id } = req.params

        //finding
        const orderData = await orderModel.findById(id)
        if (!orderData) {
            return res.status(404).json({
                message: "Order not found. Either it has been cancelled or never existed."
            })
        };

        //checking to see if the status is already shipped.
        if (orderData.status === "delivered") {
            return res.status(400).json(
                { message: "Item already delivered." }
            )
        } else if (orderData.status === "shipped") {
            return res.status(400).json({
                message: "Order can no longer be cancelled because it has been shipped."
            })
        };

        //refilling the cart back
        const cartRefill = await Promise.all(orderData.products.map(async (items) => {
            const product = await productModel.findById(items.productId);
            const array = {
                productId: items.productId,
                quantity: items.quantity,
                unitPrice: product.price
            }
            return array
        }))

        //finding the users cart and refilling it
        const cart = await cartModel.findOne({
            userId: orderData.userId
        });

        cart.products.push(...cartRefill)
        await cart.save({ session })

        //cancelling the order
        await orderModel.findByIdAndDelete(id, { session })

        //commiting the transactions
        await session.commitTransaction();
        session.endSession();

        //response
        return res.status(200).json({
            message: "Order successfully cancelled."
        })

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error)
        return res.status(500).json({
            message: "Something went wrong."
        })

    }
}