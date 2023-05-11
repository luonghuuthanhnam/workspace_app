import { UserOutlined } from '@ant-design/icons';
import { Avatar, Segmented, Space, Row,DatePicker} from 'antd';

import { useEffect, useState } from 'react';


const { RangePicker } = DatePicker;
const PeriodSelection = ({onPeriodChange}) => {
    const [selectedOption, setSelectedOption] = useState("All Time");
    // const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6', 'Option 7', 'Option 8', 'Option 9', 'Option 10', 'Option 11', 'Option 12', 'Option 13', 'Option 14', 'Option 15', 'Option 16', 'Option 17'];
    const options = ['All Time','Month', 'Quarter', 'Year', 'Custom'];
    const onChange = (date, dateString) => {
        console.log(date, dateString);
        onPeriodChange(dateString);
      };

    return (
        <div direction="vertical" style={{ width: "100%", height:"100%"}}>
        <Row style={{width: "100%", height:"40%"}}>
        <div style={{ width: "100%", overflowX: "auto"}}>
            <Segmented block style={{width: "100%"}}
                options={options.map((item) => ({ label:item, value: item}))}
                onChange={(value) => {
                    console.log("Selected Time:", value);
                    setSelectedOption(value);
                    if (value === "All Time") onPeriodChange("All Time");
                }}
            />
        </div>
        </Row>
        <Row style={{height: "55%", width:"100%", marginTop: "1%" ,justifyContent:"center"}}>
            {selectedOption === "Month"? <DatePicker style={{height: "80%", width:"45%", display:"flex", justifyContent:"center", textAlign:"center", alignItems:"center"}} onChange={onChange} picker="month"/> : null}
            {selectedOption === "Quarter"? <DatePicker style={{height: "80%", width:"45%", display:"flex", justifyContent:"center", textAlign:"center", alignItems:"center"}} onChange={onChange} picker="quarter"/> : null}
            {selectedOption === "Year"? <DatePicker style={{height: "80%", width:"45%", display:"flex", justifyContent:"center", textAlign:"center", alignItems:"center"}} onChange={onChange} picker="year"/> : null}
            {selectedOption === "Custom"? <RangePicker style={{height: "80%", width:"45%", display:"flex", justifyContent:"center", textAlign:"center", alignItems:"center"}} onChange={onChange}/> : null}
        </Row>
        </div>
        )
};

export default PeriodSelection;