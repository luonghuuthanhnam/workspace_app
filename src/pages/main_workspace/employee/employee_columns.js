import { color } from '@mui/system';
import { Space, Table, Tag } from 'antd';
import moment from 'moment';
const columns = [
    {
      title: 'Mã số đoàn viên in trên thẻ',
      dataIndex: 'maso_doanvien',
      key: 'maso_doanvien',
      width: "10%",
      
    },
    {
      title: 'Họ và tên',
      dataIndex: 'hovaten',
      width: "12%",
      key: 'hovaten',
      sorter: (a, b) =>{ 
        const a_firstname = a.hovaten.split(' ').pop();
        const b_firstname = b.hovaten.split(' ').pop();
        return a_firstname.localeCompare(b_firstname)
      },
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'ngaysinh',
      key: 'ngaysinh',
      width: "9%",
      sorter: {
        compare: (a, b) =>
          moment(a.ngaysinh, "DD-MM-YYYY") - moment(b.ngaysinh, "DD-MM-YYYY"),
      },
      // defaultSortOrder: 'descend',
      // sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Nguyên quán',
      dataIndex: 'tinh',
      key: 'tinh',
      width: "10%",
      sorter: (a, b) =>{ 
        return a.tinh.localeCompare(b.tinh)
      },
    },
    {
        title: 'CMND',
        dataIndex: 'cmnd',
        key: 'cmnd',
        width: "10%",
    },
    {
      title: 'Giới tính',
      key: 'gioitinh',
      width: "5%",
      dataIndex: 'gioitinh',
      render: (_, { gioitinh }) => (
        <>
          {
                  <Tag color={gioitinh === 'Nam' ? 'blue' : 'red'} key={gioitinh}>
                  {gioitinh.toUpperCase()}
                  </Tag>
          }
        </>
      ),
    },
    {
      title: 'Ngày vào công đoàn',
      dataIndex: 'ngayvao_congdoan',
      key: 'ngayvao_congdoan',
      width: "9%",
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: "12%",
      render: (_, record) => (
        <Space size="middle">
          <a>Sửa {record.name}</a>
          <a style={{color: "#cf1322"}}>Xóa</a>
        </Space>
      ),
    },
  ];

export default columns