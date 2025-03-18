import express from "express";
import { getOneProduct, getMany, deleteProduct, newProduct, updateProduct } from "../controllers/products/productController.js";
import { adminAuthorization } from "../middlewares/adminAuth.js";
import { authorization } from "../middlewares/authorization.js";

const routes = express.Router()

routes.post("/new", authorization, adminAuthorization, newProduct)
routes.put("/update/:id", authorization, adminAuthorization, updateProduct)
routes.delete("/delete/:id", authorization, adminAuthorization, deleteProduct)
routes.get("/one/:id", getOneProduct)
routes.get("/getMany", getMany)

export default routes;