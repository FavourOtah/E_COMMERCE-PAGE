import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, default: false },
    refreshToken: { type: String },
    cart: [{ type: mongoose.Types.ObjectId, ref: "cart" }],
    orders: [{ type: mongoose.Types.ObjectId, ref: "orders" }],

}, { timestamps: true });

//using mongoose hook to simply hash a pasword before saving the user or when it is been updated
userSchema.pre("save", async function (next) {

    //scenarios where an update is being made to the password
    if (!this.isModified("password")) return next()

    //hashing the password
    this.password = await bcrypt.hash(this.password, 10)
    next()
});


//creating a function that compares password for scenarios when a user wants to log
//this method will only worl on the userModel
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
};



const userModel = mongoose.model("user", userSchema)
export default userModel