import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
    hodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',  // Refers to the HOD who assigns the permission
        required: true,
    },
    facultyId: {
        type: String,
        ref: 'Staff',  // Refers to the faculty who is assigned the duty
        required: true,
    },
    facultyName: {
        type: String,  // Store faculty's full name for easier access
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    examType: {
        type: String,
        required: true,
    },
    branch: {
        type: String,
        required: true,
    },
    semester: {
        type: Number,
        required: true,
    },
    division: {
        type: Number,
        required: true,
    },
    school: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    dutyName: {  // New field to store duty name
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed'],  // Track if the duty has been completed
        default: 'Pending',
    },
    marksSubmitted: {
        type: Boolean,
        default: false,  // Initially, marks have not been submitted
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: { type: Date, required: true }, // Expiration date
});

// Compound unique index to ensure a faculty member can't be assigned the same task twice
permissionSchema.index({ facultyId: 1, subject: 1, examType: 1, semester: 1 }, { unique: true });

export const Permission = mongoose.model('Permission', permissionSchema, 'permissions');
