import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import authservice from '../../appwrite/auth';

function LogOutBtn() {
    const dispatch = useDispatch();

    const LogOutHandler = () => {
        authservice.LogOut().then(() => {
            dispatch(logout());
        }).catch((error) => {
            console.error("Logout Error:", error);
        });
    };

    return (
        <button
            className="inline-block px-2 py-2 duration-200 hover:bg-blue-100 rounded-full bg-blue-500 text-white"
            onClick={LogOutHandler}
        >
            Logout
        </button>
    );
}

export default LogOutBtn;
