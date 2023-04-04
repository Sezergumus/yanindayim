import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();


export const AuthContexProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
    
  const login = async (inputs) => {
      // Send request to server to login and receive cookie
      const res = await axios.post("http://localhost:8080/api/auth/login", inputs, { withCredentials: true  });
      setCurrentUser(res.data);
  };

  const adminLogin = async (inputs) => {
    // Send request to server to login and receive cookie
    const res = await axios.post("http://localhost:8080/api/auth/adminlogin", inputs, { withCredentials: true  });
    
    res.data.full_name = 'admin'
    setCurrentUser(res.data);
  };

  const logout = async (inputs) => {
    await axios.post("http://localhost:8080/api/auth/logout");
    setCurrentUser(null);
  };

  const navigateTo = useNavigate();

  useEffect(() => {
    // Make unable to access login and register pages when user is logged in
    if(currentUser) {
      if(window.location.pathname === '/giris' || window.location.pathname === '/kayit') {
        navigateTo('/');
      } 
    }

    if(currentUser && currentUser.adminid) {
      if(window.location.pathname === '/olustur') {
        alert('Adminler gönderi oluşturamaz kendi hesabınıza giriş yapın.')
        navigateTo('/');
      }
    }
    
    // Save user to local storage
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};