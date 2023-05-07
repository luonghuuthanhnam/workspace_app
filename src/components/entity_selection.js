import { UserOutlined } from '@ant-design/icons';
import { Avatar, Segmented, Space } from 'antd';

const EntityLabelComponent = ({ label, value }) => {
    let color = "#e96767";
    if (value === "defautl_all_department") color = "#5EAAA8";
    return (
        {
            label: (
                <div
                    style={{
                        padding: 4,
                    }}
                >
                    <Avatar
                        style={{
                            backgroundColor: color
                        }}
                    >
                        {label[0]}
                    </Avatar>
                    <div>{label}</div>
                </div>
            ),
            value: value
        }
    )
};


const EntitySelection = ({ options, onSelectionChange }) => {
    if (!options) return null;
    console.log(options, "options")
    const defaultOption = {
        group_name: "All", // default label
        group_id: "defautl_all_department" // default value
      };
    const optionsWithDefault = [defaultOption, ...options];
    return (
        <Space direction="vertical" style={{ width: "100%" }}>
            <div style={{ width: "100%", overflowX: "auto" }}>
                <Segmented block
                    options={optionsWithDefault.map((item) => EntityLabelComponent({ label:item["group_name"], value: item["group_id"] }))}
                    onChange={(value) => {
                        console.log("Selected:", value);
                        // call the callback function with the selected group_id value
                        onSelectionChange(value);
                      }}
                />
            </div>
        </Space>
    );
}
export default EntitySelection;