import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { type } from '@testing-library/user-event/dist/type';
import { Space, Table, Tag, Button, Row, Col, Spin, Popconfirm } from 'antd';
import EventContent from './event_content';

const { Meta } = Card;
const baseURL = "https://sophisticated-incredible-ostrich.glitch.me/";

function CardList({ userId, event_state, onCardClick }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    console.log(typeof (userId))
    let cur_data = null
    fetch(`${baseURL}/WorkingApp/Event/EventData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "userId": String(userId),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (event_state == "Joined") {
          cur_data = data.accepted_events
        }
        else if (event_state == "Pendding") {
          cur_data = data.pending_events
        }
        else if (event_state == "Rejected") {
          cur_data = data.rejected_events
        }
        if (cur_data.event_name) {
          const newEvents = cur_data.event_name.map((title, index) => {
            return {
              title: title,
              description: cur_data.event_description[index],
              from_date: cur_data.event_start_date[index],
              to_date: cur_data.event_end_date[index],
              cover_img_link: cur_data.cover_img_link[index],
              event_state: event_state,
            };
          });
          setEvents(newEvents);
        } else {
          console.log("error")
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userId]);

  const handleInCardClick = (title) => {
    onCardClick(title);
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: "center" }}>
      {events.map(event => (
        <Card
          key={event.title}
          hoverable
          // cover={<img alt="example"
          // // src="https://bit.ly/3JlQRNM"
          // style={{height: '15vh'}}
          // />}

          cover={<img alt={event.title} src={event.cover_img_link} style={{ height: '15vh' }} />}
          style={{ margin: '1rem', backgroundColor: "#F0F0F0", height: "25vh", width: "80%" }}
          onClick={() => handleInCardClick(event)}

        >
          <Meta title={event.title}
            // description={event.description}
            src={event.cover_img_link} />
        </Card>
      ))}
    </div>
  );
};

function EventCardLayout({ userId, event_state }) {
  const [selectedEventData, setSelectedEventData] = useState(null);


  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading) {
      const timeoutId = setTimeout(() => setLoading(false), 200);
      return () => clearTimeout(timeoutId);
    }
  }, [loading]);


  const handleCardClick = (event_data) => {
    console.log("event_data: ", event_data)
    setLoading(true);
    setSelectedEventData(event_data);
  }
  return (
    <div >
      <Row justify="space-between" style={{ marginTop: '20px' }}>
        <Col span={4} style={{ border: "solid #A3D2CA", borderWidth: "0 1px 0 0", height: "74vh" }}>
          <CardList userId={userId} event_state={event_state} onCardClick={handleCardClick} />
        </Col>
        <Col span={20} style={{ height: "74vh", paddingLeft: "2%" }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: "100%" }}>
              <Spin size="large" />
            </div>
          ) : (
            <EventContent event_data={selectedEventData} />
          )}
        </Col>
      </Row>
    </div>
  )
}
export default EventCardLayout;