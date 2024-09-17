import React, { useEffect, useState } from 'react';

const MarksInputPage = () => {
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer + 1);
        }, 1000); // Increment timer every second

        // Cleanup the timer when the component unmounts
        return () => clearInterval(interval);
    }, []);

    const handleSessionLogout = () => {
        // Logic to log out from the session and redirect to the home page
        window.location.href = '/dashboard/home';
    };

    return (
        <div>
            <h1>Marks Input Page</h1>
            <p>Timer: {Math.floor(timer / 60)}:{timer % 60}</p>
            <button onClick={handleSessionLogout}>Log Out of Session</button>
        </div>
    );
};

export default MarksInputPage