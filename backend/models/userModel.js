import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        // unique: true || for testing purpose only we have done this comma as email should be uyniwue but just ofr development thing we have done this
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ['HOD', 'Faculty', 'Student'], // Restrict the values to specific roles
        required: true
    },
    fullname:{
        type:String,
        require: true
    },
    mobile:{
        type:String,   
        require: true 
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    // the token or otp which we will send through email for reseting the password will be stored here
    resetPasswordToken: String,
    // the token or otp which we will send through email for reseting the password will be expired in this much time
    resetPasswordTokenExpiresAt: Date,
    // the token or otp which we will send through email for verifing the user will be stored here
    verificationToken: String,
    // the token or otp which we will send through email for verifing the user will be expired in this much time
    verificationTokenExpiresAt: Date

},{ timestamps: true })

export const User = mongoose.model('User', userSchema);