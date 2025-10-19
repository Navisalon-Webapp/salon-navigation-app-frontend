import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type UserRole = 'owner' | 'customer' | 'worker';

const NavisalonSignUp: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [salonName, setSalonName] = useState<string>('');
  const [salonAddress, setSalonAddress] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [specialty, setSpecialty] = useState<string>('');
  
  const navigate = useNavigate();

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

  const handleSubmit = () => {
    console.log('Signup attempted with:', { 
      role: selectedRole, 
      firstName,
      lastName,
      email, 
      password,
      ...(selectedRole === 'owner' && { phoneNumber, salonName, salonAddress }),
      ...(selectedRole === 'worker' && { phoneNumber, specialty, salonName })
    });
    // Handle backend call to update SQL tables here
    navigate('/');
  };

  const handleSignIn = () => {
    navigate('/');
  };

  const renderRoleFields = () => {
    switch (selectedRole) {
      case 'owner':
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
            <input
              type="text"
              placeholder="Salon Address"
              value={salonAddress}
              onChange={(e) => setSalonAddress(e.target.value)}
              style={inputStyle}
            />
          </>
        );
      
      case 'customer':
        return
      
      case 'worker':
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
              // Will eventually be populated with salon names from the backend
              >
              <option value="">Select Salon</option>
              <option value="Salon A">Salon A</option>
              <option value="Salon B">Salon B</option>
              <option value="Salon C">Salon C</option>
            </select>
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
        {/* Logo */}
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
            onClick={() => setSelectedRole('owner')}
            style={{
              flex: 1,
              padding: '0.75rem',
              fontWeight: 600,
              backgroundColor: selectedRole === 'owner' ? '#DE9E48' : '#563727',
              color: selectedRole === 'owner' ? '#372C2E' : '#FFFFFF',
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
            onClick={() => setSelectedRole('worker')}
            style={{
              flex: 1,
              padding: '0.75rem',
              fontWeight: 600,
              backgroundColor: selectedRole === 'worker' ? '#DE9E48' : '#563727',
              color: selectedRole === 'worker' ? '#372C2E' : '#FFFFFF',
              border: '1px solid #7A431D',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '0.875rem'
            }}
          >
            Worker
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
            Sign Up as {selectedRole === 'owner' ? 'Salon Owner' : selectedRole === 'customer' ? 'Customer' : 'Worker'}
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