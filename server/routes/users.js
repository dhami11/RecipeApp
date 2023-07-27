import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();
import { UserModel } from "../models/users.js";

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  if (user) {
    return res.status(400).json({ message: "Username already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserModel({ username, password: hashedPassword });
  await newUser.save();
  res.json({ message: "User registered successfully", user: newUser });
});

router.post("/login", async (req, res) => {
  const {username,password} = req.body;
  const user = await UserModel.findOne({username});
  if(!user){
    return res.status(400).json({message:"Username does not exist"});
  }
  const isPasswordCorrect = await bcrypt.compare(password,user.password);
  if(!isPasswordCorrect){
    return res.status(400).json({message:"Invalid credentials"});
  }
  const token =  jwt.sign({id:user._id},"secret")
  res.json({ token, userID: user._id });
})

export { router as userRouter };

export const verifyToken = (req, res, next) => {

  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token found" });
  }
  try {
    const decoded = jwt.verify(token, "secret");
    req.userID = decoded.id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid token" });
  }
}
