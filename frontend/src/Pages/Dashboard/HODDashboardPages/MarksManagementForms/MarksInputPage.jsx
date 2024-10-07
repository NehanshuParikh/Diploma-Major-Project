import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../Components/DashboardComponents/DashboardLayout';
import { toast } from 'react-hot-toast';

const MarksInputPage = () => {
    const [timer, setTimer] = useState(0);
    const [formData, setFormData] = useState({
        studentId: '',
        marks: ''
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer + 1);
        }, 1000); // Increment timer every second

        // Cleanup the timer when the component unmounts
        return () => clearInterval(interval);
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/marksManagement/marksEntry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include', // Send cookies
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(result.message);
            } else {
                toast.error(result.message || 'Failed to enter marks');
            }
        } catch (error) {
            console.error('Error submitting marks:', error);
            toast.error('Error submitting marks');
        }
    };

    const handleSessionLogout = () => {
        window.location.href = '/api/dashboard';
    };

    return (
        <DashboardLayout>
            <div>
                <h1>Marks Input Page</h1>
                <p>Timer: {Math.floor(timer / 60)}:{timer % 60}</p>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Student ID:</label>
                        <input
                            type="text"
                            name="studentId"
                            value={formData.studentId}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label>Marks:</label>
                        <input
                            type="number"
                            name="marks"
                            value={formData.marks}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit">Submit Marks</button>
                </form>

                <button onClick={handleSessionLogout}>Log Out of Session</button>
            </div>
        </DashboardLayout>
    );
};

export default MarksInputPage;
