import userModel from "../../../models/userModel.js"
import { createToken } from "../../../utils/token.js"


export const createUser = async (req, res) => {
    try {
        //getting payload from the req
        const { password, email, name, ...others } = req.body

        //ensuring that these columns weere actually provided with data
        if (!password || !email || !name) {
            return res.status(400).json({
                message: "The email, password and name are required columns"
            })
        };

        //checking foe uniqueness of the email
        const userExist = await userModel.findOne({ email })
        if (userExist) {
            return res.status(400).json({
                message: "email provided is already linked to an existing account"
            })
        };

        //saving the new user 
        const newUser = new userModel({ password, email, name, ...others })
        await newUser.save()

        //creating the access and refreshTokens for the newUser just created
        const { refreshToken } = createToken(newUser)

        //updating the refreshToken row
        newUser.refreshToken = refreshToken;
        await newUser.save()

        //sending the tokens via cookies
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 })

        //we dont hve to hash the password here, becasue we already made use of mongoose hook.

        //returning a response
        return res.status(200).json({
            name: newUser.name,
            email: newUser.email,
            cart: newUser.cart,
            orders: newUser.orders
        })


    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}