const mongoose= require("mongoose");
require("dotenv").config();
exports.connectWithDb=()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>console.log("Db Connected Successfully"))
    .catch((error)=>{
        console.log(error);
        console.log("Db Connection Failed");
        process.exit(1);
    })
}