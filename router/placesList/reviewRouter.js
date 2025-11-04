const express=require('express');
const router=express.Router()
const Review=require('../../models/review.js')
const {PlacesList}=require('../../models/placesModel.js')
const wrapAsync =require('../../utils/wrapAsync.js');
const MyError = require('../../MyError.js');
const {reviewSchema}=require('../../schema.js');
const { isAuth, isReviewAuthor } = require('../../middleware/isAuth.js');

router.post("/addReview/:id",isAuth,wrapAsync(async(req,res)=>{
        
         const result=reviewSchema.validate({review:req?.body});
                
                let errmsg=result.error?.details?.map((el)=>el.message).join(',');
                if(result.error){
                    throw new MyError(400,errmsg)
                }
    
        const listing = await PlacesList.findById(req.params.id);
        let newReview= new Review(req.body);
        newReview.author=req?.user?._id;
        console.log(newReview)
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();

        console.log("review saved")
         const populatedListing = await listing.populate({ path: "reviews", populate: { path: "author", } });
        
        res.json(populatedListing );

       }));

router.post('/deleteReview/:id/:reviewId',isAuth,isReviewAuthor,wrapAsync( async(req,res)=>{
    const listing = await PlacesList.findById(req.params.id);
            const {id,reviewId}=req.params;
            console.log(id,reviewId)
            await PlacesList.findByIdAndUpdate(id,{$pull:{reviews : reviewId}});
            
       const deleted= await Review.findByIdAndDelete(reviewId);
        console.log(deleted)
        const populatedListing = await listing.populate({ path: "reviews", populate: { path: "author", } });
        res.json(populatedListing);
    
     
}));

module.exports=router