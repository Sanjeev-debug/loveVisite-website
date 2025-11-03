if(process.env.NODE_ENV !='production'){
    require('dotenv').config()

}

const express=require('express');
const app=express();
const cors = require("cors");
const mongoose=require('mongoose');
const PlaceRouter=require('./router/placesList/placesList.js');
const ReviewRouter=require('./router/placesList/reviewRouter.js');
const UserRouter=require('./router/placesList/userRouter.js');
const MyError =require('./MyError.js');
const session=require('express-session');
const MongoStore = require('connect-mongo');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');
const PORT=process.env.PORT || 3000;




app.use(cors({
      origin: process.env.FRONTEND_URL, 
      credentials: true,             
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.set('trust proxy', 1);


const store=MongoStore.create({
    mongoUrl:process.env.ATLASBD,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("error in MONGO SESSION STORE",)
})



const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        // expires:Date.now() + 7*24*60*60*1000,
        maxAge :7*24*60*60*1000,
        httpOnly:true,
        secure: process.env.NODE_ENV === "production", 
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    }
}



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// app.use((req,res,next)=>{
//     res.locals.success=req.flash("success");
//     next()
// })


async function  main(){
    await mongoose.connect(process.env.ATLASBD);
    
}
main().then(()=>{console.log('Connected MongoDB Atlas')}).catch((err)=>{console.log(err)});


app.use('/',PlaceRouter);
app.use('/',ReviewRouter);
app.use('/',UserRouter);




app.get('/set-session', (req, res) => {
  req.session.user = "Sanjeev";
  console.log(req.session)
  res.send("Session created!");
});

app.all(/.*/,(req,res,next)=>{
    next(new MyError(404 , "Page Not Found"))
});

app.use((err,req,res,next)=>{
    let {status=500,message="something went  wrong"}=err;
    console.log(message,status);
    res.status(status).json(message);
    
});

app.listen(PORT,()=>{console.log(`server is runnning on PORT : ${PORT}`)});