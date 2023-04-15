import { Space, Table, Tag, Button, Row, Col, Divider, Popconfirm, message } from 'antd';
import { Comment } from '@ant-design/compatible';
import React from 'react';
import EventComment from './event_comment';
import EventDataTable from './table_rendering';
const confirm = () => {
    message.info('Added to Joined event list');
};
const reject = () => {
    message.info('Added to Reject event list');
};
const EventContent = ({ event_data }) => {
    console.log("EventContent_data", event_data)

    if (event_data == null) {
        return null
    }
    return (
        <div style={{ display: "flex", justifyContent: "space-between", maxHeight:"100%", overflowY:"scroll"}}>
            <Col
                // span={15} 
                style={{ minHeight: "100%", width: "100%"}}>
                <Row style={{ marginTop: '20px', height: "7vh", width: "50vw", alignItems: "center", display: "flex" }}>
                    <h1 style={{ margin: "0 1vw", fontSize: "5vh", fontStyle: "" }}>{event_data.title}</h1>
                </Row>
                <Row style={{ marginTop: '20px', height: "4vh", marginLeft: "1vw" }}>
                    <Col span={4} style={{ borderBottom: "1px", alignItems: "center", display: "flex" }}>
                        <Tag color="#A3D2CA" style={{padding:"5px 10px", fontSize: "2vh" }}>From: {event_data.from_date}</Tag>
                    </Col>
                    <Col span={4} style={{marginLeft: "2vw", alignItems: "center", display: "flex" }}>
                        <Tag color="#E96767" style={{padding:"5px 10px", fontSize: "2vh" }}>To: {event_data.to_date}</Tag>
                    </Col>
                </Row>
                <Row style={{ marginTop: '20px', height: "15vh" }}>
                    <Divider orientation="left">Event Description</Divider>
                    <div style={{ fontSize: 18, color: "#4D4D4D", marginLeft: "2vw" }}>
                        {event_data.description}
                    </div>
                </Row>
                <Divider orientation="left">Tables</Divider>
                <Row>
                    <div style={{ width: "100%", marginLeft: "1vw" }}>
                        <EventDataTable event_data={event_data}></EventDataTable>
                    </div>
                </Row>
            </Col>
        </div>
    );
};
export default EventContent;