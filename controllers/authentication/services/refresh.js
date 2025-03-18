import userModel from "../../../models/userModel.js";
import jwt from "jsonwebtoken"


export const refresh = async (req, res) => {
    try {
        //destructure the refreshToken from the cookies
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(400).json({
                message: "missing refresh token"
            })
        }

        //searching for the user based on the refreshToken
        //why we dont search using the id is because when a user logs out/refresh a new token is assigned so an old token shouldnt be valid
        //so searching with the token would help us to know we searching with the current token assigned. using the id, would defintiely produce the user but then we wont be able to tell 
        //it is an old token that might have expired.
        const userExist = await userModel.findOne({ refreshToken });
        if (!userExist) {
            return res.status(404).json({
                message: "No account linked to the refresh token"
            })
        };

        //verifying the token provided
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        //creating newAccess Token
        const newAccessToken = jwt.sign({ userId: payload._id, isAdmin: payload.isAdmin }, process.env.ACCESS_TOKEN_SECRET)

        //sending it back via cookies
        res.cookie("accessToken", newAccessToken, { httpOnly: true, secure: false, maxAge: 10 * 60 * 1000 })
        return res.status(200).json({
            message: "Token successfully refreshed."
        });

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Something went wrong"
        })
    }

}