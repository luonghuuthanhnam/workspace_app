import React from "react";
import { Space, Table, Tag, Button, Spin } from 'antd';
import columns from './employee_columns';
import axios from 'axios';
import { Pie, measureTextWidth } from '@ant-design/plots';
import EmployeePieChart from "./employee_pie";
import { baseURL } from '../../../config';

// const baseURL = "https://sophisticated-incredible-ostrich.glitch.me/";
// const baseURL = localStorage.getItem('backed_baseURL');

const EmployeeTable = () => {
  const [received_data, setReceived_data] = React.useState(null);
  const [loading, setLoading] = React.useState(false); // Add loading state

  React.useEffect(() => {
    createPost();
  }, []);
  function createPost() {
    setLoading(true);
    axios.post(`${baseURL}/imployee/query`, {
      length: -1,
    }).then((response) => {
      setReceived_data(response.data["main_data"]);
      setLoading(false);
    });
  }
  return (
    <>
    <Spin spinning={loading}>
      <div className="employee_main_div">
        <Table
          className='employee_table'
          columns={columns}
          dataSource={received_data}
          pagination={{
            pageSize: 25,
          }}
          scroll={{
            y: "70vh",
            x: "75vw"
          }}
        />
      </div>
    </Spin>
    </>
  );
};
export default EmployeeTable;