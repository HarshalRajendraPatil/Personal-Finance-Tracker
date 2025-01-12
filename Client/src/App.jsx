import { Route, Routes } from "react-router-dom";
import SignupPage from "./Pages/Authentication/SignupPage";
import LoginPage from "./Pages/Authentication/LoginPage";
import ForgotPasswordPage from "./Pages/Authentication/ForgotPasswordPage";
import ResetPasswordPage from "./Pages/Authentication/ResetPasswordPage";
import Applayout from "./Applayout";
import DashboardPage from "./Pages/DashboardPage";
import BudgetPage from "./Pages/BudgetPage";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/reset-password/:resetToken"
        element={<ResetPasswordPage />}
      />
      <Route element={<Applayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/budget" element={<BudgetPage />} />
      </Route>
    </Routes>
  );
}

export default App;
