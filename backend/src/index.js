import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import { router } from "./routes/userRoutes.js"
import { propertyRouter } from "./routes/propertyRoutes.js";
import { bookingRouter } from "./routes/bookingRoutes.js";
import { tripRouter } from "./routes/tripRoutes.js";

dotenv.config();

const app = express();

//middleware: every request passes through this bridge 
//express.json: undersatnds json body - a body that reads data
app.use(express.json({limit:"100mb"}));   //by default express set limit to 100kb

//url-encoded: kinds off translator , when html data is submitted it is not in json form, this middleware understands that
app.use(express.urlencoded({limit:"100mb", extended:true}));

//cookie-parser: after logging we get a token by server, this token(small piece of text-unique identifier which is used for session management which helps to identify user of every request) is stored in cookie, so cookieParser splits it and gives us clean object 
app.use(cookieParser());
app.use(cors({
    origin:process.env.ORIGIN_ACCESS_URL,
    credentials: true
}))

const port = process.env.PORT;

// one test route
app.get("/",(req,res)=>{
    res.send("HomelyHub server is running");
});

app.use("/api/v1/rent/user", router);
app.use("/api/v1/rent/listing", propertyRouter);
app.use("/api/v1/rent/user/booking", bookingRouter);
app.use("/api/v1/rent/trip", tripRouter);

connectDB();

app.listen(port,()=>{
    console.log(`Application is running on port no: ${port}`);
});

