import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage";
import LandingPage from "./components/LandingPage";
import CreatePetPage from "./components/createpet";
const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/pets" element={<CreatePetPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
