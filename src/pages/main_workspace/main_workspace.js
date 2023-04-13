import { FileOutlined, PieChartOutlined, UserOutlined, DesktopOutlined, TeamOutlined, ScheduleOutlined, UsergroupAddOutlined, ToolOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Affix } from 'antd';
import { Button, ConfigProvider, Form, InputNumber } from 'antd';
import { useState, useEffect } from 'react';
import LoginPage from '../login/login';
import EmployeeTable from './employee/employee_table';
import EmployeeChart from './employee/employee_chart';
import JoinedEvent from './event/joined_event';
import { useNavigate } from 'react-router-dom';
import CreateEvent from './event/manager/create_event';
import EventCardLayoutv2 from './event/admin/event_card';
import ViewRegistedEvent from './event/manager/view_registed_event';

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
  const group_id = localStorage.getItem('group_id');
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
  const collapsed_icon = <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: 45,
      margin: 16,
      fontWeight: "bold",

    }}
  >
    <img src="favicon.ico" alt="" style={{ height: "100%" }} />
  </div>

  const siderTitle = collapsed ? collapsed_icon :
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
    >
      <h4>
        WorkSpace on Cloud
      </h4>
    </div>

  const items = [
    getItem('Event', '1', <ScheduleOutlined />, [
      getItem('Event list', '11'),
      // getItem('Pendding', '12'),
      // getItem('Rejected', '13'),
      // getItem('Create', '14'),
    ]
    ),
    // getItem('Project List', '2', <DesktopOutlined />),
    getItem('Employee', '3', <UsergroupAddOutlined />, [
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
      getItem('Event - Admin', '4', <ToolOutlined />, [
        getItem('Create Event', '41'),
        getItem('View Registed Data', '42'),
        getItem('Event Dashboard', '43'),
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
      <Layout style={{ height: '100vh' }}>
        <Affix offsetTop={10}>
          <Sider
            style={{
              backgroundColor: '#FFFFFF',
              height: "100%",
            }}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
          >
            {siderTitle}
            <Menu
              theme="light"
              defaultSelectedKeys={['32']}
              defaultOpenKeys={['3']}
              mode="inline"
              items={items}
              onClick={handleMenuItemClick}
            />
          </Sider>
        </Affix>
        <Layout className="site-layout">
          <Header
            style={{
              padding: 0,
              height: "5vh",
              background: '#A3D2CA',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: "100%" }}>
              <h3 style={{marginLeft: "0.8vw", color:"#FFFFFF"}}>WORKSPACE ON CLOUD</h3>
              <Button style={{ marginRight: '10px', backgroundColor: "#E96767", color: "#FFFFFF" }} onClick={handleLogout}>Log out</Button>
            </div>
          </Header>
          <Content
            style={{
              margin: '0px 16px',
              // maxHeight: "150vh",
            }}
          >
            <Breadcrumb style={{ margin: '1vh 0' }}>
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
                height: "88vh",
                // height: ,
                background: colorBgContainer,
              }}
            >
              {selectedMenuItem === '31' && <EmployeeTable />}
              {selectedMenuItem === '32' && <EmployeeChart />}
              {selectedMenuItem === '11' && <EventCardLayoutv2 event_state="Joined" userId={userId} />}
              {/* {selectedMenuItem === '12' && <EventCardLayoutv2 event_state="Pendding" userId={userId} />}
              {selectedMenuItem === '13' && <EventCardLayoutv2 event_state="Rejected" userId={userId} />} */}
              {selectedMenuItem === '41' && <CreateEvent user_id={userId} onCreateEventSuccess={handleCreateEventSuccess}></CreateEvent>}
              {selectedMenuItem === '42' && <ViewRegistedEvent></ViewRegistedEvent>}

            </div>
          </Content>
          {/* <Footer
            style={{
              height: "2vh",
              textAlign: 'center',
            }}
          >
            ©2023 Created by SLN
          </Footer> */}
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
export default MainWorkSpace;