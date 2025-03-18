import express from "express";
import { addToCart, clearCart, getCartDetails, removeFromCart } from "../controllers/cart/cartController.js";


const routes = express.Router();

routes.post("/add", addToCart);
routes.post("/remove", removeFromCart);
routes.post("/clearCart", clearCart)
routes.get("/cartDetails", getCartDetails);

export default routes; 
