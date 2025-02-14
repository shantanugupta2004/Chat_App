import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, getUsersbyUsername } from "../models/User.js";

export const register = async(req, res)=>{
    const {username, password} = req.body;
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await createUser(username, hashedPassword);
        res.json({userId});
    }catch(error){
        console.error("Registration failed", error);
        res.status(500).json({error:"Registration failed"});
    }
    
};

export const login = async(req, res)=>{
    const {username, password} = req.body;
    try{
        const user = await getUsersbyUsername(username);
        if(!user || !(await bcrypt.compare(password, user.password))){
            return res.status(401).json({message: "Invalid credentials"});
        }
        const token = jwt.sign({userId: user.id, username: user.username}, process.env.JWT_SECRET, {expiresIn: "1h"});
        res.json({token});
    }catch(error){
        res.status(500).json({error: "Login failed"});
    }
};