import { NavLink, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Page2 from "./pages/Page2";
import Page3 from "./pages/Page3";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/Signup";
import ClientReview from "./pages/Salon/ClientReview";
import Appointment from "./pages/Appointment";
import ManageServices from "./pages/Salon/ManageServices";
import OwnerReplyReview from "./pages/Salon/OwnerReplyReview";
import ApproveWorkers from "./pages/Salon/ApproveWorkers";
import AppointmentsToday from "./pages/Worker/AppointmentsToday";

function MainLayout() {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    function onDocClick(e) {
      if (!wrapperRef.current) return
      if (!wrapperRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
    }
  }, [])

  return (
    <>
      {/* Header */}
      <div style={{ backgroundColor: '#372C2E', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', borderBottom: '2px solid #DE9E48' }}>
        <div style={{ padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/navisalon.png" alt="NaviSalon" style={{ height: 80 }} />
            </div>
            <nav style={{ display: 'flex', gap: 30 }}>
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
            {/* Account button and popup */}
            <div
              ref={wrapperRef}
              style={{ position: 'relative', display: 'flex', justifyContent: 'right', marginTop: '0rem'}}
            >
              <button
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
                style={{
                  padding: '0.75rem 4rem',
                  fontWeight: 600,
                  borderRadius: '0.5rem',
                  backgroundColor: '#DE9E48',
                  color: '#372C2E',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Account
              </button>

              {/* Popup */}
              {open && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: 280,
                    background: '#FFFFFF',
                    color: '#372C2E',
                    border: '1px solid #E6E6E6',
                    borderRadius: 12,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  }}
                >
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #F2F2F2' }}>
                    <div style={{ fontWeight: 700 }}>Your Account</div>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>Signed in as tom</div>
                  </div>
                  <div style={{ padding: 12, display: 'grid', gap: 8 }}>
                    <button style={accBtnStyle}>Profile</button>
                    <button style={accBtnStyle}>Transactions</button>
                    <button style={accBtnStyle}>Settings</button>
                    <button style={{ ...accBtnStyle, color: '#B00020' }}>Sign out</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Page2" element={<Page2 />} />
          <Route path="/Page3" element={<Page3 />} />
          <Route path="/worker/AppointmentsToday" element={<AppointmentsToday />} />
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

const accBtnStyle = {
  textAlign: 'left',
  width: '100%',
  padding: '10px 12px',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
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
