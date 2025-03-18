import express from "express";


import { login, logout, refresh } from "../controllers/authentication/authenticationControllers.js";

const routes = express.Router()


routes.post("/login", login);
routes.post("/logout", logout)
routes.post("/refresh", refresh)

export default routes