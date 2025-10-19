import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';

const NavisalonSignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    console.log('Login attempted with:', { email, password });
    navigate('/home/Page1');
  };

  const handleSignUp = () => {
    console.log('Navigate to sign up');
    navigate('/SignUp');
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
        bottom: 0
      }}
    >
      <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem', marginTop: '4rem' }}>
          <img src="navisalon.png" alt="Navisalon" style={{ height: '150px' }} />
        </div>

        {/* Sign In Form */}
        <div>
          <h1 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 600, 
            textAlign: 'center',
            color: '#FFFFFF',
            marginBottom: '2rem'
          }}>
            Sign In
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
            {/* Email Input */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                borderRadius: '0.5rem',
                backgroundColor: '#563727',
                border: '1px solid #7A431D',
                color: '#FFFFFF',
                outline: 'none',
                transition: 'all 0.2s'
              }}
            />

            {/* Password Input */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                borderRadius: '0.5rem',
                backgroundColor: '#563727',
                border: '1px solid #7A431D',
                color: '#FFFFFF',
                outline: 'none',
                transition: 'all 0.2s'
              }}
            />

            {/* Log In Button */}
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
                Log In
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div style={{ marginTop: '3rem' }}>
            <button
              onClick={handleSignUp}
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
              Don't have an account? Sign Up
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

export default NavisalonSignIn;