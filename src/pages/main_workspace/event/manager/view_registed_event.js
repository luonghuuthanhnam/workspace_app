import React, { useState, useEffect } from 'react';
import { Select, Table } from 'antd';
import axios from 'axios';
import { baseURL } from '../../../../config';

const { Option } = Select;

const ViewRegistedEvent = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventData, setEventData] = useState([]);
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);

    useEffect(() => {
        // Fetch list of registered events from API
        fetch(`${baseURL}/event/query`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setEvents(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const handleEventSelect = (value) => {
        setSelectedEvent(value);
        const event_ids = events.event_id;
        const index = Object.keys(event_ids).indexOf(Object.keys(event_ids).find(key => event_ids[key] === value));
        const eventData = events.event_data[index];
        let tables_data = "";
        if (typeof events.event_data[index] === 'string') {
            tables_data = JSON.parse(eventData.replace(/'/g, '"')).tables_data;
        }
        else {
            tables_data = eventData.tables_data;
        }
        let list_tables = [];
        for (let i = 0; i < tables_data.length; i++) {
            let tb_name = tables_data[i].name;
            let tb_id = tables_data[i].table_id;
            list_tables.push({ id: tb_id, name: tb_name });
        }
        console.log("list tables", list_tables)
        setTables(list_tables);
        setSelectedTable(list_tables[0].id); // set the first table in the tables array as the default selected table
    };


    const handleTableSelect = (value) => {
        setSelectedTable(value);
        console.log("selectedTable: ", value)
    };

    const columns = [
        {
            title: 'Column 1',
            dataIndex: 'column1',
            key: 'column1',
        },
        {
            title: 'Column 2',
            dataIndex: 'column2',
            key: 'column2',
        },
        // Add more columns as needed
    ];

    let eventOptions = [];

    if (events && events.event_id && events.event_title) {
        console.log("events", events);
        eventOptions = Object.keys(events.event_id).map(key => ({
            value: events.event_id[key],
            label: events.event_title[key]
        }));
    }

    return (
        <div>
            <Select
                placeholder="Select an event"
                onChange={handleEventSelect}
                style={{ width: 200 }}
            >
                {eventOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
            </Select>
            <Select
                placeholder="Select a table"
                onChange={handleTableSelect}
                style={{ width: 200 }}
                disabled={!selectedEvent} // disable the table selection until an event is selected
                value={selectedTable} // set the value of the selected table
            >
                {tables.length > 0 && tables.map(table => (
                    <Option key={table.id} value={table.id}>{table.name}</Option>
                ))}
            </Select>

            {selectedEvent && selectedTable && (
                <Table
                    dataSource={eventData}
                    columns={columns}
                    pagination={false}
                />
            )}
        </div>
    );
};

export default ViewRegistedEvent;