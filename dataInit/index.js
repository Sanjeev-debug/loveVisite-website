const initData =require('./data.js')
const mongoose =require('mongoose');
const {PlacesList}=require('../models/placesModel.js');


async function  main(){
    
    await mongoose.connect('mongodb+srv://mssaisanjeev:Sanjeev%40111@sanjeev6397.yk1ge.mongodb.net/VisitPlace?retryWrites=true&w=majority&appName=Sanjeev6397');
    
}
main().then(()=>{console.log('Connected MongoDB Atlas')}).catch((err)=>{console.log(err)})


const initDB=async()=>{
  await  PlacesList.deleteMany({});
//  initData.data= initData.data.map((obj)=>({...obj,owner:'68f8eb398cf41c9539480bcd'}))
//   await  PlacesList.insertMany(initData.data)
    console.log('data was initialized')
}

initDB();