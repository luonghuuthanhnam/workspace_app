import React from "react";
import { Space, Table, Tag, Button, Row, Col, Spin } from 'antd';
import columns from './employee_columns';
import axios from 'axios';
import { Pie, measureTextWidth } from '@ant-design/plots';
import EmployeePieChart from "./employee_pie";
import JoiningByGenderChart from "./employee_joining_by_gender_chart";
import AgeDistributionChart from "./employee_age_line_chart";
import ProvinceDistributionChart from "./employee_province_distribution";
import SunburstChart from "./sunburst_chart";
import { baseURL } from '../../../config';
import { width } from "@mui/system";

const EmployeeChart = () => {
    const [received_data, setReceived_data] = React.useState(null);
    const [received_pie_data, setReceived_pie_data] = React.useState(null);
    const [received_working_status_data, setReceived_working_status_data] = React.useState(null);
    const [received_sunburst_data, setReceived_sunburst_data] = React.useState(null);

    const [received_joining_data, setReceived_joining_data] = React.useState(null);
    const [received_age_data, setReceived_age_data] = React.useState(null);
    const [received_province_data, setReceived_province_data] = React.useState(null);

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
            setReceived_pie_data(response.data["pie_chart"]);
            setReceived_working_status_data(response.data["working_status"]);
            setReceived_sunburst_data(response.data["sunburst_data"]);
            setReceived_joining_data(JSON.parse(response.data["joining_by_gender"]));
            setReceived_age_data(JSON.parse(response.data["age_distribution"]));
            setReceived_province_data(JSON.parse(response.data["province_distribution"]));
            setLoading(false);
        });
    }

    return (
        <div style={{ height: '100%', overflowY: "scroll", backgroundColor: "#FFFFFF", borderRadius: "1vw", padding: "1%", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)" }}>
            <Spin spinning={loading}>
                <div className="employee_main_div">
                    <Row justify="space-between" style={{ margin: '4vh' }}>
                        <Col style={{ paddingLeft: '2vw', width:"30%"}}>
                            {/* <h3 className="chart_title" style={{ display: 'flex', alignItems: 'center' }}>GENDER RATIO</h3> */}
                            <EmployeePieChart className='employee_pie_chart' data={received_pie_data} annotation={"Số nhân viên"} title={"TỈ LỆ GIỚI TÍNH"}></EmployeePieChart>
                        </Col>
                        <Col style={{ paddingLeft: '2vw', width:"30%"}}>
                            {/* <h3 className="chart_title" style={{ display: 'flex', alignItems: 'center' }}>DEPARTMENT EMPLOYEE</h3> */}
                            <SunburstChart className='employee_pie_chart' data={received_sunburst_data} title={"NHÂN VIÊN TRỰC THUỘC PHÒNG/BAN"}></SunburstChart>
                        </Col>
                        <Col style={{ paddingLeft: '2vw', width:"30%"}}>
                            {/* <h3 className="chart_title" style={{ display: 'flex', alignItems: 'center' }}>EMPLOYEE STATUS</h3> */}
                            <EmployeePieChart className='employee_pie_chart' data={received_working_status_data} annotation={"Số nhân viên"} title={"SỐ LƯỢNG NHÂN VIÊN ĐANG LÀM - ĐÃ NGHỈ"}></EmployeePieChart>
                        </Col>
                    </Row>
                    <Row style={{ margin: '4vh', width: "95%"}}>
                        <div style={{width:"100%"}}>
                            <h3 className="chart_title" style={{ display: 'flex', alignItems: 'center' }}>SỐ LƯỢNG NHÂN VIÊN MỚI MỖI NĂM</h3>
                            <JoiningByGenderChart data={received_joining_data}></JoiningByGenderChart>
                        </div>
                    </Row>
                    <Row justify="space-between" style={{ marginTop: '20px', margin: '4vh' }}>
                        <Col span={8}>
                            <h3 className="chart_title" style={{ display: 'flex', alignItems: 'center' }}>NGUYÊN QUÁN NHÂN VIÊN</h3>
                            <ProvinceDistributionChart data={received_province_data}></ProvinceDistributionChart>
                        </Col>
                        <Col span={16} style={{ paddingLeft: '5vw' }}>
                            <h3 className="chart_title" style={{ display: 'flex', alignItems: 'center' }}>ĐỘ TUỔI NHÂN VIÊN</h3>
                            <AgeDistributionChart data={received_age_data}></AgeDistributionChart>
                        </Col>
                    </Row>
                </div>
            </Spin>
        </div>
    );
};
export default EmployeeChart;