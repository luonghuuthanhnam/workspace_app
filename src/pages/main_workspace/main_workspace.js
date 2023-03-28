import { FileOutlined, PieChartOutlined, UserOutlined, DesktopOutlined, TeamOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Button, ConfigProvider, Form, InputNumber } from 'antd';
import { useState, useEffect } from 'react';
import LoginPage from '../login/login';
import EmployeeTable from './employee/employee_table';
import EmployeeChart from './employee/employee_chart';
import JoinedEvent from './event/joined_event';
import { useNavigate } from 'react-router-dom';
import CreateEvent from './event/manager/create_event';
import EventCardLayoutv2 from './event/admin/event_card';

const { Header, Content, Footer, Sider } = Layout;


function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
function MainWorkSpace() {
  const navigate = useNavigate();
  const handleLogout = () => {
    console.log("logging out")
    localStorage.removeItem("userID")
    navigate('/login');
  };


  const userId = localStorage.getItem('userID');
  const adminIds = ["19031998", "12345678", "87654321"]; // replace with your list of admin IDs
  const isAdmin = adminIds.includes(userId);
  useEffect(() => {
    if (userId == null) {
      navigate('/login');
    }
  }, [userId, navigate]);

  console.log("message from mainworkspace:", userId)
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('32');
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleMenuItemClick = ({ key }) => {
    setSelectedMenuItem(key);
  };

  const items = [
    getItem('Event', '1', <PieChartOutlined />, [
      getItem('Event list', '11'),
      // getItem('Pendding', '12'),
      // getItem('Rejected', '13'),
      // getItem('Create', '14'),
    ]
    ),
    // getItem('Project List', '2', <DesktopOutlined />),
    getItem('Employee', '3', <UserOutlined />, [
      getItem('Table', '31'),
      getItem('Chart', '32'),
    ]),

    // getItem('Event - Admin', '4', <UserOutlined />, [
    //   getItem('Create Event', '41'),
    //   getItem('Edit Event', '42'),
    //   getItem('Remove Event', '43'),
    //   getItem('Event Chart', '44'),
    // ]),
  ];


  if (isAdmin) {
    items.push(
      getItem('Event - Admin', '4', <UserOutlined />, [
        getItem('Create Event', '41'),
        // getItem('Edit Event', '42'),
        // getItem('Remove Event', '43'),
        // getItem('Event Chart', '44'),
      ])
    );
  }

  function handleCreateEventSuccess() {
    setSelectedMenuItem('11');
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#5EAAA8',
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          style={{
            backgroundColor: '#FFFFFF',
          }}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 32,
              margin: 16,
              background: "#5EAAA8",
              color: "#FFFFFF",
              fontWeight: "bold",

            }}
          >KNOW YOUR DATA</div>
          <Menu
            theme="light"
            defaultSelectedKeys={['32']}
            defaultOpenKeys={['3']}
            mode="inline"
            items={items}
            onClick={handleMenuItemClick}
          />
        </Sider>
        <Layout className="site-layout">
          <Header
            style={{
              padding: 0,
              height: "7vh",
              background: '#A3D2CA',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: "100%" }}>
              <Button type="primary" style={{ marginRight: '10px', backgroundColor: "#E96767" }} onClick={handleLogout}>Log out</Button>
            </div>
          </Header>
          <Content
            style={{
              margin: '0px 16px',
            }}
          >
            <Breadcrumb style={{ margin: '15px 0' }}>
              {items
                .filter((item) => item.key === selectedMenuItem || item.children?.some((child) => child.key === selectedMenuItem))
                .map((item) => {
                  if (item.key === selectedMenuItem) {
                    return <Breadcrumb.Item key={item.key}>{item.label}</Breadcrumb.Item>;
                  } else {
                    const selectedChild = item.children?.find((child) => child.key === selectedMenuItem);
                    return (
                      <Breadcrumb.Item key={item.key}>
                        {item.label} {selectedChild && `> ${selectedChild.label}`}
                      </Breadcrumb.Item>
                    );
                  }
                })}
            </Breadcrumb>
            <div
              style={{
                padding: 15,
                minHeight: "78vh",
                // height: ,
                background: colorBgContainer,
              }}
            >
              {selectedMenuItem === '31' && <EmployeeTable />}
              {selectedMenuItem === '32' && <EmployeeChart />}
              {selectedMenuItem === '11' && <EventCardLayoutv2 event_state="Joined" userId={userId} />}
              {selectedMenuItem === '12' && <EventCardLayoutv2 event_state="Pendding" userId={userId} />}
              {selectedMenuItem === '13' && <EventCardLayoutv2 event_state="Rejected" userId={userId} />}
              {selectedMenuItem === '41' && <CreateEvent user_id={userId} onCreateEventSuccess={handleCreateEventSuccess}></CreateEvent>}
            </div>
          </Content>
          <Footer
            style={{
              height: "2vh",
              textAlign: 'center',
            }}
          >
            ©2023 Created by SLN
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
export default MainWorkSpace;