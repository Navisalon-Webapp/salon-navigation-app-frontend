import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

type UserRole = 'business' | 'customer' | 'employee';

const NavisalonSignUp: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [income, setIncome] = useState<string>('');
  const [salonName, setSalonName] = useState<string>('');
  const [salonAddress, setSalonAddress] = useState<string>('');
  const [salonCity, setSalonCity] = useState<string>('');
  const [salonState, setSalonState] = useState<string>('');
  const [salonCountry, setSalonCountry] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [service, setService] = useState<string>('');
  const [serviceCat, setServiceCat] = useState<string>('');
  const [startYear, setStartYear] = useState<string>('');
  const [salonZipCode, setSalonZipCode] = useState<string>('');
  const [salonEstYear, setSalonEstYear] = useState<string>('');

  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [_loading, setLoading] = useState(false);

  const [industries, setIndustries] = useState<Array<{ ind_id: number; name: string }>>([]);
  const [salons, setSalons] = useState<Array<{ bid: number; name: string }>>([]);
  const [services, setServices] = useState<Array<{ sid: number; name: string }>>([]);
  const [serviceCats, setServiceCats] = useState<Array<{ cat_id: number; name: string }>>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/list-business`)
      .then((res) => res.json())
      .then((data) => setSalons(data))
      .catch(() => setSalons([]));

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/list-services`)
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch(() => setServices([]));

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/list-service-categories`)
      .then((res) => res.json())
      .then((data) => setServiceCats(data))
      .catch(() => setServiceCats([]));

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/list-industries`)
      .then((res) => res.json())
      .then((data) => setIndustries(data))
      .catch(() => setIndustries([]));
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
      phoneNumber,
      email,
      password,
      confirmPassword, // must be present & match
    };
    if (selectedRole === "customer") {
      Object.assign(payload, {
        birthDate,
        gender,
        industry,
        income
    });
  }
    if (selectedRole === "business") {
      Object.assign(payload, {
        salonName,
        salonAddress,
        salonCity,
        salonState,
        salonCountry,
        salonZipCode,
        salonEstYear
      });
    }
    if (selectedRole === "employee") {
      Object.assign(payload, { service, serviceCat, startYear, salonName });
    }

    console.log("Signup attempted with:", payload);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${selectedRole}/signup`,
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
            <input
                type="tel"
                placeholder="Salon Year Opened"
                value={salonEstYear}
                onChange={(e) => setSalonEstYear(e.target.value)}
                style={inputStyle}
              />
          </>
        );
      
      case 'customer':
        return (
          <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input
              type="date"
              placeholder="Birthdate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              style={inputStyle}
            />
            <input
              type="tel"
              placeholder="Income"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              style={inputStyle}
            />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={inputStyle}
            >
              <option value="">Select Gender</option>
              <option key={"male"} value={"male"}>{"Male"}</option>
              <option key={"female"} value={"female"}>{"Female"}</option>
              <option key={"nonbinary"} value={"nonbinary"}>{"Nonbinary"}</option>
              <option key={"other"} value={"other"}>{"Other"}</option>
            </select>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              style={inputStyle}
            >
              <option value="">Select Industry</option>
                {industries.map((s) => (
                  <option key={s.ind_id} value={s.ind_id}>
                    {s.name}
                  </option>
                ))}
              </select>
          </div>
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
                type="text"
                placeholder="Start Year"
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                style={inputStyle}
              />
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
              <select
                value={serviceCat}
                onChange={(e) => setServiceCat(e.target.value)}
                style={inputStyle}
              >
                <option value="">Select Service Category</option>
                  {serviceCats.map((s) => (
                    <option key={s.cat_id} value={s.cat_id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                style={inputStyle}
              >
                <option value="">Select Service</option>
                  {services.map((s) => (
                    <option key={s.sid} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
            </div>
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
            Sign Up as {selectedRole === 'business' ? 'Salon Owner' : selectedRole === 'customer' ? 'Customer' : 'Employee'}
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