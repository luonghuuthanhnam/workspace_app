import React, { useState, useEffect, useRef } from 'react';
import { Select, Card, Divider, Input, Affix, Button, message, Popconfirm, Row, Col, Statistic } from 'antd';
import { ArrowRightOutlined, DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import StatCard from '../../../../components/statistic_card';
import HonorCard from '../../../../components/honor_card';
import { baseURL } from '../../../../config';
import { TrophyOutlined, EditOutlined, TeamOutlined, MehOutlined } from '@ant-design/icons';
import PieJoiningEmp from './charts/pie_join_emp';
import ColumnEventParticipant from './charts/bar_event_participant';

const EventDashboard = () => {
    const [total_stat, setTotal_stat] = useState(null);

    useEffect(() => {
        fetch(`${baseURL}/event/query_total_stat_dashboard`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setTotal_stat(data);
                console.log("datadata: ", data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div style={{height: "100%", overflowY:"scroll"}}>
            <Row>
                HELLO
            </Row>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Row style={{ padding: "1%", justifyContent: "space-evenly", borderRadius: "1vw", width: "100%" }}>
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
            <div style={{width: "100%", display:"flex", justifyContent:"center", alignItems: "center", marginTop: "5vh", marginBottom: "5vh"}}>
                <Row style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", width: "96.5%" }}>
                    <Col span={11}>
                        <HonorCard title={"Đơn vị có thành viên tham gia đông đảo nhất:"} honoree={"Đơn vị 2"} description={"43 người"}></HonorCard>
                    </Col>
                    <Col span={11}>
                        <HonorCard title={"Đơn vị tham gia đẩy đủ nội dung nhất:"} honoree={"Đơn vị 1"} description={"4 nội dung"}></HonorCard>
                    </Col>
                </Row>
            </div>

            <Divider>DETAIL CHARTS</Divider>

            <div style={{width: "100%", display:"flex", justifyContent:"center", alignItems: "center", marginTop: "5vh", marginBottom: "5vh"}}>
                <Row style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", width: "96.5%" }}>
                    <Col span={11}>
                    <Card bordered={true} style={{ width: '100%', paddingLeft: "5%"}}>
                        <PieJoiningEmp></PieJoiningEmp>
                    </Card>
                    </Col>
                    <Col span={11}>
                    <Card bordered={true} style={{ width: '100%', paddingLeft: "5%"}}>
                        <ColumnEventParticipant></ColumnEventParticipant>
                    </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default EventDashboard;
