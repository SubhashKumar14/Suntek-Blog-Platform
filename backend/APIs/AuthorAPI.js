import exp from 'express'
import multer from 'multer'
import {register} from '../services/authService.js'
import {config} from 'dotenv'
//import { UserTypeModel } from '../models/UserModel.js';
import { articleTypeModel } from '../models/ArticleModel.js';
import { checkAuthor } from '../middlewares/checkAuthor.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import cloudinary from '../config/cloudinary.js';
import { uploadToCloudinary } from '../config/cloudinaryUpload.js';

config();
export const authorRoute=exp.Router()

const upload = multer({ storage: multer.memoryStorage() });

//register author(public)
authorRoute.post(
  "/users",
  upload.single("profileImageUrl"),
  async (req, res, next) => {
    let cloudinaryResult;

    try {
      let userObj = req.body;

      //  Step 1: upload image to cloudinary from memoryStorage (if exists)
      if (req.file) {
        cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      }

      // Step 2: call existing register()
      const newUserObj = await register({
        ...userObj,
        role: "AUTHOR",
        profileImageUrl: cloudinaryResult?.secure_url,
      });

      res.status(201).json({
        message: "author created",
        payload: newUserObj,
      });
    } catch (err) {
      // Step 3: rollback 
      if (cloudinaryResult?.public_id) {
        await cloudinary.uploader.destroy(cloudinaryResult.public_id);
      }

      next(err); // send to your error middleware
    }
  }
);
/*authenticate author(public)

authorRoute.post("/authenticate",async(req,res)=>{
    //get user credential from req body
    let userCred=req.body;
    //call authenticate service
    let {token,user}=await authenticate(userCred);
    //save token in cookie
    res.cookie("token",token,
        {
            httpOnly:true,
            sameSite:"lax",
            secure:false,
        });
    //send response
    res.status(200).json({message:"alogin success",payload:user});
})*/
//create article (author)(protcted route)
authorRoute.post("/articles",verifyToken("AUTHOR"),async(req,res)=>{
    //get article obj from req body
    let article=req.body;
    
    //create article
    let newArticleDoc=new articleTypeModel(article);
    //save article document
    let createdArticleDoc=await newArticleDoc.save();
    //send response
    res.status(201).json({message:"article created",payload:createdArticleDoc});
})
//read articles of author (protected route)
authorRoute.get("/articles/:authorId",verifyToken("AUTHOR"),async(req,res)=>{
    //get author id 
    let authorId=req.params.authorId;
    //read articles of the author
    let articles=await articleTypeModel.find({author:authorId,isArticleActive:true}).populate("author", "firstName email");
    //let articles=await articleTypeModel.find({author:authorId,isArticleActive:true}).populate("author","firstName email");
    //send res
    res.status(200).json({message:"author articles",payload:articles});
})

/*read ALL articles of author (protected route)
authorRoute.get("/articles/:authorId",verifyToken,checkAuthor,async(req,res)=>{
    let authorId=req.params.authorId;
    let articles=await articleTypeModel.find({author:authorId});
    res.status(200).json({message:"all author articles",payload:articles});
})*/

//edit article(protected route)
authorRoute.put("/articles",verifyToken("AUTHOR"),async(req,res)=>{
    //get modified article from req body
    let {articleId,title,category,content,author}=req.body;
    //find article  from req 
    let articleOfDb=await articleTypeModel.findOne({_id:articleId,author:author});
    //if article not found
    if(!articleOfDb){
        return res.status(401).json({message:"article not found"});
    }
    /*check the article is published by author is received from client
    if(articleOfDb.author.toString()!==req.params.authorId){
        return res.status(403).json({message:"access denied"});
    }*/
    //update the article(protected route)
    let updatedArticle=await articleTypeModel.findByIdAndUpdate(articleId,
        {
            $set:{title,category,content},
        },{new:true,
            runValidators:true
        });
    //save the updated article
    //updatedArticle=await updatedArticle.save();
    //send response
    res.status(200).json({message:"article updated",payload:updatedArticle});
})

//delete(soft delete) article(protected route)
authorRoute.patch("/articles/:id/status",verifyToken("AUTHOR"),async(req,res)=>{
    const {id}=req.params;
    const {isArticleActive}=req.body;

    if(typeof isArticleActive!=="boolean"){
        return res.status(400).json({message:"isArticleActive must be a boolean value"});
    }

    //find article from db
    let articleOfDb=await articleTypeModel.findById(id);
    //if article not found
    if(!articleOfDb){
        return res.status(404).json({message:"article not found"});
    }
    //check the article is published by author is received from client
    if(articleOfDb.author.toString()!==req.user.userId){
        return res.status(403).json({message:"access denied"});
    }
    //already in requested status
    if(articleOfDb.isArticleActive===isArticleActive){
        return res.status(400).json({message:`article is already ${isArticleActive ? "Active" : "Deleted"}`});
    }

    //update status of the article
    articleOfDb.isArticleActive=isArticleActive;
    await articleOfDb.save();

    //send response
        res.status(200).json({
        message: `Article ${isArticleActive ? "restored" : "deleted"} successfully`,
        payload: articleOfDb,
    });
})
