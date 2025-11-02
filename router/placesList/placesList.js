const express = require('express');
const router = express.Router()
const { PlacesList } = require('../../models/placesModel.js')
const wrapAsync = require('../../utils/wrapAsync.js');
const MyError = require('../../MyError.js');
const { listingSchema } = require('../../schema.js')
const { isAuth, isOwner } = require('../../middleware/isAuth.js')
const passport = require('passport');

const multer = require('multer');
const { storage } = require('../../cloudConfig.js')
const upload = multer({ storage })


const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// const validateListing=(req,res,next)={

// }


router.get('/listingAll', wrapAsync(async (req, res) => {

        const AllListing = await PlacesList.find().populate({ path: "reviews", populate: { path: "author", } }).populate("owner");
        // console.log(AllListing)
        res.json(AllListing)





}));
router.get('/deletelisting/:id', isAuth, isOwner, wrapAsync(async (req, res) => {
        const { id } = req.params;
        console.log(id)


        const deleted = await PlacesList.findByIdAndDelete(id);
        console.log(deleted)
        res.json(deleted)


}));
router.post('/updateList/:id', isAuth, isOwner, upload.single("image"), wrapAsync(async (req, res) => {
        const updatelist = req.body;
        console.log(req.params.id)
        console.log(updatelist)
        //     const result=listingSchema.validate({listing:req.body});
        //         // console.log(result.error.details[0].message);
        //         let errmsg=result?.error?.details?.map((el)=>el.message).join(',');
        //         if(result.error){
        //             throw new MyError(400,errmsg)

        //         }
        //   console.log(showDetail._id)


        const updated = await PlacesList.findByIdAndUpdate(req.params.id, { ...updatelist });
        if (typeof req.file != "undefined") {
                let url = req.file.path;
                let filename = req.file.filename;
                updated.image = { url, filename };
                await updated.save();
        }
        console.log("update")
        res.json("updated")


}));

router.post('/addNewList', isAuth, upload.single("image"), wrapAsync(async (req, res) => {

        const response = await geocodingClient.forwardGeocode({
                query: req.body.location,
                limit: 1,
        }) .send()
        // console.log(response.body.features[0].geometry);
        
               
        let url = req.file.path;
        let filename = req.file.filename;

        console.log(url, "------", filename)
        console.log(req.body)
        // const result=listingSchema.validate({listing:req.body});
        // // console.log(result.error.details[0].message);
        // let errmsg=result?.error?.details?.map((el)=>el.message).join(',');
        // if(result.error){
        //     throw new MyError(400,errmsg);
        // }
        req.body.image = { url, filename };
        req.body.owner = req.user._id;
        req.body.geometry=response.body.features[0].geometry  ;
        const addNewPlace = await PlacesList.insertOne(req.body);
        console.log(addNewPlace)
        req.flash("success", "New List Created");
        res.json("Add New List");


}));


module.exports = router