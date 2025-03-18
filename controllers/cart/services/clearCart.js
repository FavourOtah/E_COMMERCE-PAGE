import e from "express";
import { findOrCreateCart } from "../../../utils/cartUtils.js";
import productModel from "../../../models/productModel.js";
import mongoose from "mongoose";

export const clearCart = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        //getting the cart.
        const cart = await findOrCreateCart(req, res)

        //check if cart is already empty
        if (cart.products.length === 0) {
            return res.status(400).json({
                message: "Your cart is already empty"
            })
        };

        // //restocking out products db with the items we are clearing\
        // const productUpdates = cart.products.map(async (cartItem) => {
        //     const product = await productModel.findById(cartItem.productId).session(session);
        //     if (product) {
        //         product.stock += cartItem.quantity;
        //         return product.save({ session });
        //     }
        // })

        // //
        // await Promise.all(productUpdates)

        // Restock product quantities before clearing cart
        await Promise.all(
            cart.products.map(async (cartItem) => {
                const product = await productModel.findById(cartItem.productId);
                if (product) {
                    product.stock += cartItem.quantity;
                    await product.save({ session });
                }
            })
        );

        //clearing the contents of the cart
        cart.products = []

        //saving the updates
        await cart.save({ session })

        //commiting thtransaction
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            message: "Cart has been successfully emptied",
            cartContents: cart
        })




    } catch (error) {
        await session.abortTransaction();
        session.endSession()
        console.error(error)
        return res.status(500).json({
            message: "Something went wrong."
        })

    }
}