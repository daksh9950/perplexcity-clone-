import mongoose from "mongoose";

const connectToDb = ()=>{
     mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log('connected to database')
    })
    .catch(err=>{
        console.log('err belong to',err)
    })

}

export default connectToDb