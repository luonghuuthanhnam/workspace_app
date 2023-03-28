import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { type } from '@testing-library/user-event/dist/type';
import { Space, Table, Tag, Button, Row, Col, Spin, Popconfirm } from 'antd';
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
        <>
            <Spin spinning={loading}>


                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: "center" }}>
                    {events.map(event => (
                        <Card
                            key={event.title}
                            hoverable
                            // cover={<img alt={event.title} src={event.cover_img_link} style={{ height: '15vh' }} />}
                            style={{ margin: '1rem', backgroundColor: "#A3D2CA", minHeight: "10vh", width: "80%" }}
                            onClick={() => handleInCardClick(event)}
                        >
                            <Meta
                                title={<div style={{ flex: '1 0 auto' }}>{event.title}</div>}
                                description={<div style={{ flex: '1', flexGrow: 1 }}>{event.from_date + " → " + event.to_date}</div>}
                                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                            // src={event.cover_img_link} 
                            />
                        </Card>
                    ))}

                </div>
            </Spin>
        </>
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
        console.log("event_data ne: ", event_data)
        setLoading(true);
        setSelectedEventData(event_data);
    }
    return (
        <div >
            <Row justify="space-between" style={{ marginTop: '20px' }}>
                <Col span={4} style={{ border: "solid #A3D2CA", borderWidth: "0 1px 0 0", height: "74vh" }}>
                    <CardList userId={userId} event_state={event_state} onCardClick={handleCardClick} />
                </Col>
                <Col span={20} style={{ minHeight: "74vh", paddingLeft: "2%" }}>
                    {loading ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: "100%" }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        console.log("selectedEventData", selectedEventData),
                        <EventContent event_data={selectedEventData} />
                    )}
                </Col>
            </Row>
        </div>
    )
}
export default EventCardLayoutV2;