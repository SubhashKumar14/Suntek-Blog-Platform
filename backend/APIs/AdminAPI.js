import exp from 'express'
import { UserTypeModel } from '../models/UserModel.js';
export const adminRoute=exp.Router()

//read all users
adminRoute.get("/users",async(req,res)=>{
    let users=await UserTypeModel.find({},{password:0});
    res.status(200).json({message:"all users",payload:users});
})

//read all articles
adminRoute.get("/articles",async(req,res)=>{
    //read all articles
    let articles=await articleTypeModel.find().populate("author","firstName email");
    //send response
    res.status(200).json({message:"all articles",payload:articles});
})
//block the user code logic
adminRoute.put("/users/:userId/block",async(req,res)=>{
    //get userid from req
    let userId=req.params.userId;
    //find user 
    let user=await UserTypeModel.findById(userId);
    if(!user){
        return res.status(404).json({message:"user not found"});
    }
    //block user
    user.isActive=false;
    //save user
    await user.save();
    //send response
    res.status(200).json({message:"user blocked successfully"});
})

// unblock user code logic
adminRoute.put("/users/:userId/unblock",async(req,res)=>{
    //get userid from req
    let userId=req.params.userId;
    //find user 
    let user=await UserTypeModel.findById(userId);
    if(!user){
        return res.status(404).json({message:"user not found"});
    }
    //unblock user
    user.isActive=true;
    //save user
    await user.save();
    //send response
    res.status(200).json({message:"user unblocked successfully"});
})