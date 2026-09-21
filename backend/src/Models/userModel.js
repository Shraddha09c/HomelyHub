//Model: A model defines the structure/rules of the data that your application will store in the database.A User should have these fields, and these fields should have these types/rules
//Schema: design og form
//finished work=> Model: Actual form which u give to students

//user schema
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "node:crypto";

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: [true, "Please Enter Your Name"],
            trim: true,
            maxLength: [50, "Your Name cannot be longer than 50 characters"]
        },
        email:{
            type: String,
            required: [true, "Please Enter Your Email ID"],
            unique: true,
            lowercase: true,
            trim: true,
            validate: [validator.isEmail, "Please Enter Valid Email ID"]
        },
        password:{
            type: String,
            required: [true, "Please Enter Your Passwaord"],
            minlength: [6, "Your Password must be longer then 6 characters"],
            select: false
        },
        passwordConfirm:{
            type: String,
            required: [true, "Please Confirm Your Password"],
            validate: {
                validator:function(el){
                    return el === this.password
                },
                message: "Password Does't Match !"
            }
        },
        phoneNumber:{
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        role:{
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        avatar:{
            url:{type:String},
            public_id:{type:String}
        },
        passwordChangeAt:{
            type: Date,

        },
        passwordResetToken:{
            type: String,
            select: false,
            index: true
        },
        passwordResetExpires:{
            type: Date,
            select: false,
        },
    },
    {timestamps:true}
)


//settings to not pass in response from server: this is to remove unwanted/impPersonal field brfore sending it to frontend during response from mongodb
userSchema.set("toJSON",{
    transform:function(doc,ret){
        delete ret.password;
        delete ret.passwordConfirm;
        delete ret.passwordChangeAt;
        delete ret.passwordResetExpires;
        delete ret.__v;
        return ret;
    }
})

//password logic
//Hashing
userSchema.pre("save", async function(){
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined;
})

//login check
//test123 user type but in db it is in encrypted form like efnr7yvg3ebcds7v so how it will match and allow user to login
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}

//if someone stole our password/token then we change our password so older token must get rejected/should stop working
userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangeAt){
        const changedTimestamp = parseInt(
            this.passwordChangeAt.getTime()/1000,
            10
        );
        return JWTTimestamp < changedTimestamp
    }
    return false;
}

//forgot password
userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.createPasswordResetToken = crypto.createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.passwordResetExpires = Date.now() +10 *60 *1000;
    return resetToken;
}

const User = mongoose.model("User", userSchema);
//in mongoDB : users -> collection name becomes in pural form
export {User};
