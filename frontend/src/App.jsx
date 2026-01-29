import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Employees = React.lazy(() => import('./pages/Employees'));
const Attendance = React.lazy(() => import('./pages/Attendance'));

const App = () => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', padding: '1.5rem', gap: '1.5rem' }}>
        {/* Sidebar */}
        <nav style={{
          width: '280px',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-lg)',
          color: 'white',
          padding: '2.5rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
            <h2 style={{
              fontSize: '1.75rem',
              background: 'var(--grad-main)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.04em'
            }}>HRMS Lite</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
            <NavItem to="/" end>Dashboard</NavItem>
            <NavItem to="/employees">Employees</NavItem>
            <NavItem to="/attendance">Attendance</NavItem>
          </div>

          {/* Clock & Date */}
          <div style={{
            padding: '1.5rem',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.05)',
            marginTop: 'auto'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, background: 'var(--grad-main)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {time.toLocaleDateString([], { month: 'short', day: 'numeric', weekday: 'short' })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <div className="container" style={{ position: 'relative' }}>
            <React.Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/attendance" element={<Attendance />} />
              </Routes>
            </React.Suspense>
          </div>
        </main>
      </div>
    </Router>
  );
};

const PageLoader = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
    paddingTop: '1rem'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="skeleton" style={{ width: '300px', height: '40px' }} />
      <div className="skeleton" style={{ width: '150px', height: '45px', borderRadius: '18px' }} />
    </div>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem'
    }}>
      <div className="card skeleton" style={{ height: '160px' }} />
      <div className="card skeleton" style={{ height: '160px' }} />
      <div className="card skeleton" style={{ height: '160px' }} />
    </div>
    <div className="card skeleton" style={{ height: '400px' }} />
  </div>
);

const NavItem = ({ to, children, ...props }) => (
  <NavLink
    to={to}
    {...props}
    style={({ isActive }) => ({
      padding: '1rem 1.25rem',
      borderRadius: '16px',
      textDecoration: 'none',
      color: isActive ? 'white' : 'var(--text-muted)',
      background: isActive ? 'var(--grad-main)' : 'transparent',
      fontWeight: 600,
      fontSize: '1rem',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      border: isActive ? 'none' : '1px solid transparent'
    })}
    onMouseEnter={(e) => {
      if (!e.currentTarget.classList.contains('active')) {
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
      }
    }}
    onMouseLeave={(e) => {
      if (!e.currentTarget.classList.contains('active')) {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.borderColor = 'transparent';
      }
    }}
  >
    {children}
  </NavLink>
);

export default App;
