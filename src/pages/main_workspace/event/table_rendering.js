import React, { useState, useEffect } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Button, message, Collapse } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { baseURL } from '../../../config';
import { v4 as uuidv4 } from 'uuid';
import EditableCell from './editable_cell';

const EventDataTable = ({ event_data }) => {
  const { Panel } = Collapse;
  const user_id = localStorage.getItem('userID');
  const group_id = localStorage.getItem('group_id');
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState({});
  const [tableData, setTableData] = useState(event_data.tables);
  const [forceUpdate, setForceUpdate] = useState(0);

  const isEditing = (record, tableName) => editingKey[tableName] === record.key;

  const edit = (record, tableName) => {
    form.setFieldsValue({ ...record });
    setEditingKey({ ...editingKey, [tableName]: record.key });
  };

  useEffect(() => {
    fetch(`${baseURL}/event/query_registed_data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "event_id": event_data.id,
        "group_id": group_id,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data != null) {
          console.log('registed data', data)
          const registed_table_data = data;
          setTableData(registed_table_data);
        }
      })
      .catch((error) => {
        console.error(error);  // Handle error
        message.error('Unable to get registed data');
      });
  }, []);

  const cancel = (tableName) => {
    setEditingKey({ ...editingKey, [tableName]: '' });
  };

  const save = async (key, tableName) => {
    try {
      const row = await form.validateFields();
      const newData = [...tableData];
      const tableIndex = newData.findIndex((table) => table.name === tableName);

      if (tableIndex > -1) {
        const rowIndex = newData[tableIndex].data.findIndex((item) => key === item.key);

        if (rowIndex > -1) {
          const item = newData[tableIndex].data[rowIndex];
          newData[tableIndex].data.splice(rowIndex, 1, { ...item, ...row });
          console.log('modified data', newData);
          setTableData(newData);
        } else {
          newData[tableIndex].data.push(row);
          console.log('new data', newData);
          setTableData(newData);

        }
      }
      setEditingKey({ ...editingKey, [tableName]: '' });
      setForceUpdate(forceUpdate + 1);
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const appendRow = (name) => {
    const newTableData = [...tableData];
    const tableIndex = newTableData.findIndex((table) => table.name === name);
    if (tableIndex > -1) {
      const newData = { ...Object.fromEntries(Object.keys(newTableData[tableIndex].data[0]).map((key) => [key, '...'])) };
      newData.key = `Row--${uuidv4()}`;
      // const newTable = { id: uuidv4(), columns, data: initialData }; // add id property with UUID
      newTableData[tableIndex].data.push(newData);
      setTableData(newTableData);
      setForceUpdate(forceUpdate + 1);
    }
  };

  const FinalSave = (event_data) => {
    event_data.updated_at = new Date().toISOString();
    event_data.tables = tableData;
    fetch(`${baseURL}/event/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "event_data": event_data,
        "user_id": user_id,
        "group_id": group_id,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.message === "Update event success") {
          message.success('Event updated successfully');
        }
        else {
          message.error('Unable to update event 1');
        }
      })
      .catch((error) => {
        console.error(error);
        message.error('Unable to update event');
      });
  };

  const handleDelete = (key, tableName) => {
    const newData = [...tableData];
    const tableIndex = newData.findIndex((table) => table.name === tableName);

    if (tableIndex > -1) {
      const rowIndex = newData[tableIndex].data.findIndex((item) => key === item.key);

      if (rowIndex > 0) {
        newData[tableIndex].data.splice(rowIndex, 1);
        setTableData(newData);
        setForceUpdate(forceUpdate + 1);
      }
    }
  };

  return (
    <>
      {tableData.map((table) => {
        const columns = [
          ...Object.keys(table.data[0] || {}).map((key) => ({
            title: key.toUpperCase(),
            dataIndex: key,
            key,
            editable: true,
            render: (text, record) => (isEditing(record, table.name) ? (
              <Form.Item
                name={key}
                style={{ margin: 0 }}
                rules={[
                  {
                    required: true,
                    message: `${key} is required`,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            ) : (
              text
            )),
          })),
          {
            title: 'Tùy chỉnh',
            dataIndex: 'operation',
            fixed: 'right',
            // width: 120,
            render: (_, record) => {
              const editable = isEditing(record, table.name);
              return (
                <span>
                  {editable ? (
                    <span>
                      <a onClick={() => save(record.key, table.name)} style={{ marginRight: 8 }}>
                        Save
                      </a>
                      <Popconfirm title="Sure to cancel?" onConfirm={() => cancel(table.name)}>
                        <a style={{ marginRight: 8 }} >Cancel</a>
                      </Popconfirm>
                      <Popconfirm
                        title="Are you sure DELETE this row?"
                        icon={
                          <QuestionCircleOutlined
                            style={{
                              color: 'red',
                            }}
                          />
                        }
                        onConfirm={() => handleDelete(record.key, table.name)}
                      >
                        <a type='primary' style={{ color: '#E96767' }} >Delete</a>
                      </Popconfirm>
                    </span>
                  ) : (
                    <span>
                      <Button type='primary' disabled={false} onClick={() => edit(record, table.name)} style={{ marginRight: 8 }}>
                        Edit
                      </Button>

                    </span>
                  )}
                </span>
              );
            },
          },
        ];


        const filteredColumns = columns.filter((column) => column.key !== 'key');

        const mergedColumns = filteredColumns.map((col) => {
          if (!col.editable) {
            return col;
          }
          return {
            ...col,
            onCell: (record) => ({
              record,
              inputType: col.dataIndex === 'age' ? 'number' : 'text',
              dataIndex: col.dataIndex,
              title: col.title,
              editing: isEditing(record, table.name),
            }),
          };
        });

        return (
          <Collapse size="large" style={{marginTop:"2vh"}}>
            <Panel header={table.name} key="1">
              <div key={`${table.name}-${forceUpdate}`} style={{ textAlign: 'right', marginTop: "1vh" }} >
                <div style={{ textAlign: 'left' }}>
                  {/* <h2>{table.name}</h2> */}
                  <Form form={form} component={false}>
                    <Table
                      components={{
                        body: {
                          cell: EditableCell,
                        },
                      }}
                      dataSource={table.data}
                      columns={mergedColumns}
                      rowClassName='editable-row'
                      pagination={{ pageSize: 25 }}
                      scroll={{ x: true }}
                    />
                  </Form>
                </div>
                <Button
                  onClick={() => appendRow(table.name)}
                  style={{ marginTop: '5px' }}
                >
                  Append
                </Button>
              </div>
            </Panel>
          </Collapse>
        );
      })}
      <div style={{ width: "100%", textAlign: "center" }}>
        <Button
          type='primary'
          onClick={() => FinalSave(event_data, user_id)}
          style={{ marginTop: '5px' }}
        >
          SUBMIT
        </Button>
      </div>
    </>
  );
};
export default EventDataTable;
