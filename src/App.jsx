import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Banner from "./pages/Banner";
import News from "./pages/News";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* ✅ Public Route - Login */}
        <Route path="/" element={<Login />} />

        {/* ✅ Protected Routes - Only after login */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        >
          {/* Default redirect to banner */}
          <Route index element={<Navigate to="banner" replace />} />
          <Route path="banner" element={<Banner />} />
          <Route path="news" element={<News />} />
        </Route>

        {/* ✅ Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
