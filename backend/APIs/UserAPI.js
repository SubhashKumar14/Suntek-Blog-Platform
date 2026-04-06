import exp from 'express'
import multer from 'multer'
import {register} from '../services/authService.js'
//import {authenticate} from '../services/authService.js'
import { articleTypeModel } from '../models/ArticleModel.js'
import {config} from 'dotenv'
import { verifyToken } from '../middlewares/verifyToken.js';
import cloudinary from '../config/cloudinary.js';
import { uploadToCloudinary } from '../config/cloudinaryUpload.js';

config();
export const userRoute=exp.Router()

const upload = multer({ storage: multer.memoryStorage() });

//register user
userRoute.post(
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
        role: "USER",
        profileImageUrl: cloudinaryResult?.secure_url,
      });

      res.status(201).json({
        message: "user created",
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

/*authenticate user 
userRoute.post("/authenticate",async(req,res)=>{
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
    res.status(200).json({message:"user login success",payload:user});
})*/
//read all the articles(protected route)
userRoute.get("/articles", verifyToken("USER"), async(req,res)=>{
    //read all active articles from db
    let articles=await articleTypeModel.find({isArticleActive:true}).populate("author","firstName email");
    //send response
    res.status(200).json({message:"all active articles",payload:articles});

})

//read one active article by id (protected route)
userRoute.get("/article/:id", verifyToken(), async (req, res) => {
    const { id } = req.params;
    let article = await articleTypeModel
        .findOne({ _id: id, isArticleActive: true })
    .populate("author", "firstName email")
    .populate("comments.user", "firstName email profileImageUrl");

    if (!article) {
        return res.status(404).json({ message: "article not found" });
    }

    res.status(200).json({ message: "article found", payload: article });
})

  //add comment to an article (protected route)
  userRoute.post("/articles/:articleId/comments", verifyToken("USER"), async (req, res) => {
    const { articleId } = req.params;
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: "comment is required" });
    }

    const articleWithComment = await articleTypeModel
      .findOneAndUpdate(
        { _id: articleId, isArticleActive: true },
        { $push: { comments: { comment: comment.trim(), user: req.user.userId } } },
        { new: true, runValidators: true }
      )
      .populate("author", "firstName email")
      .populate("comments.user", "firstName email profileImageUrl");

    if (!articleWithComment) {
      return res.status(404).json({ message: "article not found" });
    }

    res.status(201).json({ message: "comment added to article", payload: articleWithComment });
  })

//add comment to an article(protected route)
userRoute.put("/articles",verifyToken("USER"),async(req,res)=>{
    //get article id from req params
    //let articleId=req.params.articleId;
    //get comment from req body
    const {user,articleId,comment}=req.body;
    //check user(req.user)
    console.log(req.user);
    if(user !== req.user.userId){
        return res.status(403).json({message:"Forbidden"});
    }
    //find article from db
    let articleWithComment=await articleTypeModel.findByIdAndUpdate(
        articleId,
        {$push:{comments:{comment,user}}},
        {new:true,runValidators:true},
     )

    //if article not found or not active
    if(!articleWithComment || !articleWithComment.isArticleActive){
        return res.status(404).json({message:"article not found"});
    }

     //if(!articleWithComment || !articleWithComment.isArticleActive){
       // return res.status(404).json({message:"article not found"});
    //}
    //send response
    res.status(201).json({message:"comment added to article",payload:articleWithComment});
})