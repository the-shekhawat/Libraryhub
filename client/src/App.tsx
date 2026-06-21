import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Layout } from "./components/Layout";
import HomePage from "./pages/HomePage";
import { AddMemberPage } from "./pages/AddMemberPage";
import { ActiveMembersPage } from "./pages/ActiveMembersPage";
import MoneyPage from "./pages/MoneyPage";
import  SeatingPage  from "./pages/SeatingPage";
import ProfilePage from "./pages/ProfilePage";

import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="add-member" element={<AddMemberPage />} />
          <Route path="active-members" element={<ActiveMembersPage />} />
          <Route path="money" element={<MoneyPage />} />
          <Route path="seating" element={<SeatingPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;