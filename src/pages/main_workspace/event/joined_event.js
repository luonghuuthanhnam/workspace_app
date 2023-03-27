import React from "react";
import { Space, Table, Tag, Button, Row, Col } from 'antd';
import columns from '../employee/employee_columns';
import axios from 'axios';
import { Pie, measureTextWidth } from '@ant-design/plots';
import EmployeePieChart from "../employee/employee_pie";
import JoiningByGenderChart from "../employee/employee_joining_by_gender_chart";
import AgeDistributionChart from "../employee/employee_age_line_chart";
import ProvinceDistributionChart from "../employee/employee_province_distribution";

// const baseURL = "https://sophisticated-incredible-ostrich.glitch.me/";
const baseURL = localStorage.getItem('backed_baseURL');

const JoinedEvent = () => {
    const [received_data, setReceived_data] = React.useState(null);
    const [received_pie_data, setReceived_pie_data] = React.useState(null);
    const [received_joining_data, setReceived_joining_data] = React.useState(null);
    const [received_age_data, setReceived_age_data] = React.useState(null);
    const [received_province_data, setReceived_province_data] = React.useState(null);


    React.useEffect(() => {
        createPost();
    }, []);
    function createPost() {
        axios.post(`${baseURL}/imployee/query`, {
            length: -1,
        }).then((response) => {
            setReceived_data(response.data["main_data"]);
            setReceived_pie_data(response.data["pie_chart"]);
            setReceived_joining_data(JSON.parse(response.data["joining_by_gender"]));
            setReceived_age_data(JSON.parse(response.data["age_distribution"]));
            setReceived_province_data(JSON.parse(response.data["province_distribution"]));
        });
    }
    return (
        <>
            <div className="employee_main_div">
                <Row justify="space-between" style={{ marginTop: '20px' }}>
                    <Col span={8}>
                        <h3 className="chart_title" style={{ display: 'flex', alignItems: 'center' }}>GENDER RATIO</h3>
                        <EmployeePieChart className='employee_pie_chart' data={received_pie_data}></EmployeePieChart>
                    </Col>
                    <Col span={16} style={{ paddingLeft: '5vw' }}>
                        <h3 className="chart_title" style={{ display: 'flex', alignItems: 'center' }}>ANNUALLY JOINING EMPLOYEE</h3>
                        <JoiningByGenderChart data={received_joining_data}></JoiningByGenderChart>
                    </Col>
                </Row>
                <Row style={{ marginTop: '10vh' }}></Row>
                <Row justify="space-between" style={{ marginTop: '20px' }}>
                    <Col span={8}>
                        <h3 className="chart_title" style={{ display: 'flex', alignItems: 'center' }}>EMPLOYEE HOMETOWN DISTRIBUTION</h3>
                        <ProvinceDistributionChart data={received_province_data}></ProvinceDistributionChart>
                    </Col>
                    <Col span={16} style={{ paddingLeft: '5vw' }}>
                        <h3 className="chart_title" style={{ display: 'flex', alignItems: 'center' }}>EMPLOYEE AGE DISTRIBUTION</h3>
                        <AgeDistributionChart data={received_age_data}></AgeDistributionChart>
                    </Col>
                </Row>

            </div>
        </>
    );
};
export default JoinedEvent;