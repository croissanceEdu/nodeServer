
const mongoose = require('mongoose');


const connectDB = () => {

    // const uri = process.env.ATLAS_URI;
    // const uri = process.env.LOCAL_URI; 
    // const uri = {
    //     LOCAL_URI: process.env.LOCAL_URI,
    //     ATLAS_URI: process.env.ATLAS_URI
    // }
    // mongoose.connect(uri[process.env.DB_SELECT], { useNewUrlParser: true, useCreateIndex: true }
    // );

    const uri = process.env[process.env.DB_SELECT];

    mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true }
    );

    const connection = mongoose.connection;
    connection.once('open', () => {
        console.log(`MongoDB database connection established successfully: ${connection.host}`);
    });
}
module.exports = connectDB