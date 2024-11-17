import mongoose from "mongoose";

const subjectSchema = mongoose.Schema({
    SubjectName: {
        type:String,
        required: true
    },
    SubjectCode: {
        type: String,
        required: true
    },
    SubjectShortName: {
        type: String,
        required: true
    },
    // the below is optional field if we want then we can remove it as well
    Branch: {
        type: [String],  // Allow an array of strings
        enum: ['IT', 'CSE'], // Add more schools as needed
        required: true
    },
})

export const Subject = mongoose.model('Subject',subjectSchema);