import React from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import axios from 'axios';  // ← Import global axios

const Login = () => {
  const { setShowUserLogin, setUser, navigate, setAuthToken } = useAppContext();

  const [state, setState] = React.useState("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      // Use global axios (not from context)
      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password,
      });

      if (data.success && data.token) {
        setAuthToken(data.token);
        navigate("/");
        setUser(data.user);
        setShowUserLogin(false);
        toast.success(`Welcome ${data.user.name}!`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ... rest of your JSX remains the same
};

export default Login;