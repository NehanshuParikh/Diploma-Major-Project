import mongoose from "mongoose";

const attendanceSchema = mongoose.Schema({
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
    },
    hodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
    },
    branch: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    school: {
        type: String,
        required: true
    },
    division: {
        type: Number,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    lectureTimeFrom: {
        type: String,
        required: true
    },
    lectureTimeTo: {
        type: String,
        required: true
    },
    lectureType: {
        type: String,
        enum: ['Lab','Lecture']
    },
    proxied: {
        type: Boolean,
        required: true
    },
    presentStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    absentStudents: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }]
});

export const Attendance = mongoose.model('Attendance', attendanceSchema);