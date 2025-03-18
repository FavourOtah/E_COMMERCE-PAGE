import express from "express";
import dotenv from "dotenv"
import mongoose from "mongoose";
import cookieParser from "cookie-parser"
import { adminAuthorization } from "./middlewares/adminAuth.js";
import { authorization } from "./middlewares/authorization.js";
import orderRoutes from "./routes/orderRoutes.js"

import authenticationROutes from "./routes/authenticationRoutes.js";
import userRoutes from "./routes/usersRoutes.js";
import productRoutes from "./routes/productsRoutes.js";
import cartRoutes from "./routes/cartRoutes.js"





//loading environment variables
dotenv.config();


//creating instance of express
const app = express();

const PORT = process.env.PORT

app.use(express.json());
app.use(cookieParser());


//establishing connection with mongoose DB
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connection to Database Successful")
    })
    .catch((error) => {
        console.log("Something went wrong with the connection to the Database.")
        console.log(error)
    })

//connecting routes to server file
app.use(authenticationROutes)
app.use("/user", userRoutes)
app.use("/products", authorization, productRoutes)
app.use("/order", authorization, orderRoutes)
app.use("/cart", authorization, cartRoutes)


//making our server listen for incoming requests
app.listen(PORT, () => {
    console.log(
        "Server running on port 1001")
})