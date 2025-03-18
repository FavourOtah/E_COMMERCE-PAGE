import express from "express";
import { placeOrder, cancelOrder } from "../controllers/order/orderController.js";


const routes = express.Router()

routes.post("/placeOrder", placeOrder);
routes.delete("/cancelOrder/:id", cancelOrder)

export default routes;