const mongoose =require('mongoose');
const Review=require('./review.js');
const { required } = require('joi');


const placesListSchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    price:{
          type:Number,
        required:true,
    },
    image:{
       url:String,
       filename:String,
      
    },
    location:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
   geometry:{
    type:{
        type:String,
        emuM:['Point'],
        required:true
    },
    coordinates:{
        type:[Number],
        required:true ,
    },
   },

});
placesListSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){

        await Review.deleteMany({_id:{$in :listing.reviews}});
    }
});

exports.PlacesList=mongoose.model('PlacesList',placesListSchema);
