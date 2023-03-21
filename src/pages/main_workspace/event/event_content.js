import { Space, Table, Tag, Button, Row, Col, Divider, Popconfirm, message} from 'antd';
import { Comment } from '@ant-design/compatible';
import React from 'react';
import EventComment from './event_comment';

const confirm = () => {
    message.info('Added to Joined event list');
  };
const reject = () => {
    message.info('Added to Reject event list');
  };
const EventContent = ({ event_data }) => {
    console.log("event_data", event_data)

    // const handleYesClick = () => {
    //     axios.post('/api/yes', { event_data })
    //         .then(res => {
    //             setResponse(res.data);
    //         })
    //         .catch(err => {
    //             console.error(err);
    //         });
    // }

    // const handleNoClick = () => {
    //     axios.post('/api/no', { event_data })
    //         .then(res => {
    //             setResponse(res.data);
    //         })
    //         .catch(err => {
    //             console.error(err);
    //         });
    // }

    if (event_data == null) {
        return null
    }
    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Col span={15} style={{ height: "100%" }}>
                {event_data.event_state === 'Pendding' && (
                    <Row style={{ marginTop: '5px', height: "2vh" }}>
                        <Col span={4} style={{ marginLeft: "1vw", alignItems: "center", display: "flex" }}>
                            <Popconfirm
                                placement="topLeft"
                                title="Join?"
                                description= "Confirm joining event"
                                onConfirm={confirm}
                                okText="Join"
                                cancelText="Cancel"
                            >
                                <Button type="primary" size="medium" >Join</Button>
                            </Popconfirm>
                            <Popconfirm
                                placement="topLeft"
                                title="Reject?"
                                description= "Confirm joining event"
                                onConfirm={reject}
                                okText="Reject"
                                cancelText="Cancel"
                                okButtonProps={{ style: { backgroundColor: "#f50", color: "#fff" } }}
                            >
                            <Button type="dashed" size="medium" style={{ marginLeft: "10px", color: "#f50" }} danger>Reject</Button>
                            </Popconfirm>
                        </Col>
                    </Row>
                )}
                <Row style={{ marginTop: '20px', height: "7vh", width: "50vw", alignItems: "center", display: "flex" }}>
                    <h1 style={{ margin: "0 1vw", fontSize: "5vh", fontStyle: "" }}>{event_data.title}</h1>
                </Row>
                <Row style={{ marginTop: '20px', height: "4vh", marginLeft: "1vw" }}>
                    <Col span={4} style={{ borderBottom: "1px", alignItems: "center", display: "flex" }}>
                        <Tag color="#A3D2CA" style={{ fontSize: "2vh" }}>From: {event_data.from_date}</Tag>
                    </Col>
                    <Col span={4} style={{ marginLeft: "2vw", alignItems: "center", display: "flex" }}>
                        <Tag color="#f50" style={{ fontSize: "2vh" }}>To: {event_data.to_date}</Tag>
                    </Col>


                </Row>
                <Divider orientation="left">Event Description</Divider>
                <Row style={{ marginTop: '20px', height: "15vh" }}>
                    <div style={{ fontSize: 18, color: "#4D4D4D", marginLeft: "2vw" }}>
                        {event_data.description}
                    </div>
                </Row>
                <Divider orientation="left">Announcement</Divider>
                <Row style={{ marginTop: '20px' }}>
                    <Col span={12}>
                        <div>
                            Anoucement
                        </div>
                    </Col>
                    {/* <Col span={12}>

                    </Col> */}
                </Row>
            </Col>
            <Col span={8} style={{}}>
                <Divider orientation="left">Comments</Divider>
                <div>
                    <EventComment></EventComment>
                </div>
            </Col>
        </div>
    );
};
export default EventContent;