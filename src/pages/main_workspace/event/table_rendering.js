import React, { useState, useEffect } from 'react';
import { Table, Input, Popconfirm, Form, Button, message, Collapse, Modal, Select, Tag, Row } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { baseURL } from '../../../config';
import { v4 as uuidv4 } from 'uuid';
const { Option } = Select;

const EventDataTable = ({ event_data }) => {
  const { Panel } = Collapse;
  const user_id = localStorage.getItem('userID');
  const group_id = localStorage.getItem('group_id');
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState(event_data.tables);
  const [selectedRowKey, setSelectedRowKey] = useState("");
  const [selectedTableID, setSelectedTableID] = useState(null);
  const [isAddNew, setIsAddNew] = useState(false);
  const [selectedTableName, setSelectedTableName] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  let emp_code = JSON.parse(localStorage.getItem('emp_code'));

  const options = emp_code.map((emp) => ({ label: <><Tag>{emp["hovaten"]}</Tag> <Tag>{emp["ngaysinh"]}</Tag></>, value: emp["employee_id"] }));

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
          // console.log('registed data', data)
          const registed_table_data = data;
          setTableData(registed_table_data);
        }
      })
      .catch((error) => {
        console.error(error);
        message.error('Unable to get registed data');
      });
  }, []);

  const handleEditButtonClick = (key, table_id, table_name) => {
    // console.log("key", key)
    setIsAddNew(false);
    setSelectedRowKey(key);
    setSelectedTableID(table_id);
    setSelectedTableName(table_name)
    setEditModalVisible(true);
  };

  const handleAddButtonClick = (table_id, table_name) => {
    setIsAddNew(true);
    setSelectedTableID(table_id);
    setSelectedTableName(table_name)
    setEditModalVisible(true);
  }
  const showTables = () => {
    let tables = [];
    for (let i = 0; i < tableData.length; i++) {
      const columns = [
        ...Object.keys(tableData[i].data[0] || {})
          .filter((key) => key.toUpperCase() !== "KEY" && key.toUpperCase() !== "EMPLOYEE_ID") // Filter out "KEY" and "EMP" columns
          .map((key) => {
            return {
              title: key.toUpperCase(),
              dataIndex: key
            };
          }),
        {
          title: "Chỉnh sửa",
          key: "action",
          render: (text, record) => (
            <div>
              <Button onClick={() => handleEditButtonClick(record.key, tableData[i].table_id, tableData[i].name)}>
                Edit
              </Button>
              <Popconfirm
                title="Confirm to delete this row?"
                onConfirm={() => {
                  const newData = [...tableData];
                  const index = newData[i].data.findIndex((item) => record.key === item.key);
                  if (newData[i].data.length === 1) {
                    let blank_data = {}
                    for (let key in newData[i].data[0]) {
                      blank_data[key] = "...";
                      const new_key = `Row--${uuidv4()}`;
                      blank_data["key"] = new_key;
                      newData[i].data.splice(index, 1);
                      newData[i].data[0] = blank_data;
                    }
                  }
                  else {
                    newData[i].data.splice(index, 1);
                  }
                  setTableData(newData);

                  const updatedData = [...newData[i].data];
                  setTableData((prevData) => {
                    const updatedTableData = [...prevData];
                    updatedTableData[i].data = updatedData;
                    return updatedTableData;
                  });
                }}
              >
                <Button danger style={{ marginLeft: "10px" }}>
                  Delete
                </Button>
              </Popconfirm>
            </div>
          )
        }
      ];
      const table_component = () => (
        <Collapse size="large" style={{ marginTop: "2vh", width: "100%" }}>
          <Panel header={tableData[i].name} key="1" style={{ width: "100%" }}>
            <Table dataSource={tableData[i].data} columns={columns} />
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Button style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                onClick={() => handleAddButtonClick(tableData[i].table_id, tableData[i].name)}>
                Add New Row
              </Button>
            </div>
          </Panel>
        </Collapse>
      );
      tables.push(table_component());
    }
    return tables.map((table) => <div>{table}</div>);
  };

  const EditModalContent = (cur_selectedRowKey, cur_selectedTableID) => {
    // console.log("cur_selectedTableID", cur_selectedTableID)
    if (tableData === undefined || tableData == null || cur_selectedTableID === null || editModalVisible == false) return <></>;
    const selected_table = tableData.filter((table) => table.table_id === cur_selectedTableID)[0];
    let selected_table_data = selected_table.data;
    let selected_table_modified = [...selected_table_data];
    // console.log("isAddNew", isAddNew)
    if (isAddNew) {
      // console.log("test", selected_table_data)
      const new_blank_row = { ...selected_table_data[0] };
      for (let key in new_blank_row) {
        new_blank_row[key] = null;
      }
      const new_key = `Row--${uuidv4()}`;
      new_blank_row["key"] = new_key;
      cur_selectedRowKey = new_key;
      // console.log("selected_table_modified", selected_table_modified)

      selected_table_modified.push(new_blank_row);
      // console.log("ADD NEW KEY", cur_selectedRowKey)
      // console.log("footage tableData", tableData)
    }



    const selected_row = selected_table_modified.filter((row) => row.key === cur_selectedRowKey)[0];
    let selected_row_modified_avata = selected_row;
    let selected_row_modified = { ...selected_row };
    const isNameField = (field) => field === 'Tên';

    const onEmployeeOptionChange = (value) => {
      // console.log(`onEmployeeOptionChange ${value}`);
      selected_row_modified["employee_id"] = value;
      selected_row_modified["Tên"] = emp_code.filter((emp) => emp["employee_id"] === value)[0]["hovaten"];
    }
    const handleFormValuesChange = (changedValues, allValues) => {
      // update the selected_row_modified with the changed form values
      Object.keys(changedValues).forEach(key => {
        selected_row_modified[key] = changedValues[key];
      });
    };

    const renderFormItem = (field, value) => {
      if (field === 'key' || field === 'employee_id') return null;
      const fieldProps = isNameField(field) ? { style: { fontWeight: 'bold' } } : {};
      const selectProps = isNameField(field) ? { showSearch: true, options: emp_code } : {};
      const FieldComponent = isNameField(field) ? (
        <Select {...selectProps} options={options} onChange={onEmployeeOptionChange} />
      ) : (
        <Input />
      );
      return (
        <Form.Item label={field} name={field} initialValue={value}>
          {FieldComponent}
        </Form.Item>
      );
    };
    const handleUpdateClick = () => {
      const list_keys = Object.keys(selected_row_modified);
      const list_values = Object.values(selected_row_modified);
      for (let i = 0; i < list_keys.length; i++) {
        if (list_keys[i] !== 'employee_key' || list_keys[i] !== "Tên") {
          if (list_values[i] === null || list_values[i] === undefined || list_values[i] === "") {
            message.error("Do not leave any field blank");
            return;
          }
        }
      }
      for (let i = 0; i < list_keys.length; i++) {
        selected_row_modified_avata[list_keys[i]] = list_values[i]
      }
      const updated_selected_table_data = selected_table_modified.map(row => {
        if (row.key === cur_selectedRowKey) {
          return selected_row_modified_avata;
        } else {
          return row;
        }
      });
      const updated_tableData = tableData.map(table => {
        if (table.table_id === cur_selectedTableID) {
          return { ...table, data: updated_selected_table_data };
        } else {
          return table;
        }
      });
      setTableData(updated_tableData);
      setEditModalVisible(false);
    };

    return (
      <Form key={`${cur_selectedTableID}-${cur_selectedRowKey}`} initialValues={selected_row} onValuesChange={handleFormValuesChange}>
        {Object.entries(selected_row).map(([field, value]) => renderFormItem(field, value))}
        <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
          <Button type="primary" onClick={handleUpdateClick}>Update</Button>
        </div>
      </Form>
    );
  };

  const onModaCancel = () => {
    setIsAddNew(false);
    setEditModalVisible(false);
    // console.log("tableData", tableData)
  }

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
        } else {
          message.error('Unable to update event 1');
        }
      })
      .catch((error) => {
        console.error(error);
        message.error('Unable to update event');
      });
  };

  return (
    <div>
      <div style={{ width: "100%", textAlign: "center" }}>
        <Button
          type='primary'
          onClick={() => FinalSave(event_data, user_id)}
          style={{ marginTop: '5px' }}
        >
          SUBMIT
        </Button>
      </div>
      {showTables()}
      <Modal
        title={selectedTableName}
        open={editModalVisible}
        footer={null}
        // onOk={() => setEditModalVisible(false)}
        onCancel={() => onModaCancel()}
        destroyOnClose={true}
      >
        {EditModalContent(selectedRowKey, selectedTableID, selectedTableName)}
      </Modal>
    </div>
  );
};
export default EventDataTable;
