import React, { useEffect } from 'react';

const Toast = ({ type = 'success', message, onClose }) => {
    const [isExiting, setIsExiting] = React.useState(false);

    useEffect(() => {
        // Shorter duration: 3 seconds for success, 5 seconds for errors
        const timer = setTimeout(() => {
            handleClose();
        }, type === 'error' ? 5000 : 3000);

        return () => clearTimeout(timer);
    }, [type, onClose]);

    const handleClose = () => {
        setIsExiting(true);
        // Wait for animation to complete before actually closing
        setTimeout(() => {
            onClose();
        }, 300); // Match the CSS transition duration
    };

    return (
        <div className={`toast ${type} ${isExiting ? 'toast-exit' : ''}`}>
            <p>{message}</p>
            <button onClick={handleClose} className="close-btn">&times;</button>
        </div>
    );
};

export default Toast;
