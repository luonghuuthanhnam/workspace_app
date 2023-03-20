import { Row, Col, Input, Button } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';


const baseURL = "http://localhost:8000";
function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [userId, setUserId] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleLogin = () => {
    fetch(`${baseURL}/WorkingApp/Auth/Login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "email": email,
        "password": password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.user_id) {
          setUserId(data.user_id);
          localStorage.setItem('userID', data.user_id)
          console.log("USER_ID:", data.user_id)
          onLogin(data.user_id); // Call onLogin function with the user id
          // navigate('/MainWorkSpace'); // redirect to MainWorkSpace page
        } else {
          setErrorMessage(data.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <Row justify="space-between" style={{ marginTop: '20px' }}>
        <Col span={12}></Col>
        <Col span={12}>
          <span style={{ marginRight: '20px' }}>Language Option</span>
          <span>Contact Information</span>
        </Col>
      </Row>
      <Row>
        <Col span={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: "80vh" }}>
          <div style={{ width: '40vw', textAlign: 'center' }}>
            <img src="../images/cover_bgr.png" style={{ width: '35vw', marginBottom: '20px', marginLeft: '10vw' }} />
          </div>
        </Col>
        <Col span={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: "80vh" }}>
          <div style={{ maxWidth: '400px', textAlign: 'center' }}>
            <img src="../images/logo.png" alt="Logo" style={{ width: '200px', marginBottom: '20px' }} />
            <Input placeholder="Email" style={{ marginBottom: '10px' }} value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input.Password placeholder="Password" style={{ marginBottom: '20px' }} value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="primary" style={{ marginRight: '10px', backgroundColor: "#5EAAA8" }} onClick={handleLogin}>Login</Button>
            <Button>Sign Up</Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default LoginPage;