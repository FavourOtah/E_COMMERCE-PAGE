import cartModel from "../../../models/cartModel.js";
import mongoose from "mongoose"
import productModel from "../../../models/productModel.js";

import { findOrCreateCart } from "../../../utils/cartUtils.js";


export const removeFromCart = async (req, res) => {
    //introducing mongoose session/transactions to prevent race conditions that is
    //if multiple users try to remove the same product at the same time, the stock updates might be incorrect.
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        //retrieving or creating a cart 
        const cart = await findOrCreateCart(req, res);

        //if cart is empty no need carrying out any remove process on it
        if (cart.products.length === 0) {
            return res.status(400).json({ message: "Your cart is empty." })
        };

        //getting the details to be removed
        const { productId, quantity } = req.body;

        //ensuring qty to be removed is atleast 1
        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be atleast 1."
            })
        };

        //using findIndex not find because I would be using splice later on and to reduce database query
        const productIndex = cart.products.findIndex(items => items.productId.toString() === productId)

        //remember -1 means item not found.
        if (productIndex === -1) {
            return res.status(404).json({
                message: "Product not among the items in your cart."
            })
        };

        //retrieving the actual product if it exists
        const actualProduct = cart.products[productIndex];

        //ensuring the user removes not more than he has in his/her cart
        if (actualProduct.quantity < quantity) {
            return res.status(400).json({
                message: "Sorry you cant remove more than you have in your cart."
            })
        };

        actualProduct.quantity -= quantity;

        //immplementing splice if the current qty value ===0
        if (actualProduct.quantity === 0) {
            cart.products.splice(productIndex, 1)
        };

        //saving the cart
        await cart.save()


        //updating stock value of the product
        //findone could be used here because.session is not designed to work with findbyid, it is a shorthand for writing findOne({_id:})
        //findOne({_id:id}) returns an instance that allows the chaining.session meanwhile findbyid executes the query and returns a document
        //solution==> since session is automatically inherited inside an ongoing transaction , we dont need to always explicitly pass .session(session) like we would have
        //we would simply just ensure we save the product within the session like this ""await product.save({ session })""

        const product = await productModel.findById(productId)
        if (product) {
            product.stock += quantity;
            await product.save({ session })
        };

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            message: "Item successfully removed.",
            cartContents: cart
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