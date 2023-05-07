import { FileOutlined, FundViewOutlined, DownSquareOutlined, PlusSquareOutlined, StarOutlined, ScheduleOutlined, UsergroupAddOutlined, ToolOutlined, SolutionOutlined, FundOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Affix, Popover } from 'antd';
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
    localStorage.removeItem("userID")
    navigate('/login');
  };

  useEffect(() => {
    fetch(`${baseURL}/imployee/get_all_employee_code`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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




  const userId = localStorage.getItem('userID');
  const group_id = localStorage.getItem('group_id');
  const adminIds = ["19031998", "12345678", "87654321"];
  const isAdmin = adminIds.includes(userId);
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
      getItem('Event list', '11', <StarOutlined />)
    ]
    ),
    getItem('Employee', '3', <UsergroupAddOutlined />, [
      getItem('Table', '31', <SolutionOutlined />),
      getItem('Chart', '32', <FundOutlined />),
    ]),
  ];


  if (isAdmin) {
    items.push(
      getItem('Event - Admin', '4', <ToolOutlined />, [
        getItem('Create Event', '41', <PlusSquareOutlined />),
        getItem('View Registed Data', '42', <DownSquareOutlined />),
        getItem('Event Dashboard', '43', <FundViewOutlined />),
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
              height: "5%",
              background: '#A3D2CA',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: "100%" }}>
              <h3 style={{ marginLeft: "0.8vw", color: "#FFFFFF" }}>WORKSPACE ON CLOUD</h3>
              <div style={{width: "10%", display:"flex", justifyContent:"end", alignItems: "center", marginRight: "1vw"}}>

                <Button style={{ marginRight: '10px', backgroundColor: "#E96767", color: "#FFFFFF", height: "85%" }} onClick={handleLogout}>Log out</Button>
                <Popover content={"trung tam 1"} title={'Trung tâm 1'} placement="right">
                <Avatar
                  style={{
                    backgroundColor: '#f56a00',
                    verticalAlign: 'middle',
                  }}
                  size="large"
                  gap={4}
                  >
                  TT1
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
                width: "100%",
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