import exp from 'express'
import {connect} from 'mongoose'
import {config} from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { userRoute } from './APIs/UserAPI.js'
import { authorRoute } from './APIs/AuthorAPI.js'
import { adminRoute } from './APIs/AdminAPI.js'
import { commonRouter } from './APIs/commonApi.js'
//import { verifyToken } from './middlewares/verifyToken.js'

config() //process.env
//create express application
const app=exp()

const defaultAllowedOrigins = ["http://localhost:5173"];
const configuredOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.FRONTEND_URLS ? process.env.FRONTEND_URLS.split(",") : []),
]
  .map((origin) => origin?.trim())
  .filter(Boolean);
const allowedOrigins = new Set([...defaultAllowedOrigins, ...configuredOrigins]);
const allowVercelPreviews = process.env.ALLOW_VERCEL_PREVIEWS === "true";

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.has(origin)) return true;
  if (!allowVercelPreviews) return false;

  try {
    return new URL(origin).hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
};

//add cors middleware
app.use(cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials:true
}))
//add body parser middleware
app.use(exp.json())
//add cookie parser middleware
app.use(cookieParser())

app.get('/health',(req,res)=>{
    res.status(200).json({message:'ok'})
})

//connect APIs
app.use('/user-api',userRoute)
app.use('/author-api',authorRoute)
app.use('/admin-api',adminRoute)
app.use("/common-api",commonRouter)
//connect to db
const connectDB=async()=>{
    try{
    await connect(process.env.DB_URL)
    console.log("DB connection success")
    //start server
    const port = process.env.PORT || 3000;
    app.listen(port,()=>console.log(`server listening on ${port}`))
    }catch(err){
        console.log("DB connection failed",err)
    }
}
connectDB()
/*logout for user author,and admin
app.post("/logout",(req,res)=>{
    //clear the cookie named 'token'
    res.clearCookie("token",
    {
        httpOnly:true,//must match original settings
        sameSite:"lax",//must match original settings
        secure:false,//must match original settings
    });
    res.status(200).json({message:"logout success"});
    })
*/


//dealing with invalid path
app.use((req,res)=>{
    console.log(req.url)
    res.status(404).json({message:req.url+" is invalid path"})
})

//add error handling middleware
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: err.message,
    });
  }
  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.errors,
    });
  }
  // Strict schema error (unknown fields when strict:"throw")
  if (err.name === "StrictModeError") {
    return res.status(400).json({
      message: err.message,
    });
  }
  // Invalid ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID format",
    });
  }
  // Duplicate key
  if (err.code === 11000) {
    return res.status(409).json({
      message: "Duplicate field value",
    });
  }
  // Custom application/service errors with explicit status
  if (err.status) {
    return res.status(err.status).json({
      message: err.message || "Request failed",
    });
  }
  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});