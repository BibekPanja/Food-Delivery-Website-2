import express from "express"
import { adddToCart, removeFromcart, getCart } from "../controllers/cartcontroller.js"
import authMiddleware from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.post("/add",authMiddleware, adddToCart)
cartRouter.post("/remove", authMiddleware,removeFromcart)
cartRouter.post("/get",authMiddleware,getCart)


export default cartRouter;