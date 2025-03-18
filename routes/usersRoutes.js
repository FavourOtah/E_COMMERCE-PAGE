import express from "express";
import { authorization } from "../middlewares/authorization.js";
import { adminAuthorization } from "../middlewares/adminAuth.js";
import { createUser, deleteUser, updateUser, getAllUser, getOneUser } from "../controllers/user/userControllers.js"


const routes = express.Router();

routes.post("/create", createUser)
routes.delete("/delete/:id", authorization, deleteUser)
routes.put("/update/:id", authorization, adminAuthorization, updateUser)
routes.get("/getone/:id", authorization, adminAuthorization, getOneUser)
routes.get("/all", authorization, adminAuthorization, getAllUser)


export default routes

