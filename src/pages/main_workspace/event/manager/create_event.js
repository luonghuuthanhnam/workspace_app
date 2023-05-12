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
    const [container, setContainer] = useState(null);
    return (
        <div style={{ display: "flex", height: "100%",  marginBottom: "1vh", width: "100%"}} ref={setContainer}>
            <Col style={{ height: "100%", width:"30%",backgroundColor:"#FFFFFF", borderRadius:"1vw", padding:"1%", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)"}}>
                <section style={{ width: "100%", height:"100%", borderStyle: "solid", padding: "5%", borderColor: "#E3E3E3", borderWidth: "1px", borderRadius: "1vw", marginBottom: "1vh",overflowY: "auto"}}>
                <Form layout="vertical" style={{height:"100%"}}>
                    <Form.Item label="Tiêu đề" style={{ width: "100%"}}>
                        <Input value={eventTitle} onChange={handleTitleChange} />
                    </Form.Item>
                    <Form.Item label="Thời gian diễn ra" style={{ width: "100%" }}>
                        <RangePicker value={eventDates} onChange={handleDatesChange} />
                    </Form.Item>
                    <Form.Item label="Event Description">
                        <Input.TextArea value={eventDescription} onChange={handleDescriptionChange} style={{ height: "15vh" }} />
                    </Form.Item>
                    <Form.Item label="Tên bảng">
                        <Input value={tableName} onChange={(event) => setTableName(event.target.value)} />
                    </Form.Item>
                    <Form.Item label="Cột">
                        <TagColumn onTagsChange={handleTagsChange} />
                    </Form.Item>
                    <Form.Item>
                        <div style={{display:"flex",justifyContent: "space-between"}}>

                        <Button onClick={handleCreateTable} disabled={!tableName}>Tạo Bảng</Button>
                       
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
                            title="Lưu?"
                            description="Xác nhận lưu"
                            onConfirm={confirm_save}
                            okText="Lưu"
                            cancelText="Hủy"
                            >
                            <Button type='primary' disabled={
                                !eventTitle ||
                                eventDates.length === 0 ||
                                // !eventDescription ||
                                tables.length === 0
                            } style={{ width: "7vw" }}>
                                Hoàn Thành
                            </Button>
                        </Popconfirm>
                        </div>
                    </Form.Item>
                </Form>
            </section>
            {/* </Affix> */}
            </Col>

            <Col style={{ marginLeft: "1vw", width: "73%", backgroundColor:"#FFFFFF", borderRadius:"1vw", padding:"1%", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)"}}>
                <Row gutter={[16, 16]}>
                    {tables.map((table, index) => (
                        <Col style={{ width: "100%" }} key={index}>
                            <h2>{tableNames[index]}</h2>
                            <Button onClick={() => handleEditTable(index, tableNames[index])}>Sửa</Button>
                            <Button onClick={() => handleDeleteTable(index)}>Xóa</Button>
                            <Table dataSource={table.data} columns={table.columns} />
                            {editingTableIndex === index && (
                                <Modal title={`Sửa bảng - ${editedTableName}`} open={true} onOk={handleSaveTable} onCancel={() => setEditingTableIndex(-1)}>
                                    <Form.Item label="Tên bảng">
                                        <Input value={editedTableName} onChange={(event) => setEditedTableName(event.target.value)} />
                                    </Form.Item>
                                    {editingTableColumns.map((column, index) => (
                                        <div key={index}>
                                            <Input value={column.title} onChange={(event) => {
                                                const newColumns = [...editingTableColumns];
                                                newColumns[index] = { ...newColumns[index], title: event.target.value };
                                                setEditingTableColumns(newColumns);
                                            }} />
                                            {/* <Button onClick={() => handleRemoveColumn(index)}>Xóa</Button> */}
                                        </div>
                                    ))}
                                    <Button onClick={handleAddColumn}>Thêm cột</Button>
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


