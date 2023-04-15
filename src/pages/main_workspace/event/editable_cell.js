import { useState } from 'react';
import { Input, InputNumber, Form } from 'antd';
import { unidecode } from 'unidecode';


const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
    console.log("editing", editing)
    console.log("dataIndex", dataIndex)
    console.log("title", title)
    console.log("inputType", inputType)
    console.log("record", record)
    console.log("index", index)
    console.log("children", children)
    console.log("restProps", restProps)
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
export default EditableCell;