import React, { useState, useEffect } from 'react';
import { Input, DatePicker, Button, Form, Table, Row, Col, Modal, message, Popconfirm, Affix } from 'antd';
import { baseURL } from '../../../../config';
import { v4 as uuidv4 } from 'uuid';
import TagColumn from './tags_table_columns';
const { RangePicker } = DatePicker;

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
                table_id: table.id
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

    const handleCreateTable = () => {
        const columns = tableColumns.map((column) => ({ ...column, dataIndex: column.title }));
        const initialData = [{ key: '0', ...Object.fromEntries(columns.map((column) => [column.dataIndex, '...'])) }];
        const newTable = { id: uuidv4(), columns, data: initialData }; // add id property with UUID
        const newTables = [...tables, newTable];
        setTables(newTables);

        const newTableNames = [...tableNames, tableName];
        setTableNames(newTableNames);

        // setTableColumns([]);
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


    const confirm_save = () => {
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
    const [previousTags, setPreviousTags] = useState([]);

    const handleTagsChange = (tags) => {
    if (JSON.stringify(tags) !== JSON.stringify(previousTags)) {
        console.log("tags", tags)
        const columns = tags.map((column, index) => ({
            title: column,
            dataIndex: `column${index}`,
            key: `column${index}`,
        }));
        setTableColumns(columns);
        setPreviousTags(tags);
    }
    }
    // const handleTagsChange = (tags) => {
    //     console.log("tags", tags)
        // const columns = tags.map((column, index) => ({
        //     title: column,
        //     dataIndex: `column${index}`,
        //     key: `column${index}`,
        // }));
        // setTableColumns(columns);
    // }
    const [container, setContainer] = useState(null);
    return (
        <div style={{ display: "flex", marginLeft: "2vw", height: "100%" ,overflowY: "scroll",  marginBottom: "1vh"}} ref={setContainer}>
            <Col span={8}>
                <Affix target={() => container}>
                <section style={{ width: "100%", borderStyle: "solid", padding: "5%", borderColor: "#E3E3E3", borderWidth: "1px", borderRadius: "1vw", marginBottom: "1vh"}}>

                {/* <h1>Create Event</h1> */}
                <Form layout="vertical">
                    <Form.Item label="Event Title" style={{ width: "100%" }}>
                        <Input value={eventTitle} onChange={handleTitleChange} />
                    </Form.Item>
                    <Form.Item label="Event Dates" style={{ width: "100%" }}>
                        <RangePicker value={eventDates} onChange={handleDatesChange} />
                    </Form.Item>
                    <Form.Item label="Event Description">
                        <Input.TextArea value={eventDescription} onChange={handleDescriptionChange} style={{ height: "15vh" }} />
                    </Form.Item>
                    <Form.Item label="Table Name">
                        <Input value={tableName} onChange={(event) => setTableName(event.target.value)} />
                    </Form.Item>
                    <Form.Item label="Table Columns">
                        <TagColumn onTagsChange={handleTagsChange} />
                    </Form.Item>
                    <Form.Item>
                        <div style={{display:"flex",justifyContent: "space-between"}}>

                        <Button onClick={handleCreateTable} disabled={!tableName}>Create Table</Button>
                       
                    {/* </Form.Item>
                    <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}> */}
                        <Popconfirm
                            disabled={
                                !eventTitle ||
                                eventDates.length === 0 ||
                                // !eventDescription ||
                                tables.length === 0
                            }
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
                            } style={{ width: "7vw" }}>
                                Done
                            </Button>
                        </Popconfirm>
                        </div>
                    </Form.Item>
                </Form>
            </section>
            </Affix>
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


