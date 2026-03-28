import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// ✅ Fix 1: Set baseURL and token BEFORE component mounts
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const savedToken = localStorage.getItem('token');
if (savedToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(savedToken);
  const [loading, setLoading] = useState(true);

  // ✅ Fix 2: Remove [token] dependency — only run once on mount
  useEffect(() => {
    if (savedToken) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMe = async () => {
    try {
      const { data } = await axios.get('/api/auth/me');
      setUser(data.user);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    // ✅ Fix 3: Trim whitespace from inputs
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    console.log('🔐 Logging in with:', trimmedEmail);

    const { data } = await axios.post('/api/auth/login', {
      email: trimmedEmail,
      password: trimmedPassword
    });

    localStorage.setItem('token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};