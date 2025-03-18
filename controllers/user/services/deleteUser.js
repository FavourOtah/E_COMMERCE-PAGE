import userModel from "../../../models/userModel.js";


export const deleteUser = async (req, res) => {
    try {
        //getting the id of the user from the 
        //I am not inputing authentication in this controller because in the routes, I would insert authentication middlewares.
        const { id } = req.params

        //finding the user with that id
        const userData = await userModel.findById(id)
        if (!userData) {
            return res.status(404).json({
                message: "No user found with that id."
            })
        };


        //deleting the user
        await userModel.findByIdAndDelete(id)
        return res.status(202).json({
            message: "Account successfully deleted."
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}