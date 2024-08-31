import { mailtrapClient, sender } from "./mailtrapConfig.js"
import dotenv from 'dotenv';
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, MARKS_REQUEST_APPROVAL } from "./emailTemplates.js";

dotenv.config()

export const sendVerificationEmail = async (email, verificationToken) => {
    const receipent = [{ email }]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: receipent,
            subject: 'Verify your email',
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        })
        console.log("Email sent successfully")

    } catch (error) {
        console.error('Error wihile sending the email: ', error)
        throw new Error('Error while sending the email: ', error)

    }
}

export const sendPermissionAprovedForMarksInputting = async (email, examType, subject, level, branch, school,semester,division, HODName) => {
    const recipient = [{ email }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: 'Your permission to input marks has been approved',
            html: MARKS_REQUEST_APPROVAL
                .replace("{subject}", subject)
                .replace("{examType}", examType)
                .replace("{level}", level)
                .replace("{branch}", branch)
                .replace("{school}", school)
                .replace("{semester}", semester)
                .replace("{division}", division)
                .replace("{HODName}", HODName),
            category: "Permission Approval"
        });
        console.log("Email sent successfully");
    } catch (error) {
        console.error('Error while sending the email: ', error);
        throw new Error('Error while sending the email');
    }
};

export const sendWelcomeEmail = async (email) => {
    const receipent = [{ email }]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: receipent,
            template_uuid: "78c16719-6fb0-45d2-acd6-061600cd2390",
            template_variables: {
                "company_info_name": "Code Red (Developers)",
                "name": "User"
            }
        })
        console.log("Email sent successfully", response)

    } catch (error) {
        console.log("Error in Email Send Welcome Email handler ")
        res.status(500).json({ success: false, message: 'server Error' })

    }
}
export const sendPasswordResetEmail = async (email, userId, resetURL) => {
    const receipent = [{ email }]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: receipent,
            subject: 'Reset your password',
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password reset"
        })
        console.log("Email sent successfully")
    } catch (error) {
        console.error('Error while sending the email: ', error)
    }
}
export const sendResetSuccessEmail = async (email) => {
    const receipent = [{ email }]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: receipent,
            subject: 'Password Reset Successfully',
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password reset"
        })
        console.log("Password reset email sent successfully")
    } catch (error) {
        console.error('Error while sending the Password reset email: ', error)
    }
}