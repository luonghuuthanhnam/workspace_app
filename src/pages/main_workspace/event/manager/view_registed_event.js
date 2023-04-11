import React, { useState, useEffect } from 'react';
import { Select, Table, Divider, Input } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import axios from 'axios';
import { baseURL } from '../../../../config';

const { Option } = Select;

const ViewRegistedEvent = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventData, setEventData] = useState([]);
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [tableColumns, setTableColumns] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    // const [statusFilter, setStatusFilter] = useState("");

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
        fetchTableData(list_tables[0].id);
    };

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        console.log("value", value)
        console.log("value tables", eventData)
        
        const filteredData = eventData.filter(table =>
            table.group_id.toLowerCase().includes(value)
        );
        console.log("filteredData", filteredData)
        setSearchQuery(value);
    
        // Check if search query is empty and reset eventData state to original value
        if (value === "") {
            fetchTableData(selectedTable);
        } else {
            setEventData(filteredData);
        }
    };

    
    const fetchTableData = async (tableId) => {
        try {
            console.log("tableId:", tableId);
            const response = await axios.post(`${baseURL}/event/query_registed_table_by_manager`, {
                table_id: tableId,
            });
            // Process the response data as needed
            console.log("table_data:", response.data);
            const tableData = response.data;
            const newColumns = Object.keys(tableData[0]).map(key => ({
                title: key,
                dataIndex: key,
                key,
            }));
            setTableColumns(newColumns);
            setEventData(tableData);
        } catch (error) {
            console.error(error);
        }
    };

    const handleTableSelect = (value) => {
        setSelectedTable(value);
        console.log("selectedTable: ", value);
        if (selectedEvent) {
            console.log("selectedEvent: ", selectedEvent)
            fetchTableData(value);
        }
    };

    // const columns = [
    //     {
    //         title: 'Column 1',
    //         dataIndex: 'column1',
    //         key: 'column1',
    //     },
    //     {
    //         title: 'Column 2',
    //         dataIndex: 'column2',
    //         key: 'column2',
    //     },

    // ];

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
            <ArrowRightOutlined style={{marginLeft: "10px", marginRight: "10px"}}/>
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
            <Divider orientation='left'>Table Data</Divider>
            <Input.Search
                            placeholder="Search by group id"
                            style={{ width: 300, marginLeft: "10px" }}
                            onChange={handleSearch}
                        />

            {selectedEvent && selectedTable && (
                <Table
                    dataSource={eventData}
                    columns={tableColumns}
                    pagination={false}
                    style={{ marginTop: "1vh" }}
                />
            )}
        </div>
    );
};

export default ViewRegistedEvent;