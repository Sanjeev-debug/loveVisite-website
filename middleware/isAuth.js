const MyError=require('../MyError.js')
const {PlacesList}=require('../models/placesModel.js')
const Review = require('../models/review.js')
module.exports.isAuth=(req,res,next)=>{
    
    if(req.isAuthenticated()){
        next()
    }else{
        
        next( new MyError(400,"User not logged In"))
    }
}

module.exports.isOwner=async(req,res,next)=>{
      let placelist= await PlacesList.findById(req.params.id);
               if(!placelist.owner._id.equals(req.user._id)){
                    throw new MyError(400,"You are not the owner of this place List ");
               }
               next();
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    console.log(req.params)
      let review= await Review.findById(req.params.reviewId);
               if(!review.author._id.equals(req.user._id)){
                    throw new MyError(400,"You are not the author of this place List ");
               }
               next();
}