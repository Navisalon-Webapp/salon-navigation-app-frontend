import React, { useEffect, useRef, useState } from "react";
import { Routes, Route, NavLink, Outlet } from "react-router-dom";

// Auth
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { PublicOnly, RequireAuth, RequireRole } from "./auth/guards";

// Pages
import SignIn from "./pages/Auth/Signin";
import SignUp from "./pages/Auth/SignUp";

// CUSTOMER
import Home from "./pages/Customer/Home";
import Browse from "./pages/Customer/Browse";
import Appointment from "./pages/Customer/Appointment";
import CustomerSettings from "./pages/Customer/Settings";
import Cart from "./pages/Customer/Cart";
import CustomerAppointments from "./pages/Customer/PrevAppointments";
import SalonReview from "./pages/Customer/SalonReview";

// OWNER
import ApproveWorkers from "./pages/Salon/ApproveWorkers";
import OwnerReplyReview from "./pages/Salon/OwnerReplyReview";
import ManageServices from "./pages/Salon/ManageServices";
import BusinessDashboard from "./pages/Salon/Dashboard";
import CreatePromotion from "./pages/Salon/CreatePromotion";
import CreateLoyalty from "./pages/Salon/CreateLoyalty";
import Marketing from "./pages/Salon/Marketing";
import SalonRevenue from "./pages/Salon/SalonRevenue";

// WORKER
import WorkerDashboard from "./pages/Worker/Dashboard";
import ManageAvailability from "./pages/Worker/ManageAvailability";
import AppointmentsToday from "./pages/Worker/AppointmentsToday";
import WorkerAppointments from "./pages/Worker/PrevAppointments";
import WorkerAppointment from "./pages/Worker/Appointment";

// ADMIN
import Dashboard from "./pages/Admin/Dashboard"

const accBtnStyle: React.CSSProperties = {
  textAlign: "left",
  width: "100%",
  padding: "10px 12px",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};

const navLinkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
  color: isActive ? "#DE9E48" : "#FFFFFF",
  textDecoration: "none",
  fontWeight: 500,
});

