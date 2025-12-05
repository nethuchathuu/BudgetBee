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
import Setting from "./components/setting/Setting";
import Appearance from "./components/setting/Appearance";
import SetHome from "./components/setting/SetHome";
import NotLimit from "./components/setting/NotLimit";
import Help from "./components/setting/Help";
import Reset from "./components/setting/Reset";
import Notification from "./components/notification/Notification";
import Documentation from "./components/documentation/Documentation";
import MyProfile from "./components/profile/MyProfile";
import ChangePassword from "./components/profile/changePW";
import ForgotPassword from "./components/com_signin/forgotPW";
import './index.css';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import ToastContainer from './components/ui/ToastContainer';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/profile/change-password" element={<ChangePassword />} />
            <Route path="/daily-summary" element={<DailySum />} />
            <Route path="/weekly-summary" element={<WeeklySum />} />
            <Route path="/monthly-summary" element={<MonthlySum />} />
            <Route path="/yearly-summary" element={<YearlySum />} />
            
            {/* Settings Routes */}
            <Route path="/settings" element={<Setting />}>
              <Route path="appearance" element={<Appearance />} />
              <Route path="setHome" element={<SetHome />} />
              <Route path="notLimit" element={<NotLimit />} />
              <Route path="help" element={<Help />} />
              <Route path="reset" element={<Reset />} />
            </Route>
          </Routes>
          <ToastContainer />
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
