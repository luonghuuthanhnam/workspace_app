import { FileOutlined, FundViewOutlined, DownSquareOutlined, PlusSquareOutlined, StarOutlined, ScheduleOutlined, UsergroupAddOutlined, ToolOutlined, SolutionOutlined, FundOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Affix, Popover, Row, Col, Divider } from 'antd';
import { Button, ConfigProvider, Form, InputNumber, Avatar } from 'antd';
import { useState, useEffect } from 'react';
import LoginPage from '../login/login';
import EmployeeTable from './employee/employee_table';
import EmployeeChart from './employee/employee_chart';
import JoinedEvent from './event/joined_event';
import { useNavigate } from 'react-router-dom';
import CreateEvent from './event/manager/create_event';
import EventCardLayoutv2 from './event/admin/event_card';
import ViewRegistedEvent from './event/manager/view_registed_event';
import EventDashboard from './event/manager/event_dashboard';
import { baseURL } from '../../config';
import UploadForm from './upload/upload_form';
import { display } from '@mui/system';


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
  const userId = localStorage.getItem('userID');
  const group_id = localStorage.getItem('group_id');
  const user_name = localStorage.getItem('user_name');
  const adminIds = ["19031998", "12345678", "87654321"];
  const isAdmin = adminIds.includes(userId);

  const handleLogout = () => {
    localStorage.removeItem("userID")
    navigate('/login');
  };

  useEffect(() => {
    fetch(`${baseURL}/imployee/get_all_employee_code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "groupID": group_id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const emp_code = data
        console.log("datadata: ", data);
        localStorage.setItem('emp_code', JSON.stringify(emp_code));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (userId == null) {
      navigate('/login');
    }
  }, [userId, navigate]);

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

  // const siderTitle = collapsed ? collapsed_icon :
  const siderTitle = collapsed ? <Divider></Divider> :
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
        borderRadius: "0.2vw",

      }}
    >
      <h4>
        WORKSPACE
      </h4>
    </div>

  const siderLogo = collapsed ?
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <Col style={{ width: "100%" }}>
        <Row style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <img src="cdvn_logo.jpg" alt="Logo 1" width="60%" />
        </Row>
        <Row style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <img src="khcn_logo.jpg" alt="Logo 2" width="60%" />
        </Row>
      </Col>
    </div>
    :
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Row style={{ display: "flex", justifyContent: "center" }}>
        <img src="cdvn_logo.jpg" alt="Logo 1" width="25%" />
        <img src="khcn_logo.jpg" alt="Logo 2" width="25%" />
      </Row>
    </div>

  const items = [
    getItem('Sự kiện', '1', <ScheduleOutlined />, [
      getItem('Danh sách', '11', <StarOutlined />)
    ]
    ),
    getItem('Nhân viên', '3', <UsergroupAddOutlined />, [
      getItem('Bảng', '31', <SolutionOutlined />),
      getItem('Biểu đồ', '32', <FundOutlined />),
    ]),
  ];


  if (isAdmin) {
    items.push(
      getItem('Manager', '4', <ToolOutlined />, [
        getItem('Tạo sự kiện', '41', <PlusSquareOutlined />),
        getItem('Danh sách đăng ký', '42', <DownSquareOutlined />),
        getItem('Dashboard', '43', <FundViewOutlined />),
      ])
    );
    // items.push(
    //   getItem("Upload File", "5", <FileOutlined />));
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
              minHeight: '100vh',
              height: "auto",
            }}
            width= {"20vw"}
            collapsedWidth={"10vw"}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
          >
            {siderLogo}
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
              height: "5%",
              background: '#A3D2CA',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: "100%" }}>
              <h3 style={{ marginLeft: "0.8vw", color: "#FFFFFF" }}>WORKSPACE ON CLOUD</h3>
              <div style={{ width: "10%", display: "flex", justifyContent: "end", alignItems: "center", marginRight: "1vw" }}>

                <Button style={{ marginRight: '10px', backgroundColor: "#E96767", color: "#FFFFFF", height: "85%" }} onClick={handleLogout}>Đăng xuất</Button>
                <Popover content={user_name} title={'Xin chào'} placement="right">
                  <Avatar
                    style={{
                      backgroundColor: '#f56a00',
                      verticalAlign: 'middle',
                    }}
                    size="large"
                    gap={4}
                  >
                    {user_name ? user_name.charAt(0).toUpperCase() : ""}
                  </Avatar>
                </Popover>

              </div>
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
                height: "92%",
                // height: "80vh",
                // width: "100%",
                width: "auto",
                // height: ,
                // background: colorBgContainer,
                background: "#F5F5F5"
              }}
            >

              {selectedMenuItem === '31' && <EmployeeTable />}
              {selectedMenuItem === '32' && <EmployeeChart />}
              {selectedMenuItem === '11' && <EventCardLayoutv2 event_state="Joined" userId={userId} />}

              {selectedMenuItem === '41' && <CreateEvent user_id={userId} onCreateEventSuccess={handleCreateEventSuccess}></CreateEvent>}
              {selectedMenuItem === '42' && <ViewRegistedEvent></ViewRegistedEvent>}
              {selectedMenuItem === '43' && <EventDashboard></EventDashboard>}
              {selectedMenuItem === '5' && <UploadForm></UploadForm>}

              {/* <EditableTable></EditableTable> */}
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
export default MainWorkSpace;