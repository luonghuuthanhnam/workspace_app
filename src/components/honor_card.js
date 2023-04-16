import { ArrowUpOutlined } from '@ant-design/icons';
import { padding } from '@mui/system';
import { Card, Col, Row, Statistic } from 'antd';

const HonorCard = ({ title, honoree, description}) => (
    <Card bordered={true} style={{ width: '100%', paddingLeft: "5%"}}>
        <Row>
            <span style={{ fontSize: "1.2em", fontWeight: "normal", textDecoration: "underline"}}>{title}</span>
        </Row>
        <Row>
            <span style={{ fontSize: "1.5vw", fontWeight: "bold"}}>{honoree}</span>
        </Row>
        <Row>
                <span style={{ fontSize: "1.2em", fontWeight: "normal", fontStyle: "oblique"}}>{description}</span>
        </Row>
    </Card>
);
export default HonorCard;