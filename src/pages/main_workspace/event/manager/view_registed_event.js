import React, { useState, useEffect, useRef } from 'react';
import { Select, Table, Divider, Input, Affix, Button, message, Popconfirm } from 'antd';
import { ArrowRightOutlined, DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { baseURL } from '../../../../config';
import * as XLSX from 'xlsx';

const { Option } = Select;

const ViewRegistedEvent = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventData, setEventData] = useState([]);
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [tableColumns, setTableColumns] = useState([]);
    const [searchQuery, setSearchQuery] = useState(eventData);
    const [searchText, setSearchText] = useState("");
    const [groupNames, setGroupNames] = useState([]);

    useEffect(() => {
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
        setSearchText("Tất cả");
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
        setSelectedTable(list_tables[0].id);
        fetchTableData(list_tables[0].id);
    };
    const handleSearch = (value) => {
        setSearchQuery(value);
        setSearchText(value);
        if (value === "" || value === "Tất cả") {
          setSearchQuery(eventData);
        } else {
          value = value.replace(/^\s+/, '').toLowerCase();
          setSearchText(value);
          const filteredData = eventData.filter(table =>
            table.group_name.trim().toLowerCase().includes(value)
          );
          setSearchQuery(filteredData);
        }
      };


      const fetchTableData = async (tableId) => {
        try {
          console.log("tableId:", tableId);
          const response = await axios.post(`${baseURL}/event/query_registed_table_by_manager`, {
            table_id: tableId,
          });
          console.log("table_data:", response.data);
          const tableData = response.data;
          if (tableData === null) {
            setTableColumns([]);
            setEventData([]);
            setSearchQuery([]);
            return;
          }
          const groupNames = [...new Set(tableData.map((data) => data.group_name))];
          groupNames.unshift("Tất cả");
          setGroupNames(groupNames);
          console.log("groupNames", groupNames);
          const groupValues = [...new Set(tableData.map((data) => data.group_name))];
          const newColumns = Object.keys(tableData[0]).map((key) => ({
            title: key === "group_name" ? "Đơn Vị" : key,
            dataIndex: key,
            key,
            sorter:
              key === "Tên"
                ? (a, b) => {
                    const aLastName = a[key].split(" ").pop();
                    const bLastName = b[key].split(" ").pop();
                    return aLastName.localeCompare(bLastName);
                  }
                : undefined,
          }));
          setTableColumns(newColumns);
          setEventData(tableData === null ? [] : tableData); // Update setEventData to set empty data if tableData is null
          setSearchQuery(tableData);
        } catch (error) {
          console.error(error);
        }
      };

    const handleTableSelect = (value) => {
        setSelectedTable(value);
        // setSearchText("");
        setSearchText("Tất cả");
        if (selectedEvent) {
            fetchTableData(value);
        }
    };

    let eventOptions = [];

    if (events && events.event_id && events.event_title) {
        console.log("events", events);
        eventOptions = Object.keys(events.event_id).map(key => ({
            value: events.event_id[key],
            label: events.event_title[key]
        }));
    }

    const handleExport = () => {
        // Convert data to worksheet
        const worksheet = XLSX.utils.json_to_sheet(searchQuery);

        // Create a new workbook and add the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Generate a download link for the Excel file
        const file = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
        const blob = new Blob([s2ab(file)], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);

        // Download the Excel file
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.xlsx';
        link.click();
    };

    // Utility function to convert a string to an ArrayBuffer
    const s2ab = (s) => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xff;
        }
        return buf;
    };
    const [container, setContainer] = useState(null);
    return (
        <div style={{height: "100%", overflowY:"scroll"}} ref={setContainer}>
            <Select
                placeholder="Select an event"
                onChange={handleEventSelect}
                style={{ width: 200 }}
            >
                {eventOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
            </Select>
            <ArrowRightOutlined style={{ marginLeft: "10px", marginRight: "10px" }} />
            <Select
                placeholder="Select a table"
                onChange={handleTableSelect}
                style={{ width: 200 }}
                disabled={!selectedEvent}
                value={selectedTable}
            >
                {tables.length > 0 && tables.map(table => (
                    <Option key={table.id} value={table.id}>{table.name}</Option>
                ))}
            </Select>
            <Divider orientation='left'>Table Data</Divider>

            {selectedEvent && selectedTable && (
                <>
                    {/* <Affix offsetTop={"13vh"}> */}
                    <Affix target={() => container}>
                        <Select
                            placeholder="Select Department"
                            onChange={(value) => handleSearch(value)}
                            style={{ width: 200 }}
                            value={searchText}
                        >
                            {groupNames.map(option => (
                                <Option key={option} value={option}>{option}</Option>
                            ))}
                        </Select>
                        <Popconfirm placement="topRight"
                            title="Save?"
                            description="Save as Excel file?"
                            onConfirm={handleExport}
                            okText="Save"
                            cancelText="Cancel">
                            <Button type="primary" icon={<DownloadOutlined />} style={{ marginLeft: "10px" }}>Save</Button>
                        </Popconfirm>
                    </Affix>
                </>
            )}
            <Table
                dataSource={searchQuery}
                columns={tableColumns}
                pagination={{ pageSize: 15 }}
                style={{ marginTop: "1vh" }}
            />
        </div>
    );
};

export default ViewRegistedEvent;