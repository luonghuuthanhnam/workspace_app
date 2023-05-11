import React from "react";
import {Spin } from 'antd';
import columns from './employee_columns';
import axios from 'axios';
import { Pie, measureTextWidth } from '@ant-design/plots';
import EmployeePieChart from "./employee_pie";
import EditableTable from "../../../components/EditableTable/editable_table";
import { baseURL } from '../../../config';

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
  // console.log("received_data:", received_data);
  return (
    <div style={{ height: "100%", width: "100%",backgroundColor: "#FFFFFF", overflowY: "auto", borderRadius: "1vw", padding: "1%", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)" }}>
      <Spin style={{ height: "100%", width: "100%", overflowY: "auto"}} spinning={loading}>
        {/* <div className="employee_main_div" style={{maxHeight:"100%"}}> */}
          <EditableTable emp_data={received_data}></EditableTable>
        {/* </div> */}
      </Spin>
    </div>
  );
};
export default EmployeeTable;