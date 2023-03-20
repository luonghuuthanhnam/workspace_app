import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Bar } from '@ant-design/plots';

export default function ProvinceDistributionChart({ data }) {
    if (data != null && Array.isArray(data)) { // Add a check for array type

        const config = {
            data,
            xField: 'value',
            yField: 'province',
            seriesField: 'province',
            color: ({ province }) => {
                return province === 'TP Hồ Chí Minh' ? '#FAAD14' : '#5B8FF9';
            },
            legend: false,
            meta: {
                province: {
                    alias: 'Tỉnh',
                },
                value: {
                    alias: 'Số lượng',
                },
            },
        };
        return <Bar {...config} />;
    } else {
        return <></>;
    }
};
