import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Sunburst } from '@ant-design/plots';

const SunburstChart = ({ data }) => {
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

        return <Sunburst {...config} />;
    }
    else {
        return <></>;
    };
};
export default SunburstChart