import { NavLink, Routes, Route, Navigate } from 'react-router-dom'
import Page1 from './pages/Page1'
import Page2 from './pages/Page2'
import Page3 from './pages/Page3'

export default function App() {
  return (
    <>
      {/* Header */}
      <div style={{ backgroundColor: '#372C2E', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', borderBottom: '2px solid #DE9E48' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/navisalon.png" alt="NaviSalon" style={{ height: 80 }} />
            </div>

            <nav style={{ display: 'flex', gap: 30 }}>
              <NavLink
                to="/"
                style={({ isActive }) => ({
                  color: isActive ? '#DE9E48' : '#FFFFFF',
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                })}
                end
              >
                Page 1
              </NavLink>
              <NavLink
                to="/Page2"
                style={({ isActive }) => ({
                  color: isActive ? '#DE9E48' : '#FFFFFF',
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                })}
              >
                Page 2
              </NavLink>
              <NavLink
                to="/Page3"
                style={({ isActive }) => ({
                  color: isActive ? '#DE9E48' : '#FFFFFF',
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                })}
              >
                Page 3
              </NavLink>
            </nav>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        <Routes>
          <Route path="/" element={<Page1 />} />
          <Route path="/Page2" element={<Page2 />} />
          <Route path="/Page3" element={<Page3 />} />
        </Routes>
      </div>
    </>
  )
}
