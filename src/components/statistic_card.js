import { ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';
const StatCard = ({ title, value, unit, color, prefix_icon}) => (
    color = color || "#FFFFFF",
    <Card bordered={false} style={{height: '100%', width: '100%', backgroundColor: 'rgba(163, 210, 202, 0.3)'}}>
        <Statistic
            title={<span style={{ fontSize: "1.2em", fontWeight: "normal", textDecoration: "underline"}}>{title}</span>}
            value={value}
            precision={0}
            valueStyle={{
                color: color,
                fontSize: "1.5vw",
                fontWeight: "bold",
            }}
            prefix={prefix_icon}
            // suffix={unit}
            suffix={<span style={{ fontSize: "0.6em", fontWeight: "normal"}}>{unit}</span>}
        />
    </Card>
);
export default StatCard;