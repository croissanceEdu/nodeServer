
const mongoose =require('mongoose');


const connectDB=()=>{
//const uri=process.env.ATLAS_URI;
 const uri=process.env.LOCAL_URI;
mongoose.connect(uri,{useNewUrlParser:true, useCreateIndex:true}
);

const connection=mongoose.connection;
connection.once('open',()=>{
    console.log(`MongoDB database connection established successfully: ${connection.host}`);
});
}
module.exports=connectDB