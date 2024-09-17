import mongoose from 'mongoose';

const permissionRequestSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    examType: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    branch: {
        type: String,
        required: true,
    },
    division: String,
    level: String,
    school: {
        type: String,
        required: true,
    },
    semester: String,
    hodId: {
        type: String,
        required: true,
    },
    facultyName: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    },
    expiresAt: {
        type: Date,
    },
}, { timestamps: true });

permissionRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PermissionRequest = mongoose.model('PermissionRequest', permissionRequestSchema);