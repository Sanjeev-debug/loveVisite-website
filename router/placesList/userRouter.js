const express=require('express');
const router=express.Router()
const MyError = require('../../MyError.js');
const {reviewSchema}=require('../../schema.js')
const wrapAsync =require('../../utils/wrapAsync.js');
const User=require('../../models/user.js');
const passport = require('passport');


router.post('/userRegister',wrapAsync(async(req,res)=>{
  try{
    //  console.log('hello')
         let {username,email,password}=req.body;
         console.log(username,email,password);
        

         const newUser= new User({email,username});

       const registeredUser=  await  User.register(newUser,password);
       req.login(registeredUser,(err)=>{
        if(err){
          next(err);
        }
        console.log(registeredUser,"------")
          res.json(req.isAuthenticated());
       })
  }catch(err){
    res.json(err)
  }
 
}));
router.post('/login',passport.authenticate('local',{failureFlash:true}),wrapAsync(async(req,res)=>{
  
  try{
    //  console.log('hello')
         let {username,password}=req.body;
         console.log(username,password);
        

      //    const newUser= new User({email,username});

      //  const registeredUser=  await  User.register(newUser,password);
       
         res.json({isAuthenticated:req.isAuthenticated(),currentUser:req.user});
  }catch(err){
    res.json(err)
  }
 
}));

router.get('/logout',(req,res,next)=>{
  req.logout((err)=>{
     if(err)return next(err);
     
     res.json({isAuthenticated:req.isAuthenticated(),currentUser:req.user});
    })
})



module.exports = router; 