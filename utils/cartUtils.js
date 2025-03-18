import cartModel from "../models/cartModel.js";
import { v4 as uuidv4 } from "uuid";

export const findOrCreateCart = async (req, res) => {
    const { userId } = req.token
    //for users that are logged in
    if (userId) {
        let cart = await cartModel.findOne({ userId });
        //if there is no cart associated to that id, we create a new cart
        if (!cart) {
            cart = await cartModel.create({ userId, products: [] });
            await cart.save()
        };

        //returning cart
        return cart;
    } else {
        //say the user is not logged in, just a visitor
        //check for cartId in the cookies
        let { cartId } = req.cookies;

        //if the visitor doesnt already have a visitor cartId
        //if no cartId is found, we create a unique one and then creat a cart with it which we return
        if (!cartId) {
            cartId = uuidv4();

            //creating new cart with new cartId
            let cart = await cartModel.create({ cartId, products: [] });

            //sending the cartId via cookie
            res.cookie("cartId", cartId, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })

            return cart
        } else {
            //say a cartId was gotten from the cookies
            let cart = await cartModel.findOne({ cartId })

            //lets say no Cart was found, we creat new cart
            if (cart) {
                return cart
            } else {

                cart = await cartModel.create({ cartId, products: [] })
                return cart
            };

        };
    };
}