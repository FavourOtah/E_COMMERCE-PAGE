import cartModel from "../../../models/cartModel.js";
import userModel from "../../../models/userModel.js";
import { createToken } from "../../../utils/token.js";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        //checking for provided credentials
        if (!email || !password) {
            return res.status(400).json(
                { message: "Your email and passwprd are needed for login." }
            )
        };

        //checking the provided unique email is linked to an account
        const userExist = await userModel.findOne({ email });
        if (!userExist) {
            return res.status(404).json({ message: "No account found linked to the email provided, would you ike to create an account with us?" })
        };

        //next we compare the provided password with the stored password.
        //remember we already created a function that compares the password when we were creating the userModel
        const validPassword = await userExist.comparePassword(password)
        if (!validPassword) {
            return res.status(401).json({
                message: "Wrong password provided"
            })
        };

        const userCart = await cartModel.findOne({ userId: userExist._id });
        //handling when a visitor already has a cart before attempting to login
        //we start by checking for the cartId from the cookies
        const { cartId } = req.cookies
        if (cartId) {
            const guestCart = await cartModel.findOne({ cartId });

            //if the user has a cart already as a visitor and one as logged in user, we merge both
            //we add things from the guestCart into the userCart

            //checking if user has a cart as a guest. If present the rest of the cart merging runs

            if (guestCart) {
                if (userCart) {
                    //for every item in the products array perform the action in the code block
                    //for each o fthe item in guestCart product, find each product that has similar userId with the userCart products
                    guestCart.products.forEach(gcItems => {

                        const existingItems = userCart.products.find(
                            userItems => userItems.productId.toString() === gcItems.productId.toString()
                        );
                        //adds similar items and adds new items
                        if (existingItems) { existingItems.quantity += gcItems.quantity; } else {
                            //adding not similare items
                            userCart.products.push({
                                productId: gcItems.productId,
                                quantity: gcItems.quantity,
                                unitPricerice: gcItems.unitPrice
                            });
                        }
                    });

                    await userCart.save()

                    //deleting the guest cart
                    await cartModel.deleteOne({ cartId })
                } else {
                    //say the guest has cart but not cart as a logged in user we thus convert the guest cart to user cart by changin the id linked to it
                    guestCart.userId = userExist._id;
                    guestCart.cartId = undefined;//removing this prevents duplicate carts
                    await guestCart.save();
                }
                //clearing the cartId from cookie
                res.clearCookie("cartId")
            }
        }
        //we create the tokens last to afford situations where user has loggd in/login token but an incorrect cart state
        //ensures that authentication tokens are not issued if cart merging fails.
        //if the password is valid, hthen we create the tokens
        const { accessToken, refreshToken } = createToken(userExist)

        //storing the refresh token to the user records
        userExist.refreshToken = refreshToken
        await userExist.save();

        //returning the tokens via cookies
        res.cookie("accessToken", accessToken, { httpOnly: true, secure: false, maxAge: 10 * 60 * 1000 });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 })


        //returning a response
        return res.status(200).json({
            message: "Welcome, we got alot in store for you..",
            userDetails: {
                name: userExist.name,
                cart: userCart,
                orders: userExist.orders
            }
        });

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Something went wrong." })
    }
}