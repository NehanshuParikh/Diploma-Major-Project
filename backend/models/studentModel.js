import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
    enrollmentId: {
        type: String,
        required: true
    },
    password: {
        type:String,
        required:true
    },
    profilePhoto: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    division: {
        type: Number,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        default: 1
    },
    enrollmentDate:{
        type:Date,
        required: true
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
    verificationTokenExpiresAt: Date,
    branch: {
        type: String,
        enum: ['IT', 'CSE'], // Add more schools as needed
        required: true
    },
    school: {
        type: String,
        enum: ['KSDS', 'KSET'], // Add more schools as needed
        required: true
    },
    level: {
        type: String,
        required: true
    }
},{ timestamps: true });

export const Student = mongoose.model('Student',studentSchema);