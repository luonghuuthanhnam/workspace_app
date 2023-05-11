import { ArrowUpOutlined } from '@ant-design/icons';
import { padding } from '@mui/system';
import { Card, Col, Row, Statistic } from 'antd';

const HonorCard = ({ title, honoree, description, unit}) => {
    if (honoree === null) {
        return null;
    }
    return (
    <Card bordered={true} style={{ width: '100%', height: '100%', paddingLeft: "5%"}}>
        <Row>
            <span style={{ fontSize: "1.3em", fontWeight: "bold", textDecoration: "underline"}}>{title}</span>
        </Row>
        <Row style={{display: "flex", alignItems:"baseline"}}>
            <span style={{ fontSize: "1.5vw", fontWeight: "bold", color:"#e96767"}}>{honoree[0]}</span>
            <span style={{marginLeft:"3%", fontSize: "1.2em", fontWeight: "normal", fontStyle: "oblique", color:"#e96767"}}>{`(${description[0]} ${unit})`}</span>
        </Row>
        <Row style={{display: "flex", alignItems:"baseline"}}>
            <span style={{ fontSize: "1.1vw", fontWeight: "normal"}}>{honoree[1]}</span>
            <span style={{marginLeft:"3%", fontSize: "1.2em", fontWeight: "normal", fontStyle: "oblique"}}>{`(${description[1]} ${unit})`}</span>
        </Row>
        <Row style={{display: "flex", alignItems:"baseline"}}>
            <span style={{ fontSize: "1.1vw", fontWeight: "normal"}}>{honoree[2]}</span>
            <span style={{marginLeft:"3%", fontSize: "1.2em", fontWeight: "normal", fontStyle: "oblique"}}>{`(${description[2]} ${unit})`}</span>
        </Row>
    </Card>
);
};

export default HonorCard;