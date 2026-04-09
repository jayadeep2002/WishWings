import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [agent, setAgent] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userToken = sessionStorage.getItem('wishwings_user_token');
    const agentToken = sessionStorage.getItem('wishwings_agent_token');
    const adminToken = sessionStorage.getItem('wishwings_admin_token');

    const verifyTokens = async () => {
      if (userToken) {
        try {
          const res = await axios.get(`http://${window.location.hostname}:5000/api/user/profile`, {
            headers: { Authorization: `Bearer ${userToken}` }
          });
          setUser(res.data.user);
        } catch { sessionStorage.removeItem('wishwings_user_token'); }
      }
      
      if (agentToken) {
        try {
          const res = await axios.get(`http://${window.location.hostname}:5000/api/agent/profile`, {
            headers: { Authorization: `Bearer ${agentToken}` }
          });
          setAgent(res.data.agent);
        } catch { sessionStorage.removeItem('wishwings_agent_token'); }
      }

      if (adminToken) {
        try {
          const res = await axios.get(`http://${window.location.hostname}:5000/api/admin/profile`, {
            headers: { Authorization: `Bearer ${adminToken}` }
          });
          setAdmin(res.data.admin);
        } catch { sessionStorage.removeItem('wishwings_admin_token'); }
      }

      setLoading(false);
    };

    verifyTokens();
  }, []);

  const loginUser = (token, userData) => {
    sessionStorage.setItem('wishwings_user_token', token);
    setUser(userData);
  };

  const loginAgent = (token, agentData) => {
    sessionStorage.setItem('wishwings_agent_token', token);
    setAgent(agentData);
  };

  const loginAdmin = (token, adminData) => {
    sessionStorage.setItem('wishwings_admin_token', token);
    setAdmin(adminData);
  };

  const logout = () => {
    sessionStorage.removeItem('wishwings_user_token');
    sessionStorage.removeItem('wishwings_agent_token');
    sessionStorage.removeItem('wishwings_admin_token');
    setUser(null);
    setAgent(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ user, agent, admin, loading, loginUser, loginAgent, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
