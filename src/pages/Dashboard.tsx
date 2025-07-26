import { useState, useEffect, useCallback } from 'react';
import { projectsApi, usersApi } from '../services/api-client';
import { useAuth } from '../hooks/useAuth';

interface DashboardStats {
  totalProjects: number;
  totalUsers: number;
  userRole: string;
}

export function Dashboard(): React.JSX.Element {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalUsers: 0,
    userRole: 'Loading...'
  });
  const [loading, setLoading] = useState(true);
  const { user: currentUser, isAuthenticated } = useAuth();

  useEffect(() => {
    let mounted = true;
    
    const loadData = async (): Promise<void> => {
      if (mounted) {
        await loadDashboardData();
      }
    };
    
    loadData();
    
    return () => {
      mounted = false;
    };
  }, [loadDashboardData]);

  const loadDashboardData = useCallback(async (): Promise<void> => {
    // Don't try to load if we don't have authentication
    if (!isAuthenticated) {
      console.warn('No authentication found, skipping dashboard load');
      setLoading(false);
      return;
    }
    
    try {
      // Load projects using paginated endpoint
      const projectsResponse = await projectsApi.projectsControllerFindPaginated(1, 100);
      const projects = projectsResponse.data?.data?.items || [];
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Try to load users (may fail if no permission)
      let userCount = 0;
      try {
        const usersResponse = await usersApi.usersControllerFindPaginated(1, 100);
        userCount = usersResponse.data?.data?.items?.length || 0;
      } catch {
        // User doesn't have permission to view all users
        userCount = -1;
      }

      // Determine user's role based on permissions
      const permissions = currentUser?.permissions || [];
      let role = 'Viewer';
      if (permissions.includes('delete:user')) {
        role = 'Project Admin';
      } else if (permissions.includes('create:asset')) {
        role = 'Project Manager';
      } else if (permissions.includes('edit:asset')) {
        role = 'Engineer';
      }

      setStats({
        totalProjects: projects.length,
        totalUsers: userCount,
        userRole: role
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, currentUser]);

  const containerStyle: React.CSSProperties = {
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '40px'
  };

  const welcomeStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333'
  };

  const subheaderStyle: React.CSSProperties = {
    fontSize: '18px',
    color: '#666',
    marginBottom: '30px'
  };

  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  };

  const statCardStyle: React.CSSProperties = {
    backgroundColor: '#f8f9fa',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    cursor: 'pointer'
  };

  const statNumberStyle: React.CSSProperties = {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: '10px'
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  };

  const quickActionsStyle: React.CSSProperties = {
    marginTop: '40px'
  };

  const actionGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginTop: '20px'
  };

  const actionButtonStyle: React.CSSProperties = {
    padding: '15px 25px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    textAlign: 'center'
  };

  const permissionsStyle: React.CSSProperties = {
    marginTop: '40px',
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px'
  };

  const permissionTagStyle: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: '#e9ecef',
    padding: '5px 10px',
    borderRadius: '4px',
    margin: '5px',
    fontSize: '14px'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <h2>Loading dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={welcomeStyle}>
          Welcome back, {currentUser?.email}!
        </h1>
        <p style={subheaderStyle}>
          You're logged in as a <strong>{stats.userRole}</strong> on the USAsset platform
        </p>
      </div>

      <div style={statsGridStyle}>
        <div 
          style={statCardStyle}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={statNumberStyle}>{stats.totalProjects}</div>
          <div style={statLabelStyle}>Projects</div>
        </div>

        {stats.totalUsers >= 0 && (
          <div 
            style={statCardStyle}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={statNumberStyle}>{stats.totalUsers}</div>
            <div style={statLabelStyle}>Users</div>
          </div>
        )}

        <div 
          style={statCardStyle}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={statNumberStyle}>{currentUser?.permissions?.length || 0}</div>
          <div style={statLabelStyle}>Permissions</div>
        </div>
      </div>

      <div style={quickActionsStyle}>
        <h2 style={{ marginBottom: '20px' }}>Quick Actions</h2>
        <div style={actionGridStyle}>
          <button 
            style={actionButtonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
          >
            View Projects
          </button>
          <button 
            style={actionButtonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
          >
            Browse Assets
          </button>
          <button 
            style={actionButtonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
          >
            View Locations
          </button>
          {currentUser?.permissions?.includes('create:report') && (
            <button 
              style={actionButtonStyle}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
            >
              Generate Report
            </button>
          )}
        </div>
      </div>

      <div style={permissionsStyle}>
        <h3 style={{ marginBottom: '15px' }}>Your Permissions</h3>
        <div>
          {currentUser?.permissions?.map((permission) => (
            <span key={permission} style={permissionTagStyle}>
              {permission}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}