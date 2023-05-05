const mongoose = require("mongoose");
 const url =process.env.MONG_URL;
mongoose.set('strictQuery', false);
mongoose.connect(url,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }
    ,(err)=>{
        if (err) {
            console.log(err);
        }else{
            console.log("database connected");
        }
    }
);