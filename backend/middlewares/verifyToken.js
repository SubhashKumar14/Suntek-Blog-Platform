import jwt from 'jsonwebtoken'
import { config } from 'dotenv';
   
config();

export const verifyToken=(...allowedRoles)=>{
 return async(req,res,next)=>{
    //read token from req
    try{
    const token=req.cookies.token
    console.log("token:",token)
    if(token===undefined){
        return res.status(400).json({message:"unauthorized req plz login"});
    }
    //console.log("token in verify token middleware",token)
    //verify the validity of token
    const decodedToken=jwt.verify(token,process.env.JWT_SECRET);
    
    //check if role of user is in allowed roles
    // If roles are provided, enforce role-based access. Otherwise allow any authenticated user.
    if(allowedRoles.length>0 && !allowedRoles.includes(decodedToken.role)){
        return res.status(403).json({message:"Access denied,You dont have permission to access"});
    }
    //attach user info to req object
    req.user=decodedToken;
    next();
}catch(err){
    //jwt.verify throws if token is invalid or expired
    if(err.name==="TokenExpiredError"){
    return res.status(401).json({message:"Session expired plz login again"});
    }
if(err.name==="JsonWebTokenError"){
    return res.status(401).json({message:"invalid token plz login again"});
    }
    return next(err);
        }
    }
}


