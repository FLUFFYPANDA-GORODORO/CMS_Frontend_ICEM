import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ Redirect to dashboard if token is valid
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Try a protected endpoint to verify token
          await axios.get("https://cms-backend-icem.onrender.com/api/banners", {
            headers: { Authorization: `Bearer ${token}` },
          });
          navigate("/home");
        } catch (err) {
          localStorage.removeItem("token");
        }
      }
    };
    checkToken();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://cms-backend-icem.onrender.com/api/auth/login",
        null,
        { params: { email, password } }
      );
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-white to-cyan-50 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-lg p-8 w-[90%] max-w-md text-center">
        <h2 className="text-3xl font-bold text-cyan-600 mb-6">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 outline-none"
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 outline-none"
          />
          <button
            type="submit"
            className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg font-semibold transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
