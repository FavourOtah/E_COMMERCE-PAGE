import mongoose from "mongoose";
import orderModel from "../../../models/orderModel.js";
import cartModel from "../../../models/cartModel.js";
import { findOrCreateCart } from "../../../utils/cartUtils.js";

export const placeOrder = async (req, res) => {
    //the mongoose session ensures that the cart is only updated if the order is successfully placed.
    const session = await mongoose.startSession();
    session.startTransaction();
    try {

        //we get their cart first
        const cart = await findOrCreateCart(req, res)
        if (cart.products.length === 0) {
            return res.status(400).json({
                message: "Your cart is empty."
            })
        };

        //calculating the total amount
        const totalAmount = cart.products.reduce((sum, item) => {
            return sum + item.unitPrice * item.quantity;
        }, 0);

        //getting the order products 
        const orderProducts = cart.products.map((items) => ({
            productId: items.productId,
            quantity: items.quantity
        }))

        //creating the main order
        const newOrder = new orderModel({
            userId: cart.userId,
            products: orderProducts,
            totalAmount: totalAmount,
            status: "pending", //default
            paymentStatus: "pending"
        });

        //saving the newOrder
        await newOrder.save({ session });

        //clearing the cart after order placement
        await cartModel.findByIdAndUpdate(cart._id, { products: [] });

        //commiting the transaction
        await session.commitTransaction();
        session.endSession();


        return res.status(201).json({
            message: "Order placed successfully.",
            order: newOrder
        })

    } catch (error) {
        await session.abortTransaction();
        sesion.endSession();
        console.error(error)
        return res.status(500).json({
            message: "Something went wrong."
        })

    }
}