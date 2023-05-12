import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Sunburst } from '@ant-design/plots';

const SunburstChart = ({ data, title }) => {
    if (data != null) {
        const config = {
            data,
            innerRadius: 0.3,
            interactions: [
                {
                    type: 'element-active',
                },
            ],
            label: (data) => {
                return {
                    content: data.name,
                };
            },
            // color: ({ name }) => {
            //     if (name === 'Nam') {
            //         return '#789cd5'; // Set the color for male
            //     } else if (name === 'Nữ') {
            //         return '#9784b6'; // Set the color for female
            //     }
            //     else {
            //         return '#5a95f4'; // Set the color for other
            //     }
            // },
        };

        
        return <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignContent: "center"}}>
        <h3 className="chart_title" style={{ display: 'flex', justifyContent: 'center' }}>{title}</h3> 
        <Sunburst {...config} />;
        </div>
    }
    else {
        return <></>;
    };
};
export default SunburstChart