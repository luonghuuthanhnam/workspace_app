import React, { useState, useEffect, useRef } from 'react';
import { Select, Card, Divider, Input, Affix, Button, message, Popconfirm, Row, Col, Spin } from 'antd';
import { ArrowRightOutlined, DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import StatCard from '../../../../components/statistic_card';
import HonorCard from '../../../../components/honor_card';
import { baseURL } from '../../../../config';
import { TrophyOutlined, EditOutlined, TeamOutlined, MehOutlined } from '@ant-design/icons';
import PieJoiningEmp from './charts/pie_join_emp';
import ColumnEventParticipant from './charts/bar_event_participant';
import EntitySelection from '../../../../components/entity_selection';
import { padding } from '@mui/system';
import PeriodSelection from '../../../../components/period_selection';

const EventDashboard = () => {
    const [total_stat, setTotal_stat] = useState(null);
    const [pie_join_emp_data, setPie_join_emp_data] = useState(null);
    const [col_event_each_group_data, setCol_event_each_group_data] = useState(null);
    const [mvp_group_emp_joining, setMvp_group_emp_joining] = useState(null);
    const [mvp_emp, setMvp_emp] = useState(null);
    const [group_options, setGroup_options] = useState(null);
    const user_id = localStorage.getItem('userID');

    const [loading, setLoading] = React.useState(true); // Add loading state
    useEffect(() => {
        fetch(`${baseURL}/event/get_department_list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "userId": user_id,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("data: ", data)
                setGroup_options(data);
            })
            .catch((error) => { });
    }, []);


    useEffect(() => {
        fetch(`${baseURL}/event/query_total_stat_dashboard`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("data: ", data)
                setTotal_stat(data);
                setPie_join_emp_data(data.emp_joining_by_group);
                setCol_event_each_group_data(data.event_joining_by_group)
                setMvp_group_emp_joining(data.mvp_emp_joining_group);
                setMvp_emp(data.top_3_emp_data);
                setLoading(false);

            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    return (
        <div style={{ height: "100%", width: "100%", overflowY: "scroll", backgroundColor: 'rgba(255, 255, 255, 0)'}}>
            <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
                <Row style={{ height: "100%", width: "100%", marginBottom: "3vh", justifyContent: "space-between"}}>
                    <Col style={{ minHeight: "100%", minWidth:"48%" , backgroundColor: "#FFFFFF", borderRadius: "0.5vw", padding: "1%", textAlign:"center", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)"}}>
                        <EntitySelection options={group_options}></EntitySelection>
                    </Col>
                    <Col style={{ minHeight: "100%", minWidth:"48%" , backgroundColor: "#FFFFFF", borderRadius: "0.5vw", padding: "0.5%" , textAlign:"center", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)"}}>
                        <PeriodSelection></PeriodSelection>
                    </Col>
                </Row>
            </div>
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "0.5vw", padding: "2% 1%", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)", marginBottom: "2vh"}}>
                <Spin spinning={loading}>
                    <div style={{ display: "flex", justifyContent: "center"}}>
                        <Row style={{ justifyContent: "space-evenly", borderRadius: "1vw", width: "100%" }}>
                            <Col span={5} >
                                <StatCard title="Tổng sự kiện:" value={total_stat != null ? total_stat.total_event : "N/A"} unit="sự kiện" color="#e96767" prefix_icon={<TrophyOutlined style={{ marginRight: "0.6vw" }} />} />
                            </Col>
                            <Col span={5} >
                                <StatCard title="Tổng số nội dung:" value={total_stat != null ? total_stat.total_table : "N/A"} unit="nội dung" color="#e96767" prefix_icon={<EditOutlined style={{ marginRight: "0.6vw" }} />} />
                            </Col>
                            <Col span={5} >
                                <StatCard title="Số người tham gia:" value={total_stat != null ? total_stat.total_joining_employee : "N/A"} unit="người" color="#e96767" prefix_icon={<TeamOutlined style={{ marginRight: "0.6vw" }} />} />
                            </Col>
                            <Col span={5} >
                                <StatCard title="Tuổi trung bình:" value={total_stat != null ? total_stat.avg_age : "N/A"} unit="tuổi" color="#e96767" prefix_icon={<MehOutlined style={{ marginRight: "0.6vw" }} />} />
                            </Col>
                        </Row>
                    </div>
                    <Divider>HONOR BOARD</Divider>
                    <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "5vh", marginBottom: "5vh" }}>
                        <Row style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", width: "96.5%" }}>
                            <Col span={11}>
                                <HonorCard title={"Đơn vị có thành viên tham gia đông đảo nhất:"} honoree={mvp_group_emp_joining == null ? null : mvp_group_emp_joining["group_names"]} description={mvp_group_emp_joining == null ? null : mvp_group_emp_joining["values"]} unit=" lượt đăng ký"></HonorCard>
                            </Col>
                            <Col span={11}>
                                <HonorCard title={"Thành viên sôi nổi nhất:"} honoree={mvp_emp == null ? null : mvp_emp["emp_names"]} description={mvp_emp == null ? null : mvp_emp["values"]} unit=" Nội dung"></HonorCard>
                            </Col>
                        </Row>
                    </div>

                    <Divider>DETAIL CHARTS</Divider>

                    <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "5vh", marginBottom: "5vh" }}>
                        <Row style={{ display: "flex", justifyContent: "space-evenly", width: "96.5%" }}>
                            <Col span={11}>
                                <Card bordered={true} style={{ width: '100%', paddingLeft: "5%", height: "100%" }}>
                                    <PieJoiningEmp data={pie_join_emp_data}></PieJoiningEmp>
                                </Card>
                            </Col>
                            <Col span={11}>
                                <Card bordered={true} style={{ width: '100%', paddingLeft: "5%", height: "100%" }}>
                                    <ColumnEventParticipant data={col_event_each_group_data}></ColumnEventParticipant>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Spin>
            </div>
        </div>
    )
}

export default EventDashboard;
