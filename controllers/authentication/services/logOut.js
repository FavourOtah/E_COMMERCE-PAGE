import userModel from "../../../models/userModel.js";

export const logout = async (req, res) => {
    try {
        //getting the refreshToken from the cookies
        const { refreshToken } = req.cookies

        //finding user based on the refreshToken
        const userEXist = await userModel.findOne({ refreshToken })
        if (!userEXist) {
            return res.status(404).json({
                message: "No accounts with that refresh token, how are you logged in?"
            })
        };



        //updating the refreshTokens since the user is logging out
        userEXist.refreshToken = null;
        await userEXist.save()

        //deleting the tokens from the cookies
        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")
        return res.status(200).json({
            message: "Hope to see you soon."
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Something went wrong."
        })
    }
}