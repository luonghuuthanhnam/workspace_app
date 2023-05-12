import React, { useState, useEffect } from 'react';
import { Card, Empty } from 'antd';
import { type } from '@testing-library/user-event/dist/type';
import { Affix, Table, Tag, Button, Row, Col, Spin, Popconfirm, Popover } from 'antd';
import EventContent from '../event_content';
import { json } from 'react-router-dom';
import { baseURL } from '../../../../config';
const { Meta } = Card;

function CardList({ userId, event_state, onCardClick }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = React.useState(false); // Add loading state

    useEffect(() => {
        setLoading(true);
        console.log(typeof (userId))
        let cur_data = null
        fetch(`${baseURL}/event/query`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.event_id) {
                    const eventIds = Object.values(data.event_id);  // Convert object to array
                    const newEvents = eventIds.map((event_id, index) => {
                        let e_data = data.event_data[index]
                        if (typeof e_data === 'string') {
                            e_data = JSON.parse(e_data.replace(/'/g, '"'));
                        }
                        return {
                            id: event_id,
                            title: data.event_title[index], // Use event_id as key to get title
                            created_at: data.created_at[index], // Use event_id as key to get created_at
                            created_by: data.created_by[index], // Use event_id as key to get created_by
                            from_date: e_data.dates[0].split("T")[0], // Access dates property
                            to_date: e_data.dates[1].split("T")[0], // Access dates property
                            description: e_data.description || '', // Use e_data.description if it exists, or empty string otherwise
                            tables: e_data.tables_data || [], // Use e_data.tables_data if it exists, or empty array otherwise
                        };
                    });
                    setEvents(newEvents);
                } else {
                    console.log("error")
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [userId]);

    const handleInCardClick = (event_data) => {
        onCardClick(event_data);
    }
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: "center", height: "100%", width: "100%" }}>
            <Spin spinning={loading} style={{ width: "100%", height: "100%" }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: "center", height: "100%", width: "100%" }}>
                    {events.map(event => (
                        <Popover content={event.description} title={event.title} placement="right">
                            <Card
                                key={event.title}
                                hoverable
                                style={{ margin: '1rem', backgroundColor: 'rgba(163, 210, 202, 0.3)', minHeight: "10vh", width: "12vw" }}
                                onClick={() => handleInCardClick(event)}
                            >
                                <Meta
                                    title={<div style={{ flex: '1 0 auto' }}>{event.title}</div>}
                                    description={<div style={{ flex: '1', flexGrow: 1 }}>{event.from_date + " → " + event.to_date}</div>}
                                    style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                                />
                            </Card>
                        </Popover>
                    ))}
                </div>
            </Spin>
        </div>
    );
};

function EventCardLayoutV2({ userId, event_state }) {
    const [selectedEventData, setSelectedEventData] = useState(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (loading) {
            const timeoutId = setTimeout(() => setLoading(false), 200);
            return () => clearTimeout(timeoutId);
        }
    }, [loading]);

    const handleCardClick = (event_data) => {
        setLoading(true);
        setSelectedEventData(event_data);
    }
    const [container, setContainer] = useState(null);
    return (
        <div ref={setContainer} style={{ height: "100%" }}>
            <Row justify="space-between" style={{ marginTop: '20px', height: "100%" }}>
                <Col style={{ height: "100%", width: "20%", backgroundColor: "#FFFFFF", borderRadius: "0.5vw", padding: "1%", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)" }}>
                    <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
                        <CardList userId={userId} event_state={event_state} onCardClick={handleCardClick} />
                    </div>
                </Col>
                <Col style={{ height: "100%", paddingLeft: "1%", width: "78%", backgroundColor: "#FFFFFF", borderRadius: "1%", padding: "1%", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)" }}>
                    {loading ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: "100%" }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        selectedEventData === null ?
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: "100%" }}>
                                <Empty description={<>Chọn sự kiện</>} />
                            </div>
                            : (
                                <>
                                    {console.log("selectedEventData", selectedEventData)}
                                    <EventContent event_data={selectedEventData} />
                                </>
                            )
                    )}
                </Col>
            </Row>
        </div>
    )
}
export default EventCardLayoutV2;