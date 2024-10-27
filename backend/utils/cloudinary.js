import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to delete an image from Cloudinary
const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) {
      return false;
    }

    // Extract the public_id from the image URL
    const publicId = imageUrl.split('/').pop().split('.')[0]; // Assuming the public_id is the filename before the extension
    const res = await cloudinary.uploader.destroy(publicId);

    console.log('Cloudinary image deleted:', res);
    return res.result === 'ok';
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
};

// Function to upload the file
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null; // Return error if no file path is found
    }

    // Upload to Cloudinary
    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });

    // Check if the upload was successful
    if (res && res.url) {
      console.log('File successfully uploaded to Cloudinary. URL:', res.url);

      // Delete the local file after successful upload
      fs.unlinkSync(localFilePath);
      console.log('Local file deleted:', localFilePath);

      return res.url;
    } else {
      console.error('Upload to Cloudinary failed.');
      return null; // Return null if the upload fails for any reason
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return null; // No need to delete the file here, as the upload failed
  }
};


// Middleware to handle both new and updated profile image uploads
const handleProfileImageUpload = async (localFilePath, existingImageUrl) => {
  try {
    if (existingImageUrl) {
      // If user already has an image, delete the old image before uploading the new one
      await deleteFromCloudinary(existingImageUrl);
    }

    // Upload new image to Cloudinary
    const newImageUrl = await uploadOnCloudinary(localFilePath);
    return newImageUrl;
  } catch (error) {
    console.error('Error handling profile image upload:', error);
    return null;
  }
};

export { handleProfileImageUpload, uploadOnCloudinary, deleteFromCloudinary };
