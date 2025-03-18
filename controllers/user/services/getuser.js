import userModel from "../../../models/userModel.js";

export const getOneUser = async (req, res) => {
    try {
        //destructuring the id from the params
        const { id } = req.params

        //ensruing the accoutn exist
        const userExist = await userModel.findById(id)
        if (!userExist) { return res.status(404).json({ message: "User not found." }) }

        //destructuring the password out from our response
        const { password, refreshToken, ...others } = userExist;

        //returning a response
        return res.status(200).json({
            message: "User Information",
            user: others
        })


    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Something went wrong."
        })

    }
};


export const getAllUser = async (req, res) => {
    try {

        //fetching all users from the database
        const allUsers = await userModel.find().select("name email cart orders")
        return res.status(200).json({
            message: "All users fetched",
            users: allUsers
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Something went wrong."
        })

    }
};


