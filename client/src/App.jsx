import { BrowserRouter, Routes, Route } from "react-router-dom";

import  {Layout}  from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import { AddMemberPage } from "./pages/AddMemberPage.jsx";
import { ActiveMembersPage } from "./pages/ActiveMembersPage.jsx";
import MoneyPage from "./pages/MoneyPage.jsx";
import  SeatingPage  from "./pages/SeatingPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

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