import { NavLink, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Page2 from "./pages/Page2";
import Page3 from "./pages/Page3";
import SignIn from "./pages/Auth/Signin";
import SignUp from "./pages/Auth/SignUp";
import ClientReview from "./pages/Salon/ClientReview";
import Appointment from "./pages/Appointment";
import ManageServices from "./pages/Salon/ManageServices";
import OwnerReplyReview from "./pages/Salon/OwnerReplyReview";
import ApproveWorkers from "./pages/Salon/ApproveWorkers";

// Layout component with header
function MainLayout() {
  return (
    <>
      {/* Header */}
      <div
        style={{
          backgroundColor: "#372C2E",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          borderBottom: "2px solid #DE9E48",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: 64,
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src="/navisalon.png"
                alt="NaviSalon"
                style={{ height: 80 }}
              />
            </div>

            <nav style={{ display: "flex", gap: 30 }}>
              <NavLink
                to="/home"
                style={({ isActive }) => ({
                  color: isActive ? "#DE9E48" : "#FFFFFF",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.2s",
                })}
                end
              >
                Home
              </NavLink>
              <NavLink
                to="/home/Page2"
                style={({ isActive }) => ({
                  color: isActive ? "#DE9E48" : "#FFFFFF",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.2s",
                })}
              >
                Page 2
              </NavLink>
              <NavLink
                to="/home/Page3"
                style={({ isActive }) => ({
                  color: isActive ? "#DE9E48" : "#FFFFFF",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.2s",
                })}
              >
                Page 3
              </NavLink>
              <NavLink
                to="/home/Salon/ClientReview"
                style={({ isActive }) => ({
                  color: isActive ? "#DE9E48" : "#FFFFFF",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.2s",
                })}
              >
                Leave Review
              </NavLink>
              <NavLink
                to="/home/Salon/ApproveWorkers"
                style={({ isActive }) => ({
                  color: isActive ? "#DE9E48" : "#FFFFFF",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.2s",
                })}
              >
                Approve Workers
              </NavLink>
              <NavLink
                to="/home/Salon/OwnerReplyReview"
                style={({ isActive }) => ({
                  color: isActive ? "#DE9E48" : "#FFFFFF",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.2s",
                })}
              >
                Reply to Reviews
              </NavLink>
              <NavLink
                to="/home/Salon/ManageServices"
                style={({ isActive }) => ({
                  color: isActive ? "#DE9E48" : "#FFFFFF",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.2s",
                })}
              >
                Manage Services
              </NavLink>
              <NavLink
                to="/home/Appointment"
                style={({ isActive }) => ({
                  color: isActive ? "#DE9E48" : "#FFFFFF",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.2s",
                })}
              >
                Appointment
              </NavLink>
            </nav>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Page2" element={<Page2 />} />
          <Route path="/Page3" element={<Page3 />} />
          <Route path="/Salon/ApproveWorkers" element={<ApproveWorkers />} />
          <Route path="/Salon/OwnerReplyReview" element={<OwnerReplyReview />} />
          <Route path="/Salon/ManageServices" element={<ManageServices />} />
          <Route path="/Salon/ClientReview" element={<ClientReview />} />
          <Route path="/Appointment" element={<Appointment />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/home/*" element={<MainLayout />} />
    </Routes>
  );
}
