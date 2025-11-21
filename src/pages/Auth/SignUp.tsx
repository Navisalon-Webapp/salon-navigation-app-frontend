import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

type UserRole = 'business' | 'customer' | 'employee' | 'admin';

const NavisalonSignUp: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [salonName, setSalonName] = useState<string>('');
  const [salonAddress, setSalonAddress] = useState<string>('');
  const [salonCity, setSalonCity] = useState<string>('');
  const [salonState, setSalonState] = useState<string>('');
  const [salonCountry, setSalonCountry] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [specialty, setSpecialty] = useState<string>('');
  const [salonZipCode, setSalonZipCode] = useState<string>('');

  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [salons, setSalons] = useState<Array<{ bid: number; name: string }>>([]);

  useEffect(() => {
    fetch('http://localhost:5000/list-business')
      .then((res) => res.json())
      .then((data) => setSalons(data))
      .catch(() => setSalons([]));
  }, []);

  const inputStyle = {
    width: '100%',
    padding: '1rem 1.5rem',
    borderRadius: '0.5rem',
    backgroundColor: '#563727',
    border: '1px solid #7A431D',
    color: '#FFFFFF',
    outline: 'none',
    transition: 'all 0.2s'
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    const payload: any = {
      role: selectedRole,
      firstName,
      lastName,
      email,
      password,
      confirmPassword, // must be present & match
    };
    if (selectedRole === "business") {
      Object.assign(payload, {
        phoneNumber,
        salonName,
        salonAddress,
        salonCity,
        salonState,
        salonCountry,
        salonZipCode,
      });
    }
    if (selectedRole === "employee") {
      Object.assign(payload, { phoneNumber, specialty, salonName });
    }
    if (selectedRole === "admin") {
      Object.assign(payload, { phoneNumber });
    }

    console.log("Signup attempted with:", payload);

    try {
      const res = await axios.post(
        `http://localhost:5000/${selectedRole}/signup`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Signup success:", res.data);
      navigate("/");
    } catch (err: any) {
      console.error(
        "Signup error:",
        err.response?.status,
        err.response?.data || err.message
      );
      setError(err.response?.data?.message || "Sign up failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    navigate('/');
  };

  const renderRoleFields = () => {
    switch (selectedRole) {
      case 'business':
        return (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input
                type="tel"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={inputStyle}
              />
                <input
                type="text"
                placeholder="Salon Name"
                value={salonName}
                onChange={(e) => setSalonName(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input
                type="tel"
                placeholder="Salon Street and Number"
                value={salonAddress}
                onChange={(e) => setSalonAddress(e.target.value)}
                style={inputStyle}
              />
                <input
                type="text"
                placeholder="Salon City"
                value={salonCity}
                onChange={(e) => setSalonCity(e.target.value)}
                style={inputStyle}
              />
            </div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input
                type="tel"
                placeholder="Salon State"
                value={salonState}
                onChange={(e) => setSalonState(e.target.value)}
                style={inputStyle}
              />
                <input
                type="text"
                placeholder="Salon Country"
                value={salonCountry}
                onChange={(e) => setSalonCountry(e.target.value)}
                style={inputStyle}
              />
            </div>
            <input
                type="tel"
                placeholder="Salon Zip Code"
                value={salonZipCode}
                onChange={(e) => setSalonZipCode(e.target.value)}
                style={inputStyle}
              />
          </>
        );
      
      case 'customer':
        return (
          <>
            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={inputStyle}
            />
          </>
        );
      
      case 'employee':
        return (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input
                type="tel"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                style={inputStyle}
              />
            </div>
            <select
              value={salonName}
              onChange={(e) => setSalonName(e.target.value)}
              style={inputStyle}
            >
              <option value="">Select Salon</option>
                {salons.map((s) => (
                  <option key={s.bid} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
          </>
        );
        case 'admin':
        return (
          <>
            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={inputStyle}
            />
          </>
        );
    }
  };

  return (
    <div 
      className="flex items-center justify-center p-4" 
      style={{ 
        background: '#372C2E',
        minHeight: '100vh',
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: 'auto'
      }}
    >
      <div style={{ width: '100%', maxWidth: '500px', margin: '2rem auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0rem', marginTop: '-1rem' }}>
          <img src="navisalon.png" alt="Navisalon" style={{ height: '120px' }} />
        </div>

        {/* Role Selection Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '2rem',
          borderRadius: '0.5rem',
          overflow: 'hidden'
        }}>
          <button
            onClick={() => setSelectedRole('business')}
            style={{
              flex: 1,
              padding: '0.75rem',
              fontWeight: 600,
              backgroundColor: selectedRole === 'business' ? '#DE9E48' : '#563727',
              color: selectedRole === 'business' ? '#372C2E' : '#FFFFFF',
              border: '1px solid #7A431D',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '0.875rem'
            }}
          >
            Salon Owner
          </button>
          <button
            onClick={() => setSelectedRole('customer')}
            style={{
              flex: 1,
              padding: '0.75rem',
              fontWeight: 600,
              backgroundColor: selectedRole === 'customer' ? '#DE9E48' : '#563727',
              color: selectedRole === 'customer' ? '#372C2E' : '#FFFFFF',
              border: '1px solid #7A431D',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '0.875rem'
            }}
          >
            Customer
          </button>
          <button
            onClick={() => setSelectedRole('employee')}
            style={{
              flex: 1,
              padding: '0.75rem',
              fontWeight: 600,
              backgroundColor: selectedRole === 'employee' ? '#DE9E48' : '#563727',
              color: selectedRole === 'employee' ? '#372C2E' : '#FFFFFF',
              border: '1px solid #7A431D',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '0.875rem'
            }}
          >
            Worker
          </button>
           <button
            onClick={() => setSelectedRole('admin')}
            style={{
              flex: 1,
              padding: '0.75rem',
              fontWeight: 600,
              backgroundColor: selectedRole === 'admin' ? '#DE9E48' : '#563727',
              color: selectedRole === 'admin' ? '#372C2E' : '#FFFFFF',
              border: '1px solid #7A431D',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '0.875rem'
            }}
          >
            Administrator
          </button>
        </div>

        {/* Sign Up Form */}
        <div>
          <h1 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 600, 
            textAlign: 'center',
            color: '#FFFFFF',
            marginBottom: '2rem'
          }}>
            Sign Up as {selectedRole === 'business' ? 'Salon Owner' : selectedRole === 'customer' ? 'Customer' :  selectedRole === 'employee' ? 'Employee' : 'Administrator'}
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Role-specific fields */}
            {renderRoleFields()}

            {/* Email Input */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />

            {/* Password Input */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />

            {/* Confirm Password Input */}
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
            />

            {/* Sign Up Button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <button
                onClick={handleSubmit}
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
                Sign Up
              </button>
              {error && (
                <p
                  style={{
                    color: "#ff7b7b",
                    textAlign: "center",
                    marginTop: "1rem",
                    fontWeight: 500,
                  }}
                >
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Sign In Link */}
          <div style={{ marginTop: '2rem' }}>
            <button
              onClick={handleSignIn}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                borderRadius: '0.5rem',
                backgroundColor: 'transparent',
                border: '1px solid #7A431D',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Already have an account? Sign In
            </button>
          </div>
        </div>
      </div>

      <style>{`
        input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        input:focus {
          border-color: #DE9E48 !important;
        }
      `}</style>
    </div>
  );
};

export default NavisalonSignUp;