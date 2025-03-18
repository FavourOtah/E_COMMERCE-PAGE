import cartModel from "../../../models/cartModel.js";
import productModel from "../../../models/productModel.js";
import { findOrCreateCart } from "../../../utils/cartUtils.js";
import mongoose from "mongoose"

export const addToCart = async (req, res) => {
    //implementing mongoose transaction session, this is becasue i would be updating the stock value in the DB from here.
    //race conditions, correct update of stock.
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        //getting a cart
        const cart = await findOrCreateCart(req, res)

        //getting the {product
        const { productId, quantity } = req.body

        //validating the quantity
        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                message: "Quantity must atlease be 1."
            })
        };


        //check if the products is in the DB
        const product = await productModel.findById(productId)
        if (!product) {
            return res.status(404).json({
                message: "Product not found."
            })
        };

        //if product is available we check for the number of stock left
        if (product.stock === 0) {
            return res.status(500).json({ message: "Sorry we are currently out of stock. Come back later." })
        } else if (product.stock < quantity) {
            return res.status(400).json({
                message: `Sorry we have only ${product.stock} left in stock.`
            })
        };

        //check if product is already part of the cart
        const productInCart = cart.products.find(items => items.productId.toString() === productId)

        if (productInCart) {
            productInCart.quantity += quantity;
        } else {
            cart.products.push({
                productId,
                quantity,
                unitPrice: product.price
            })
        };

        //trying to dynamically update the stock
        product.stock -= quantity

        //saving the updated cart and product stock//Promise.all ensures concurrent saving thus improving efficiency.
        await Promise.all([cart.save({ session }), product.save({ session })])

        await session.commitTransaction();
        session.endSession();

        //return
        return res.status(200).json({
            message: "Product added to cart successfully",
            cartContents: cart
        })

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error)
        return res.status(500).json({
            message: "Something went wrong"
        })

    }
}