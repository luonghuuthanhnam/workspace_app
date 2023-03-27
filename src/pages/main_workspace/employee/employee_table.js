import React from "react";
import { Space, Table, Tag, Button } from 'antd';
import columns from './employee_columns';
import axios from 'axios';
import { Pie, measureTextWidth } from '@ant-design/plots';
import EmployeePieChart from "./employee_pie";
// const baseURL = "https://sophisticated-incredible-ostrich.glitch.me/";
const baseURL = localStorage.getItem('backed_baseURL');

const EmployeeTable = () => {
  const [received_data, setReceived_data] = React.useState(null);
  // const [received_pie_data, setReceived_pie_data] = React.useState(null);

  // const [filteredInfo, setFilteredInfo] = useState({});
  // const [sortedInfo, setSortedInfo] = useState({});
  // const handleChange = (pagination, filters, sorter) => {
  //   console.log('Various parameters', pagination, filters, sorter);
  //   setFilteredInfo(filters);
  //   setSortedInfo(sorter);
  // };
  // const clearFilters = () => {
  //   setFilteredInfo({});
  // };
  // const clearAll = () => {
  //   setFilteredInfo({});
  //   setSortedInfo({});
  // };
  // const setAgeSort = () => {
  //   setSortedInfo({
  //     order: 'descend',
  //     columnKey: 'age',
  //   });
  // };


  React.useEffect(() => {
    createPost();
  }, []);
  function createPost() {
    axios.post(`${baseURL}/imployee/query`, {
      length: -1,
    }).then((response) => {
      setReceived_data(response.data["main_data"]);
      // setReceived_pie_data(response.data["pie_chart"]);
    });
  }
  return (
    <>
      <div className="employee_main_div">
        <Table
          className='employee_table'
          columns={columns}
          dataSource={received_data}
          pagination={{
            pageSize: 25,
          }}
          scroll={{
            y: "56vh",
            x: "75vw"
          }}
        />
      </div>

    </>
  );
};
export default EmployeeTable;