import logo from './logo.svg';
import './App.css';
import LoginPage from './pages/login/login';
import { Button, ConfigProvider, Form, InputNumber } from 'antd';
import MainWorkSpace from './pages/main_workspace/main_workspace';
import './pages/login/login.css'
import { Router, Route, Routes, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { baseURL } from './config';
import TestEditablTable from './components/EditableTable/editable_table';



const defaultData = {
  borderRadius: 6,
  colorPrimary: '#1677ff',
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (username, password) => {
    setUserId(userId);

    setIsAuthenticated(true);
    navigate('/');
  };

  const handleLogout = () => {
    // Set isAuthenticated to false and navigate to the login page
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#5EAAA8",
        },
      }}
    >
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={<LoginPage onLogin={handleLogin} isAuthenticated={isAuthenticated} />}
          />
          <Route
            path="/"
            element={<MainWorkSpace onLogout={handleLogout} isAuthenticated={isAuthenticated} userId={userId} />}
          />
        </Routes>
      </div>
    </ConfigProvider>
  );

}

export default App;
