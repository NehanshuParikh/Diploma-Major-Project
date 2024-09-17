import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../../Components/DashboardComponents/DashboardLayout';
import { FaTrashAlt } from 'react-icons/fa'; // Importing the delete icon from react-icons
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const BASEURL = 'http://localhost:5000/api';
const token = 'YOUR_AUTH_TOKEN_HERE';

const ManagingRequest = () => {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [userType, setUserType] = useState('Faculty'); // Default userType set to 'Faculty'
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
  const [actionType, setActionType] = useState(''); // State to manage the action type (approve or reject)
  const [selectAllAction, setSelectAllAction] = useState(false); // Flag to manage Select All action
  const [isPendingRequestPresent, setIsPendingRequestPresent] = useState(false); // Flag to manage pending requests
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, requestId: null, isBulk: false }); // Delete confirmation dialog
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`${BASEURL}/marksManagement/manage-permission`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch permission requests');
        }

        const data = await response.json();
        setRequests(data.allPermissions);
        setIsPendingRequestPresent(data.allPermissions.some(req => req.status === 'Pending'));
      } catch (error) {
        console.error('Error fetching permission requests:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BASEURL}/user/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        console.log('Fetched users data:', data);

        // Handle single object response
        if (data.data && typeof data.data === 'object') {
          setUsers([data.data]); // Wrap the object in an array
          setUserType(data.data.userType || 'Faculty'); // Set userType from the object
          console.log('User Type:', data.data.userType);
        } else {
          console.error('Unexpected response format:', data.data);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchRequests();
    fetchUsers();
  }, []);

  const handleFilterChange = (status) => {
    setFilter(status);
  };

  const handleSelectRequest = (permissionId) => {
    setSelectedRequests((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRequests.length === filteredRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(filteredRequests.map((request) => request._id));
    }
    setSelectAllAction(true); // Set the flag to show the popup
    setShowPopup(true); // Show the popup
  };

  const handleCancel = () => {
    setShowPopup(false);
    setSelectAllAction(false); // Reset the flag on cancel
    setSelectedRequests([]);
  };

  const handleDeleteConfirmation = (requestId, isBulk = false) => {
    // If it's a bulk delete, select only the filtered requests
    if (isBulk) {
      const filteredIds = filteredRequests.map((req) => req._id);
      setSelectedRequests(filteredIds);
    }
    setDeleteConfirmation({ show: true, requestId, isBulk });
  };
  
  const handleConfirmDelete = async () => {
    try {
      if (deleteConfirmation.isBulk) {
        // Ensure you're sending the array of permissionIds correctly
        const response = await fetch(`${BASEURL}/marksManagement/deletePermission`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({ permissionIds: selectedRequests }), // This should be an array
        });
  
        if (!response.ok) {
          throw new Error('Failed to delete selected requests');
        }
  
        const data = await response.json();
        toast.success('All selected requests have been deleted.');
        setSelectedRequests([]);  // Clear the selected requests after deletion
      } else {
        const requestId = deleteConfirmation.requestId;
  
        // Single deletion logic (already working for you)
        const response = await fetch(`${BASEURL}/marksManagement/deletePermission`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({ permissionId: requestId }),
        });
  
        if (!response.ok) {
          throw new Error(`Failed to delete request ${requestId}`);
        }
  
        const data = await response.json();
        toast.success(`Request has been deleted.`);
      }
  
      // Refresh the request list after deletion
      const refreshResponse = await fetch(`${BASEURL}/marksManagement/manage-permission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
  
      if (!refreshResponse.ok) {
        throw new Error('Failed to refresh permission requests');
      }
  
      const refreshedData = await refreshResponse.json();
      setRequests(refreshedData.allPermissions);
  
      // Reset delete confirmation dialog
      setDeleteConfirmation({ show: false, requestId: null, isBulk: false });
    } catch (error) {
      toast.error('Error deleting request');
      console.error('Error deleting request:', error);
    }
  };
  
  
  const handlePopupAction = async (status) => {
    try {
      const pendingRequests = selectedRequests.filter(permissionId => {
        const request = requests.find(req => req._id === permissionId);
        return request && request.status === 'Pending';
      });

      for (const permissionId of pendingRequests) {
        const response = await fetch(`${BASEURL}/marksManagement/updatePermissionStatus`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({ permissionId, status }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update request ${permissionId}`);
        }

        const data = await response.json();
        console.log(`Request ${permissionId} updated:`, data);
      }

      toast.success(`Requests have been ${status.toLowerCase()}`);
      setSelectedRequests([]);
      setShowPopup(false);

      // Refresh the requests list
      const refreshResponse = await fetch(`${BASEURL}/marksManagement/manage-permission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!refreshResponse.ok) {
        throw new Error('Failed to refresh permission requests');
      }

      const refreshedData = await refreshResponse.json();
      setRequests(refreshedData.allPermissions);
      setIsPendingRequestPresent(refreshedData.allPermissions.some(req => req.status === 'Pending'));
    } catch (error) {
      toast.error('Error updating requests');
      console.error('Error updating requests:', error);
    }
  };


  const filteredRequests = requests
    .filter((req) => filter === 'All' || req.status === filter)
    .sort((a, b) => {
      // Sort by status
      if (a.status === 'Pending' && b.status !== 'Pending') return -1;
      if (a.status !== 'Pending' && b.status === 'Pending') return 1;

      // Sort by date if statuses are the same
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA; // Latest dates first
    });

  const getUserFullName = (userId) => {
    const user = users.find((user) => user.userId === userId);
    return user ? user.fullName : 'Unknown';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const hasPendingRequests = filteredRequests.some(req => req.status === 'Pending');

  return (
    <DashboardLayout>
      <div className="container mx-auto p-5">
        <div className="flex flex-col gap-2 lg:flex-row lg:gap-0 lg:justify-center mb-5">
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded-lg mx-2 ${filter === status ? 'bg-blue-600 text-white dark:text-white' : 'bg-gray-200 dark:bg-slate-700 dark:text-white'
                }`}
              onClick={() => handleFilterChange(status)}
            >
              {status}
            </button>
          ))}
        </div>

        {userType === 'HOD' && hasPendingRequests && (
          <div className="flex justify-center mb-5">
            <button
              className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${!hasPendingRequests ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={hasPendingRequests ? handleSelectAll : undefined}
              disabled={!hasPendingRequests}
            >
              Select All
            </button>
          </div>
        )}

        <div className="flex justify-center mb-5">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => handleDeleteConfirmation(null, true)} // Trigger bulk delete confirmation
          >
            <FaTrashAlt size={20} />
            Delete
          </button>
        </div>


        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div
              key={request._id}
              className="border p-4 rounded-lg relative flex justify-between items-center hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800 transition-colors duration-500 ease-in-out cursor-pointer"
            >
              <span
                className={`absolute right-0 top-[87%] text-xs md:right-2 md:top-3 md:text-sm text-white px-2 py-1 rounded-lg ${request.status === 'Pending'
                  ? 'bg-yellow-500'
                  : request.status === 'Approved'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                  }`}
              >
                {request.status}
              </span>
              <div>
                <h3 className="font-semibold text-lg">{request.subject}</h3>
                <p> Faculty: {request.facultyName} </p>
                <p> Branch: {request.branch} </p>
                <p> Level: {request.level} </p>
                <p> Exam: {request.examType}</p>
                <p> Created At: {formatDate(request.createdAt)}</p>
              </div>

              {/* Add delete icon for both HOD and Faculty */}
              <div className="flex items-center mt-4">
                {userType === 'Faculty' || userType === 'HOD' ? (
                  <FaTrashAlt
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={() => handleDeleteConfirmation(request._id)}
                    title="Delete request"
                    size={20}
                  />
                ) : null}
              </div>

              {userType === 'HOD' && request.status === 'Pending' && (
                <input
                  type="checkbox"
                  checked={selectedRequests.includes(request._id)}
                  onChange={() => handleSelectRequest(request._id)}
                  className="ml-2"
                />
              )}

              {userType === 'HOD' && request.status === 'Pending' && (
                <div className="flex space-x-2">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                    onClick={() => handlePopupAction('Approved')}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    onClick={() => handlePopupAction('Rejected')}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>


        {/* Delete Confirmation Dialog */}
        {deleteConfirmation.show && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-700 dark:text-white p-8 rounded-lg w-11/12 h-auto md:w-1/2 md:h-auto">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p className="mb-4">Are you sure you want to delete {deleteConfirmation.isBulk ? 'all selected requests' : 'this request'}?</p>
              <p className="text-red-600 dark:text-red-500">NOTE: By deleting the request you are freeing up the space of database and this request will not be revived once deleted. And make sure you have entered the marks as after deleteion you will be not been given access to enter the marks</p>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  onClick={handleConfirmDelete}
                >
                  Delete
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => setDeleteConfirmation({ show: false, requestId: null, isBulk: false })}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManagingRequest;
