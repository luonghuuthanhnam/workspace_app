import React, { useState, useEffect } from 'react';
import { Input, DatePicker, Button, Form, Table, Row, Col, Modal, message, Popconfirm } from 'antd';
import axios from 'axios';
import { baseURL } from '../../../../config';
const { RangePicker } = DatePicker;
// const baseURL = "http://localhost:8000";
// const baseURL = "https://sophisticated-incredible-ostrich.glitch.me/";
// const baseURL = localStorage.getItem('backed_baseURL');

const CreateEvent = ({ user_id, onCreateEventSuccess }) => {
    const [eventTitle, setEventTitle] = useState('');
    const [eventDates, setEventDates] = useState([]);
    const [tableColumns, setTableColumns] = useState([]);
    const [eventDescription, setEventDescription] = useState('');
    const [tableNames, setTableNames] = useState([]);
    const [tables, setTables] = useState([]);
    const [editingTableIndex, setEditingTableIndex] = useState(-1);
    const [editingTableColumns, setEditingTableColumns] = useState([]);
    const [tableName, setTableName] = useState('');
    const [editedTableName, setEditedTableName] = useState(tableNames[editingTableIndex]);
    const [createEventSuccess, setCreateEventSuccess] = useState(false); // new state variable


    const handleTitleChange = (event) => {
        setEventTitle(event.target.value);
    };

    const handleDatesChange = (dates) => {
        setEventDates(dates);
    };

    const handleDescriptionChange = (event) => {
        setEventDescription(event.target.value);
    };

    const handleSaveV2 = () => {

        const tablesData = [];
        console.log("user_id", user_id)
        tables.forEach((table, index) => {
            tablesData.push({
                name: tableNames[index],
                data: table.data,
            });
        });

        const eventData = {
            title: eventTitle,
            dates: eventDates,
            description: eventDescription,
            tables_data: tablesData,
        };
        console.log("eventData", eventData)
        fetch(`${baseURL}/event/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "event_data": eventData,
                "user_id": user_id,
            }),
        })
            .then((response) => {
                return response.json(); // Return the promise
            })
            .then((data) => {
                console.log(data);
                if (data.message === "Create event success") { // Check the message property
                    message.success('Event created successfully');
                    setCreateEventSuccess(true); // set createEventSuccess state variable to true on success
                }
                else {
                    message.error('Unable to create event');
                }
            })
            .catch((error) => {
                console.error(error);  // Handle error
                message.error('Unable to create event');
            });
    };

    const handleTableColumnsChange = (event) => {
        const columns = event.target.value.split(/\s*,\s*/).map((column, index) => ({
            title: column,
            dataIndex: `column${index}`,
            key: `column${index}`,
        }));
        const columnTitles = columns.map((column) => column.title);
        if (new Set(columnTitles).size !== columnTitles.length) {
            // If there are duplicates
            Modal.error({
                title: 'Error',
                content: 'Table columns cannot be duplicated',
            });
        } else {
            setTableColumns(columns);
        }
    };

    const handleCreateTable = () => {
        const columns = tableColumns.map((column) => ({ ...column, dataIndex: column.title }));
        const initialData = [{ key: '0', ...Object.fromEntries(columns.map((column) => [column.dataIndex, '...'])) }];
        const newTable = { columns, data: initialData };
        const newTables = [...tables, newTable];
        setTables(newTables);

        const newTableNames = [...tableNames, tableName];
        setTableNames(newTableNames);

        setTableColumns([]);
        setTableName('');
    };
    const handleEditTable = (index, tableName) => {
        setEditingTableIndex(index);
        setEditingTableColumns([...tables[index].columns]);
        setEditedTableName(tableName);
    };

    const handleDeleteTable = (index) => {
        const newTables = [...tables];
        newTables.splice(index, 1);
        setTables(newTables);

        const newTableNames = [...tableNames];
        newTableNames.splice(index, 1);
        setTableNames(newTableNames);
    };

    const handleSaveTable = () => {
        const newTables = [...tables];
        newTables[editingTableIndex].columns = editingTableColumns;
        setTables(newTables);

        const newTableNames = [...tableNames];
        newTableNames[editingTableIndex] = editedTableName;
        setTableNames(newTableNames);

        setEditingTableIndex(-1);
        setEditingTableColumns([]);
    };
    const handleAddColumn = () => {
        setEditingTableColumns([...editingTableColumns, {
            title: '',
            dataIndex: `column${editingTableColumns.length}`,
            key: `column${editingTableColumns.length}`,
        }]);
    };

    const handleRemoveColumn = (index) => {
        const newColumns = [...editingTableColumns];
        newColumns.splice(index, 1);
        setEditingTableColumns(newColumns);
    };


    const handleSave = () => {
        console.log("Tables Data:");
        tables.forEach((table, index) => {
            console.log(`${tableNames[index]}`);
            console.table(table.data);
        });
    };

    const confirm_save = () => {
        // message.info('Saved new event');
        handleSaveV2()
    };

    useEffect(() => {
        if (createEventSuccess) {
            setEventTitle('');
            setEventDates([]);
            setTableColumns([]);
            setEventDescription('');
            setTableNames([]);
            setTables([]);
            setEditingTableIndex(-1);
            setEditingTableColumns([]);
            setTableName('');
            setEditedTableName(tableNames[editingTableIndex]);
            setCreateEventSuccess(false);
            onCreateEventSuccess();
            // history.push('/main-workspace'); // redirect to main workspace on success
        }
    }, [createEventSuccess]);

    return (
        <div style={{ display: "flex", marginLeft: "2vw" }}>
            <Col span={8}>
                {/* <h1>Create Event</h1> */}
                <Form layout="vertical">
                    <Form.Item label="Event Title">
                        <Input value={eventTitle} onChange={handleTitleChange} />
                    </Form.Item>
                    <Form.Item label="Event Dates">
                        <RangePicker value={eventDates} onChange={handleDatesChange} />
                    </Form.Item>
                    <Form.Item label="Event Description">
                        <Input.TextArea value={eventDescription} onChange={handleDescriptionChange} />
                    </Form.Item>
                    <Form.Item label="Table Name">
                        <Input value={tableName} onChange={(event) => setTableName(event.target.value)} />
                    </Form.Item>
                    <Form.Item label="Table Columns">
                        <Input value={tableColumns.map((column) => column.title).join(', ')} onChange={handleTableColumnsChange} />
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={handleCreateTable} disabled={!tableName}>Create Table</Button>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 20, span: 8 }}>
                        <Popconfirm
                            placement="topLeft"
                            title="Save?"
                            description="Confirm to save new event"
                            onConfirm={confirm_save}
                            okText="Save"
                            cancelText="Cancel"
                        >
                            <Button type='primary' disabled={
                                !eventTitle ||
                                eventDates.length === 0 ||
                                // !eventDescription ||
                                tables.length === 0
                            }>
                                Save
                            </Button>
                        </Popconfirm>
                    </Form.Item>
                </Form>
            </Col>

            <Col span={14} style={{ marginLeft: "2vw" }}>

                <Row gutter={[16, 16]}>
                    {tables.map((table, index) => (
                        <Col style={{ width: "100%" }} key={index}>
                            <h2>{tableNames[index]}</h2>
                            <Button onClick={() => handleEditTable(index, tableNames[index])}>Edit</Button>
                            <Button onClick={() => handleDeleteTable(index)}>Delete</Button>
                            <Table dataSource={table.data} columns={table.columns} />
                            {editingTableIndex === index && (
                                <Modal title={`Edit Table - ${editedTableName}`} open={true} onOk={handleSaveTable} onCancel={() => setEditingTableIndex(-1)}>
                                    <Form.Item label="Table Name">
                                        <Input value={editedTableName} onChange={(event) => setEditedTableName(event.target.value)} />
                                    </Form.Item>
                                    {editingTableColumns.map((column, index) => (
                                        <div key={index}>
                                            <Input value={column.title} onChange={(event) => {
                                                const newColumns = [...editingTableColumns];
                                                newColumns[index] = { ...newColumns[index], title: event.target.value };
                                                setEditingTableColumns(newColumns);
                                            }} />
                                            <Button onClick={() => handleRemoveColumn(index)}>Remove</Button>
                                        </div>
                                    ))}
                                    <Button onClick={handleAddColumn}>Add Column</Button>
                                </Modal>
                            )}
                        </Col>
                    ))}
                </Row>

            </Col>


        </div>
    );
};
export default CreateEvent;


