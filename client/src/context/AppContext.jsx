import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';  // Global axios
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    
    const setAuthToken = (token) => {
        if (token) {
            localStorage.setItem('token', token);
            // Use global axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        }
    };
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuthToken(token);
            checkAuth();
        }
    }, []);
    
    const checkAuth = async () => {
        try {
            // Use global axios directly
            const { data } = await axios.get('/api/user/is-auth');
            if (data.success) {
                setUser(data.user);
            } else {
                setAuthToken(null);
            }
        } catch (error) {
            console.log("Auth check failed");
            setAuthToken(null);
        }
    };
    
    return (
        <AppContext.Provider value={{
            user,
            setUser,
            showUserLogin,
            setShowUserLogin,
            isSeller,
            setIsSeller,
            navigate,
            setAuthToken,
            checkAuth
        }}>
            {children}
        </AppContext.Provider>
    );
};