function MainLayout() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <>
      {/* Header/Nav */}
      <div
        style={{
          backgroundColor: "#372C2E",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          borderBottom: "2px solid #DE9E48",
          position: "sticky",
          top: 0,
          zIndex: 1000,
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
            <img src="/navisalon.png" alt="NaviSalon" style={{ height: 80 }} />

            <nav style={{ display: "flex", gap: 30 }}>
              {/* CUSTOMER NAV */}
              {user?.role === "customer" && (
                <>
                  <NavLink to="/customer/home" style={navLinkStyle}>
                    Home
                  </NavLink>
                  <NavLink to="/customer/browse" style={navLinkStyle}>
                    Browse
                  </NavLink>
                  <NavLink to="/customer/prev-appointments" style={navLinkStyle}>
                    Appointments
                  </NavLink>
                  <NavLink to="/customer/salon-review" style={navLinkStyle}>
                    Client Reviews
                  </NavLink>
                </>
              )}

              {/* BUSINESS NAV */}
              {user?.role === "business" && (
                <>
                  <NavLink to="/business/home" style={navLinkStyle}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/business/manage-services" style={navLinkStyle}>
                    Manage Services
                  </NavLink>
                  <NavLink to="/business/approve-workers" style={navLinkStyle}>
                    Approve Workers
                  </NavLink>
                  <NavLink to="/business/reply-reviews" style={navLinkStyle}>
                    Reply Reviews
                  </NavLink>
                  <NavLink to="/business/revenue" style={navLinkStyle}>
                    Revenue
                  </NavLink>
                  <NavLink to="/business/marketing" style={navLinkStyle}>
                    Promotions & Loyalty
                  </NavLink>
                </>
              )}

              {/* WORKER NAV */}
              {user?.role === "employee" && (
                <>
                  <NavLink to="/employee/home" style={navLinkStyle}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/employee/manage-availability" style={navLinkStyle}>
                    Manage Availability
                  </NavLink>
                  <NavLink to="/employee/appointments-today" style={navLinkStyle}>
                    Today's Appointments
                  </NavLink>
                  <NavLink to="/employee/prev-appointments" style={navLinkStyle}>
                    Appointments
                  </NavLink>
                </>
              )}

              {/* WORKER NAV */}
              {user?.role === "admin" && (
                <>
                  <NavLink to="/admin/home" style={navLinkStyle}>
                    Dashboard
                  </NavLink>
                </>
              )}
            </nav>

            {/* Cart + Account Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {user?.role === "customer" && (
                <NavLink to="/customer/cart">
                  <img
                    src="/cart.png"
                    alt="Cart"
                    style={{
                      height: 32,
                      width: 32,
                      cursor: "pointer",
                      filter: "invert(0.9)",
                      transition: "0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.filter =
                        "invert(60%) sepia(80%) saturate(500%) hue-rotate(10deg) brightness(1.2)")
                    }
                    onMouseOut={(e) => (e.currentTarget.style.filter = "invert(0.9)")}
                  />
                </NavLink>
              )}

              {/* Account Dropdown */}
              <div ref={wrapperRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setOpen((o) => !o)}
                  aria-expanded={open}
                  style={{
                    padding: "0.75rem 2rem",
                    fontWeight: 600,
                    borderRadius: "0.5rem",
                    backgroundColor: "#DE9E48",
                    color: "#372C2E",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Account
                </button>

                {open && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 10px)",
                      right: 0,
                      width: 280,
                      background: "#FFFFFF",
                      color: "#372C2E",
                      border: "1px solid #E6E6E6",
                      borderRadius: 12,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    }}
                  >
                    <div
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #F2F2F2",
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>Your Account</div>
                      <div style={{ fontSize: 12, opacity: 0.7 }}>
                        Signed in as {user?.name ?? "—"} ({user?.role ?? "guest"})
                      </div>
                    </div>
                    <div style={{ padding: 12, display: "grid", gap: 8 }}>
                      <button style={accBtnStyle}>Profile</button>
                      <button style={accBtnStyle}>Transactions</button>
                      {user?.role === "customer" ? (
                      <NavLink to="/customer/settings" style={{ ...accBtnStyle, display: "block" }} onClick={() => setOpen(false)}>
                          Settings
                        </NavLink>
                      ) : (
                        <button style={accBtnStyle}>Settings</button>
                      )}
                    <button onClick={signOut} style={{ ...accBtnStyle, color: "#B00020" }}>
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Page content outlet */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
        <Outlet />
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicOnly><SignIn /></PublicOnly>} />
        <Route path="/SignUp" element={<PublicOnly><SignUp /></PublicOnly>} />
        <Route path="/unauthorized" element={<div>Unauthorized</div>} />

        {/* Private (must be signed in) */}
        <Route element={<RequireAuth />}>
          <Route element={<MainLayout />}>
            {/* CUSTOMER GROUP */}
            <Route path="/customer" element={<RequireRole allow={["customer"]} />}>
              <Route path="home" element={<Home />} />
              <Route path="browse" element={<Browse />} />
              <Route path="appointment/:appointmentId" element={<Appointment />} />
              <Route path="settings" element={<CustomerSettings />} />
              <Route path="cart" element={<Cart />} />
              <Route path="prev-appointments" element={<CustomerAppointments />} />
              <Route path="salon-review" element={<SalonReview />} />

            </Route>

            {/* OWNER GROUP */}
            <Route path="/business" element={<RequireRole allow={["business"]} />}>
              <Route path="home" element={<BusinessDashboard />} />
              <Route path="marketing" element={<Marketing />} />
              <Route path="manage-services" element={<ManageServices />} />
              <Route path="promotions" element={<CreatePromotion />} />
              <Route path="loyalty-programs" element={<CreateLoyalty />} />
              <Route path="approve-workers" element={<ApproveWorkers />} />
              <Route path="reply-reviews" element={<OwnerReplyReview />} />
              <Route path="revenue" element={<SalonRevenue />} />
            </Route>

            {/* WORKER GROUP */}
            <Route path="/employee" element={<RequireRole allow={["employee"]} />}>
              <Route path="home" element={<WorkerDashboard />} />
              <Route path="manage-availability" element={<ManageAvailability />} />
              <Route path="appointments-today" element={<AppointmentsToday />} />
              <Route path="prev-appointments" element={<WorkerAppointments />} />
              <Route path="appointment/:appointmentId" element={<WorkerAppointment />} />
            </Route>

            {/* ADMIN GROUP */}
            <Route path="/admin" element={<RequireRole allow={["admin"]} />}>
              <Route path="home" element={<Dashboard />} />
            </Route>
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </AuthProvider>
  );
}
