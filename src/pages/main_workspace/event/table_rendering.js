import React, { useState, useEffect } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Button } from 'antd';

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EventDataTable = ({ event_data }) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState({});
  const [tableData, setTableData] = useState(event_data.tables);
  const [forceUpdate, setForceUpdate] = useState(0);

  const isEditing = (record, tableName) => editingKey[tableName] === record.key;

  const edit = (record, tableName) => {
    form.setFieldsValue({ ...record });
    setEditingKey({ ...editingKey, [tableName]: record.key });
  };

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
      const newData = { key: `new${newTableData[tableIndex].data.length}`, ...Object.fromEntries(Object.keys(newTableData[tableIndex].data[0]).map((key) => [key, '...'])) };
      newData.key = `${newTableData[tableIndex].data.length}`;
      newTableData[tableIndex].data.push(newData);
      setTableData(newTableData);
      setForceUpdate(forceUpdate + 1);
    }
  };

  const FinalSave = (tableData) => {
    console.log('Final Save', tableData);
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
            title: 'Operation',
            dataIndex: 'operation',
            fixed: 'right',
            width: 80,
            render: (_, record) => {
              const editable = isEditing(record, table.name);
              return editable ? (
                <span>
                  <a onClick={() => save(record.key, table.name)} style={{ marginRight: 8 }}>
                    Save
                  </a>
                  <Popconfirm title="Sure to cancel?" onConfirm={() => cancel(table.name)}>
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
              ) : (
                <a disabled={false} onClick={() => edit(record, table.name)}>
                  Edit
                </a>
              );
            },
          },
        ];

        const mergedColumns = columns.map((col) => {
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
          <div key={`${table.name}-${forceUpdate}`}  style={{ textAlign: 'right', marginTop: "1vh"}} >
            <div style={{ textAlign: 'left' }}>
            <h2>{table.name}</h2>
            <Form form={form} component={false}>
              <Table
                // key={forceUpdate} // Add this line
                components={{
                  body: {
                    cell: EditableCell,
                  },
                }}
                dataSource={table.data}
                columns={mergedColumns}
                rowClassName='editable-row'
                pagination={{ pageSize: 10 }}
                scroll={{ x: true }}
              />
            </Form>
            </div>
            <Button
              // type='primary'
              onClick={() => appendRow(table.name)}
              style={{ marginTop: '5px'}}
            >
              Append
            </Button>
          </div>
        );
      })}
      <div style={{width: "100%", textAlign: "center"}}>
        <Button
              type='primary'
              onClick={() => FinalSave(tableData)}
              style={{ marginTop: '5px'}}
            >
              SUBMIT
            </Button>

      </div>
    </>
  );
};
export default EventDataTable;
