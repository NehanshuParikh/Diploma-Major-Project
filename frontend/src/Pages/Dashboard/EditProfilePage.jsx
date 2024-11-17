import React, { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../../Components/DashboardComponents/DashboardLayout';
import ProfileContext from '../../Context/ProfileContext';
import toast from 'react-hot-toast';

const EditProfileForm = () => {
    const { profileData, loading } = useContext(ProfileContext);

    const [formData, setFormData] = useState({
        email: '',
        userId: '',
        fullName: '',
        profilePhoto: null,
    });

    useEffect(() => {
        // Populate formData with profileData once it's available
        if (profileData) {
            setFormData({
                email: profileData.email || '',
                userId: profileData.userId || '',
                fullName: profileData.fullName || '',
                mobile: profileData.mobileNumber || '',
                profilePhoto: profileData.profilePhoto || null, // Display current photo if available
            });
        }
    }, [profileData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // const handlePhotoUpload = (e) => {
    //     setFormData({ ...formData, profilePhoto: e.target.files[0] });
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(formData);
        const response = await fetch('http://localhost:5000/api/user/edit-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(formData), // Ensure you're sending the form data
        });

        // Parse the JSON response
        const data = await response.json();

        if (data.success) {
            console.log('Data Updated');
            toast.success('Profile Updated')
        } else {
            console.log('Data Failed to Update');
            toast.error('Profile Not Updated. Try Again Later')

        }
    };

    // If data is still loading
    if (loading) {
        return (
            <DashboardLayout>
                <div>Loading...</div>
            </DashboardLayout>
        );
    }

    // If profileData is unavailable
    if (!profileData) {
        return (
            <DashboardLayout>
                <div>Profile data not available</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex justify-center items-center h-screen bg-gray-100 ">
                <form
                    onSubmit={handleSubmit}
                    className="w-full lg:mt-0 mt-32 max-w-lg bg-white p-8 rounded-lg shadow-lg"
                >
                    <h2 className='text-xl font-semi-bold mb-4'>User Profile:</h2>
                    {/* Profile Photo */}
                    <div className="flex justify-center items-center mb-6 flex-col gap-2">
                        <label htmlFor="profilePhoto" className="cursor-pointer">
                            <div className="w-32 h-32 overflow-hidden border-4 border-gray-200">
                                <img
                                    src={formData.profilePhoto}
                                    alt="Profile"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </label>
                        <p className='text-red-500 text-sm text-center'>NOTE: This photo is used for attendance. Contact HOD/Admin for changing the photo. Inform higher authorities if any details are updated here to avoid incorrect records.</p>
                    </div>
                    {/* the below profile photo is with changing the profile pic so if we want to change the profile pic then uncomment below code */}
                    {/* Profile Photo */}
                    {/* <div className="flex justify-center mb-6">
            <label htmlFor="profilePhoto" className="cursor-pointer">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200">
                {formData.profilePhoto ? (
                  <img
                    src={typeof formData.profilePhoto === 'string' ? formData.profilePhoto : URL.createObjectURL(formData.profilePhoto)}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Upload Photo
                  </div>
                )}
              </div>
              <input
                type="file"
                id="profilePhoto"
                name="profilePhoto"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>
          </div> */}

                    <div className="w-full flex items-center justify-center gap-4">
                        {/* Full Name */}
                        <div className="mb-4">
                            <label htmlFor="fullName" className="block text-gray-700">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {/* Mobile */}
                        <div className="mb-4">
                            <label htmlFor="mobile" className="block text-gray-700">Mobile</label>
                            <input
                                type="number"
                                id="mobile"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>
                    {/* Email */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>


                    {/* User ID */}
                    <div className="mb-4">
                        <label htmlFor="userId" className="block text-gray-700">User ID</label>
                        <input
                            type="text"
                            id="userId"
                            name="userId"
                            value={formData.userId}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your User ID"
                            readOnly
                        />
                    </div>



                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default EditProfileForm;
