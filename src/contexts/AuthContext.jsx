import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
// Removed direct import of 'request' as loginUser API call will be used.
import { loginUser as apiLoginUser } from '@/api/index'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const initializeAuth = useCallback(async () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('smartTraderUser');
      const token = localStorage.getItem('smartTraderToken');
      if (storedUser && token) {
        const parsedUser = JSON.parse(storedUser);
        // Here you might want to add a /me or /validate-token API call
        // to ensure the token is still valid on the backend.
        // For now, we trust localStorage if both items exist.
        setUser(parsedUser);
      } else {
        // Ensure consistency: if one is missing, clear both.
        localStorage.removeItem('smartTraderUser');
        localStorage.removeItem('smartTraderToken');
      }
    } catch (error) {
      console.error("Failed to initialize auth from localStorage:", error);
      localStorage.removeItem('smartTraderUser');
      localStorage.removeItem('smartTraderToken');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Actual API call using the imported apiLoginUser
      // const { user: userData, token } = await apiLoginUser({ email, password });

      // Simulate API call for now, as backend might not be ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      let userData, token;
      if (email === 'bharat.ksagar22@gmail.com' && password === 'Shlok@1622') {
        userData = { id: '1', email: 'bharat.ksagar22@gmail.com', name: 'Bharat Sagar', role: 'admin' };
        token = 'simulated-admin-token-bharat';
      } else if (email === 'user@example.com' && password === 'password') {
        userData = { id: '2', email: 'user@example.com', name: 'Regular User', role: 'user' };
        token = 'simulated-user-token';
      } else {
        throw new Error('Invalid credentials. Please try again.');
      }
      
      localStorage.setItem('smartTraderUser', JSON.stringify(userData));
      localStorage.setItem('smartTraderToken', token);
      setUser(userData);
      toast({ title: "Login Successful", description: `Welcome back, ${userData.name}!` });
      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      toast({ variant: "destructive", title: "Login Failed", description: error.message || "An unexpected error occurred during login." });
      localStorage.removeItem('smartTraderUser');
      localStorage.removeItem('smartTraderToken');
      throw error; // Re-throw to allow LoginPage to handle it if needed
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Consider calling a backend /logout endpoint here if it exists
    // await request('/auth/logout', { method: 'POST' });
    localStorage.removeItem('smartTraderUser');
    localStorage.removeItem('smartTraderToken');
    setUser(null);
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    // Redirect to login page is handled by ProtectedRoute
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};