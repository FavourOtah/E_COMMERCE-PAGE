import cartModel from "../../../models/cartModel.js";

export const getCartDetails = async (req, res) => {
    try {
        //scenarios for either a logged in user or a visitor
        const { userId } = req.token
        const { cartId } = req.cookies

        let cart;

        //
        if (userId) {
            cart = await cartModel.findOne({ userId: userId })
        } else if (cartId) {
            cart = await cartModel.findById(cartId)
        } else {
            return res.status(400).json({ message: "You have no cart yet." })
        };


        if (!cart) {
            return res.status(404).json({
                message: "Cart not found."
            })
        };

        return res.status(200).json({
            message: "Cart details",
            cartContents: cart.products
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Something went wrong."
        })

    }
};







