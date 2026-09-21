import mongoose from "mongoose";

const connectDB = async()=>{
    try{

        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

    }catch(error){
         
        console.error("MongoDB Connection failed", error);
        process.exit(1);  // program ended with error and if process.exit(0)->program ended successfully

    }
}

export default connectDB;

