import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Line } from '@ant-design/plots';

export default function AgeDistributionChart({ data }) {
    if (data != null && Array.isArray(data)) { // Add a check for array type
        const config = {
            data,
            xField: 'age',
            yField: 'value',
            label: {},
            point: {
                size: 5,
                shape: 'diamond',
                style: {
                    fill: 'white',
                    stroke: '#5B8FF9',
                    lineWidth: 2,
                },
            },
            tooltip: {
                showMarkers: false,
            },
            state: {
                active: {
                    style: {
                        shadowBlur: 4,
                        stroke: '#000',
                        fill: 'red',
                    },
                },
            },
            interactions: [
                {
                    type: 'marker-active',
                },
            ],
        };
        return <Line {...config} />;
    } else {
        return <></>;
    }
};
