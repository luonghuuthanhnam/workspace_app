import React, { useContext, useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Table, Input, Button, Popconfirm, Form, Affix, Modal, Checkbox, Select, Tag, Popover } from 'antd';
import { ExclamationCircleFilled, DownloadOutlined } from '@ant-design/icons';
import { employee_columns } from '../../pages/main_workspace/employee/mapping_col_name';
import moment from 'moment';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import { baseURL } from '../../config';
import { isEqual } from 'lodash';
const { Option } = Select;
const { confirm } = Modal;

const EditableContext = React.createContext(null);
const CheckboxGroup = Checkbox.Group;
const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);

    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex]
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} style={{ width: "100px" }} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

const EditableTable = ({ emp_data }) => {
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [dataSource, setDataSource] = useState(emp_data);
    const [originalDataSource, setOriginalDataSource] = useState(dataSource);
    const [isDataSourceModified, setIsDataSourceModified] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [group_options, setGroup_options] = useState(null);
    const user_id = localStorage.getItem('userID');

    const [loading, setLoading] = React.useState(true); // Add loading state
    useEffect(() => {
        fetch(`${baseURL}/event/get_department_list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "userId": user_id,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Groupdata: ", data)
                setGroup_options(data);
            })
            .catch((error) => { });
    }, []);



    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };
    // const handleFilterChange = (value) => {
    //     setStatusFilter(value);
    // };

    let filteredData = [];
    if (dataSource) {
        filteredData = dataSource.filter((d) => {
            if (statusFilter === "") {
                // return all data if no filter is selected
                return true;
            }
            return d.status === statusFilter;
        }).filter((d) => {
            if (searchQuery === "") {
                // return all data if search query is empty
                return true;
            }
            return d.hovaten.toLowerCase().includes(searchQuery.toLowerCase());
        });

        // do something with the filtered data
    }

    useEffect(() => {
        setDataSource(emp_data);
    }, [emp_data]);
    // const [count, setCount] = useState(2);

    useEffect(() => {
        if (originalDataSource === null || originalDataSource === undefined) {
            setOriginalDataSource(dataSource);
            setIsDataSourceModified(false);
        }
        else{
            console.log(" x dataSource: ", dataSource)
            console.log(" x originalDataSource: ", originalDataSource)
            // const is_equal = isEqual(dataSource, originalDataSource);
            console.log(dataSource !== originalDataSource)
            setIsDataSourceModified(dataSource !== originalDataSource);
        }
    }, [dataSource, originalDataSource]);

    const handleDelete = (key) => {
        setDataSource(dataSource.filter((item) => item.key !== key));
    };
    const handleStatusChange = (key, newStatus) => {
        const recordIndex = dataSource.findIndex(item => item.key === key);
        const updatedRecord = {
            ...dataSource[recordIndex],
            status: newStatus
        };
        const updatedDataSource = [
            ...dataSource.slice(0, recordIndex),
            updatedRecord,
            ...dataSource.slice(recordIndex + 1)
        ];
        setDataSource(updatedDataSource);
    };

    const handleGroupNameChange = (key, newGroupID) => {
        const recordIndex = dataSource.findIndex(item => item.key === key);
        console.log("group_options: ", group_options)
        const newGroupName = group_options.find(item => item.group_id === newGroupID).group_name;
        console.log("newGroupName: ", newGroupName)
        const updatedRecord = {
            ...dataSource[recordIndex],
            group_id: newGroupID,
            group_name: newGroupName
        };
        const updatedDataSource = [
            ...dataSource.slice(0, recordIndex),
            updatedRecord,
            ...dataSource.slice(recordIndex + 1)
        ];
        setDataSource(updatedDataSource);
        console.log("updated")
    };

    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setDataSource(newData);
    };

    const generateColumns = (data) => {
        if (!data || data.length === 0 || data[0] === null) return [];
        const keys = Object.keys(data[0]).filter(key => !employee_columns.ignore_cols.includes(key));

        // Add a new column with a title "Action"
        const actionColumn = {
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm
                        title="Sure to delete?"
                        onConfirm={() => handleDelete(record.key)}
                    >
                        <Button style={{ color: "red" }}>Delete</Button>


                    </Popconfirm>
                ) : null,
        };
        const statusColumn = {
            title: 'Trạng Thái',
            dataIndex: 'status',
            render: (status, record) =>
                dataSource.length >= 1 ? (
                    <Select defaultValue={status} onChange={(value) => handleStatusChange(record.key, value)}>
                        <Option value="0">
                            <Tag color="error">Đã nghỉ</Tag>
                        </Option>
                        <Option value="1">
                            <Tag color="success">Đang làm</Tag>
                        </Option>
                    </Select>
                ) : null,
        };

        const groupNameColumn = {
            title: 'Tên Đơn Vị',
            dataIndex: 'group_name',
            render: (status, record) =>
                dataSource.length >= 1 ? (
                    <Select defaultValue={status} onChange={(value) => handleGroupNameChange(record.key, value)}>
                        {group_options ? group_options.map((group) => {
                            return <Option value={group.group_id}>{group.group_name}</Option>
                        }) : null}
                    </Select>
                ) : null,
        };

        return (
            [
                ...keys
                    .filter(key => key !== 'key' && key !== 'maso_doanvien' && key !== 'group_name') // Exclude the "key" column
                    .map((key) => {
                        let cur_sorter = (a, b) => {
                            const aValue = a[key] ?? "";
                            const bValue = b[key] ?? "";
                            return aValue.localeCompare(bValue);
                        };
                        if (key === 'hovaten') {
                            cur_sorter = (a, b) => {
                                const aValue = a[key] ?? "";
                                const bValue = b[key] ?? "";
                                const a_firstname = aValue.split(' ').pop();
                                const b_firstname = bValue.split(' ').pop();

                                return a_firstname.localeCompare(b_firstname)
                            }
                        }
                        else if (key === 'ngaysinh' || key === 'ngayvao_congdoan') {
                            cur_sorter = (a, b) => moment(a.ngaysinh, "DD-MM-YYYY") - moment(b.ngaysinh, "DD-MM-YYYY")
                        };

                        return ({
                            title: employee_columns.emp_mapping_cols[key] ? employee_columns.emp_mapping_cols[key] : key,

                            dataIndex: key,
                            editable: true,
                            sorter: cur_sorter,


                            render: (text, record) => (
                                <EditableCell
                                    title={key}
                                    dataIndex={key}
                                    record={record}
                                    handleSave={handleSave}
                                    editable={key !== 'key'}
                                >
                                    {text}
                                </EditableCell>
                            ),
                        })
                    }
                    ),
                groupNameColumn,
                statusColumn,
                // actionColumn, // Append the new column to the end of the array
            ]);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const showDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };
    const [newColumnName, setNewColumnName] = useState('');

    const columns = generateColumns(dataSource);
    const [container, setContainer] = useState(null);
    const handleOk = () => {
        if (newColumnName) {
            const newData = [...dataSource];
            newData.forEach(item => item[newColumnName] = '...');
            setDataSource(newData);
        }
        setNewColumnName(newColumnName);
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    function removeUnacceptKeys(data, unacceptKeys) {
        return data.map(item => {
            unacceptKeys.forEach(key => delete item[key]);
            return item;
        });
    }
    const showDeleteConfirm = (delete_col_key) => {
        console.log("delete_col_key", delete_col_key)
        confirm({
            title: `Are you sure delete "${selectedColumnsToDelete}" columns ?`,
            icon: <ExclamationCircleFilled />,
            content: 'Some descriptions',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                console.log('OK');
                let newDataSource = removeUnacceptKeys(dataSource, delete_col_key)
                setDataSource(newDataSource);
                console.log("newDataSource", newDataSource)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const handleDeleteColumnOk = () => {
        let delete_col_key = [];

        for (let i = 0; i < selectedColumnsToDelete.length; i++) {
            let selected_index = cur_option_pairs.title.indexOf(selectedColumnsToDelete[i]);
            delete_col_key.push(cur_option_pairs.key[selected_index]);
        }
        // let selected_index = cur_option_pairs.key.indexOf(checkedList[0]);
        if (delete_col_key.length > 0) {
            showDeleteConfirm(delete_col_key = delete_col_key)
        }
        console.log("selectedColumnsToDelete", delete_col_key)
        setIsDeleteModalOpen(false);
    };
    const handleDeleteColumnCancel = () => {
        setIsDeleteModalOpen(false);
    };

    const [selectedColumnsToDelete, setSelectedColumnsToDelete] = useState([]);
    const [cur_option_pairs, setCur_option_pairs] = useState([]);

    useEffect(() => {
        if (dataSource === null) return;
        let options_key = [];
        let options_title = [];
        let temp_data = dataSource[0];
        for (let key in temp_data) {
            if (key !== 'key' && key !== 'maso_doanvien' && key !== 'group_id' && key !== 'employee_id' && !employee_columns.ignore_cols.includes(key)) {
                let _title = employee_columns.emp_mapping_cols[key] ? employee_columns.emp_mapping_cols[key] : key
                options_key.push(key);
                options_title.push(_title);
            }
        }
        setCur_option_pairs({ "key": options_key, "title": options_title });
    }, [dataSource]);

    const delete_column_modal_components = () => {
        if (dataSource === null) return null;
        return (
            <div>
                <CheckboxGroup options={cur_option_pairs.title} value={selectedColumnsToDelete} onChange={setSelectedColumnsToDelete} style={{ display: 'flex', flexWrap: "wrap", justifyContent: "left" }} />
            </div>
        );
    };
    const handlePaginationChange = (newPagination) => {
        setPagination(newPagination);
    };
    const addRow = () => {
        if (dataSource === null) return;
        let temp_data = dataSource[0];
        let new_row = {};
        for (let key in temp_data) {
            if (key === 'key' || key === 'employee_id') {
                new_row[key] = "emp_" + uuidv4();
            }
            else if (key === 'status') {
                new_row[key] = "1";
            }
            else if (key === 'group_id') {
                new_row[key] = group_options[0].group_id;
            }
            else if (key === 'group_name') {
                new_row[key] = group_options[0].group_name;
            }
            else {
                new_row[key] = '...';
            }
        }
        setDataSource([...dataSource, new_row]);
        const lastPage = Math.ceil(dataSource.length / pagination.pageSize);
        setPagination({ ...pagination, current: lastPage });
    }
    const handleSaveTable = () => {
        console.log("SAVING TABLE")
        console.log("dataSource", dataSource)
        // useEffect(() => {
        fetch(`${baseURL}/imployee/save_emp_data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "employee_data": dataSource,
                "user_id": user_id,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                // console.log("Groupdata: ", data)
                // setGroup_options(data);
                setOriginalDataSource(dataSource); // Update the original dataSource
                setIsDataSourceModified(false);
            })
            .catch((error) => { });
        // }, []);

    }
    const s2ab = (s) => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xff;
        }
        return buf;
    };
    const handleExport = () => {
        if (dataSource === null) return null;
        let temp_data = dataSource[0];
        let export_keys = [];
        let export_keys_title = [];
        for (let key in temp_data) {
            if (key !== 'key' && key !== 'maso_doanvien' && key !== 'group_id' && key !== 'employee_id' && !employee_columns.ignore_cols.includes(key)) {
                let _title = employee_columns.emp_mapping_cols[key] ? employee_columns.emp_mapping_cols[key] : key
                export_keys.push(key);
                export_keys_title.push(_title);
            }
            if (key === 'status') {
                export_keys.push(key);
                export_keys_title.push("Trạng thái");
            }
        }
        let export_data = [];
        for (let i = 0; i < dataSource.length; i++) {
            let temp_row = {};
            for (let j = 0; j < export_keys.length; j++) {
                if (export_keys[j] === 'status') {
                    if (dataSource[i][export_keys[j]] === '1') {
                        temp_row[export_keys_title[j]] = "Đang làm";
                    }
                    else if (dataSource[i][export_keys[j]] === '0') {
                        temp_row[export_keys_title[j]] = "Đã nghỉ";
                    }

                }
                else {
                    temp_row[export_keys_title[j]] = dataSource[i][export_keys[j]];
                }
            }
            export_data.push(temp_row);
        }

        // Convert data to worksheet
        const worksheet = XLSX.utils.json_to_sheet(export_data);

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

    const advance_content = (
        <div>
            <Button onClick={handleExport} style={{ marginLeft: "20px" }} type="primary" icon={<DownloadOutlined />} >
                Export
            </Button>
            <Button type="dashed" onClick={showModal} style={{ marginLeft: "20px" }}>
                Add Column
            </Button>
            <Modal
                title="Enter the name of the new column"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Input
                    type="text"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                />
            </Modal>

            <Button type="dashed" onClick={showDeleteModal} style={{ marginLeft: "20px", color: "red" }}>
                Delete Column
            </Button>
            <Modal
                title="Select column to delete"
                open={isDeleteModalOpen}
                onOk={handleDeleteColumnOk}
                onCancel={handleDeleteColumnCancel}
            >
                {delete_column_modal_components()}
            </Modal>
        </div>
    );
    return (
        <div style={{ width: "100%", height: "100%", overflowY: "auto", padding: "0px 20px" }} ref={setContainer}>
            <div style={{ width: "100%", textAlign: "end" }}>
                <Affix target={() => container}>
                    <div>

                        <Button onClick={addRow} style={{ marginLeft: "20px" }}>
                            Add Row
                        </Button>
                        <Popconfirm
                            title="Save this data?"
                            disabled={!isDataSourceModified}
                            onConfirm={() => handleSaveTable()}
                        >
                            <Button type="primary" style={{ marginLeft: "20px" }} disabled={!isDataSourceModified}>
                                Save
                            </Button>
                        </Popconfirm>
                        <Popover content={advance_content} title="Advance" trigger="click" placement="left">
                            <Button type="dashed" style={{ marginLeft: "20px" }}>
                                Advance
                            </Button>
                        </Popover>
                    </div>
                </Affix>
            </div>
            <Input.Search
                placeholder="Search employee"
                style={{ width: 300, marginLeft: "10px" }}
                onChange={handleSearch}
            />
            <div style={{ width: "100%", height: "72vh", overflowY: "auto", marginTop: "20px" }}>

                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={filteredData}
                    columns={columns}
                    pagination={pagination}
                    onChange={handlePaginationChange}
                // style={{ width: "100%", height: "100%", overflowY: "auto" }}
                />
            </div>
        </div>
    );
};

export default EditableTable; 