import { width } from '@mui/system';
import { Row, Col, Input, Button, Spin, message} from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../../config';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [userId, setUserId] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false); // Add loading state

  const handleLogin = () => {
    setLoading(true); // Set loading state to true before making API call
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
        setLoading(false); // Reset loading state after receiving response

        if (data != null) {
          setUserId(data.user_id);
          localStorage.setItem('userID', data.user_id)
          localStorage.setItem('user_name', data.user_name)
          localStorage.setItem('group_id', data.group_id)
          onLogin(data.user_id);
          message.success(`Welcome ${data.user_name}`);
          // navigate('/MainWorkSpace');
        } else {
          message.error('WorkSpace Login Failed');
          setErrorMessage(data.message);
        }
      })
      .catch((error) => {
        console.error(error);
        setLoading(false); // Reset loading state in case of error
      });
  };

  return (
    <div>
      <Row justify="space-between" style={{ marginTop: '20px' }}>
        <Col span={12}></Col>
        {/* <Col span={12}>
          <span style={{ marginRight: '20px' }}>Language Option</span>
          <span>Contact Information</span>
        </Col> */}
      </Row>
      <Row>
        <Col span={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: "80vh" }}>
          <div style={{ width: '40vw', textAlign: 'center' }}>
            <img src="../images/cover_bgr.png" style={{ width: '35vw', marginBottom: '20px', marginLeft: '10vw' }} />
          </div>
        </Col>
        <Col span={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: "80vh" }}>
          <div style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent:"space-evenly",
                marginBottom: "3vh"
              }}
            >
            <img src="cdvn_logo.jpg" alt="Logo" style={{ width: '7vw', marginBottom: '20px' }} />
            <img src="khcn_logo.jpg" alt="Logo" style={{ width: '7vw', marginBottom: '20px'}} />
            </div>
            <Input placeholder="Email" style={{ marginBottom: '10px' }} value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input.Password placeholder="Password" style={{ marginBottom: '20px' }} value={password} onChange={(e) => setPassword(e.target.value)} onPressEnter={handleLogin}/>
            {/* <Button type="primary" style={{ marginRight: '10px', backgroundColor: "#5EAAA8" }} onClick={handleLogin}>Login</Button> */}
            <Spin spinning={loading}> {/* Wrap the login button with Spin component */}
              <Button type="primary" style={{ marginRight: '10px', backgroundColor: "#5EAAA8"}} onClick={handleLogin}>ĐĂNG NHẬP</Button>
              {/* <Button>Sign Up</Button> */}
            </Spin>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default LoginPage;