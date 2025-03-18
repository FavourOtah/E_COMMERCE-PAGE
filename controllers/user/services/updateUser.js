import userModel from "../../../models/userModel.js";

export const updateUser = async (req, res) => {
    try {
        //destructuring id from req.param
        const { id } = req.params

        //getting the update data from the body
        const { name, email, cart, orders, isAdmin } = req.body;

        //putting all allowed fields in a variable
        const updateData = { name, email, cart, orders, isAdmin }

        //ensuring undefined fields are removed
        //Object.keys(updateData):this gets an array of keys(properties) in the updateData object
        //.forEach():loops through each key in updateData
        //updateDate[key] === undefined && delete updatedata[key]: this deletes the property from the object(updateData) if the value updateData[key] is undefined
        //the && used here is a shortcut for an if statement, separating the line of code to left and right side
        //if the left is true, the right is executed, that is if updateData[key]===undefined, then delete updateData[key] is exceuted.
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key])

        //it can be rewritten using 
        // Object.keys(updateData).forEach(key => {
        //     if (updateData[key] === undefined) {
        //         delete updateData[key];
        //     }
        // });


        //updating
        const updatedUser = await userModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            })
        };


        return res.status(200).json({
            message: "User successfully updated.",
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            cart: updatedUser.cart,
            orders: updatedUser.orders
        });

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Something went wrong."
        })
    }
};