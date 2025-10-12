import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import HomePage from "./pages/HomePage";
import Upload from "./pages/Upload";
import DailySum from "./components/summary/DailySum";
import WeeklySum from "./components/summary/WeeklySum";
import MonthlySum from "./components/summary/MonthlySum";
import YearlySum from "./components/summary/YearlySum";
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/daily-summary" element={<DailySum />} />
        <Route path="/weekly-summary" element={<WeeklySum />} />
        <Route path="/monthly-summary" element={<MonthlySum />} />
        <Route path="/yearly-summary" element={<YearlySum />} />
      </Routes>
    </Router>
  );
}

export default App;
