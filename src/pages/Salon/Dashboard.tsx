export default function BusinessDashboard() {
  return (
    <div style={{ 
      backgroundColor: '#FFFFFF', 
      borderRadius: 12, 
      padding: 40, 
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '2px solid #DE9E48'
    }}>
      <h1 style={{ 
        color: '#372C2E', 
        marginTop: 0,
        borderBottom: '3px solid #DE9E48',
        paddingBottom: 16,
        marginBottom: 24
      }}>
        Dashboard
      </h1>
      <p style={{ 
        color: '#563727',
        fontSize: 16,
        lineHeight: 1.6
      }}>
        Dashboard content goes here
      </p>
    </div>
  );
}