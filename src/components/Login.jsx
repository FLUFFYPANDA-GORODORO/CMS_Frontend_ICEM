import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ Redirect to dashboard if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://cms-backend-icem.onrender.com/api/auth/login", null, {
        params: { email, password },
      });
      const { token } = res.data;

      localStorage.setItem("token", token);
      toast.success("Login successful!");
      navigate("/home");
    } catch (error) {
      console.error(error);
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-white/10 flex items-center justify-center">
      <div className="bg-white backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg p-8 w-[90%] max-w-md text-center">
        <h2 className="text-3xl font-bold text-cyan-600 mb-6">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-transparent border border-white/30 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 outline-none"
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 bg-transparent border border-white/30 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 outline-none"
          />
          <button
            type="submit"
            className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-gray-800 rounded-lg font-semibold transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
