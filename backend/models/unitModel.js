import mongoose from "mongoose";

const unitSchema = mongoose.Schema({
    HODId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    FacultyId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    Level: {
        type: String,
        required: true
    },
    Branch: {
        type: String,
        required: true
    },
    School: {
        type: String,
        required: true
    },
    Semester: {
        type: Number,
        required: true
    },
    Division: {
        type: Number,
        required: true
    },
    Subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    }
})

export const Unit = mongoose.model("Unit",unitSchema);