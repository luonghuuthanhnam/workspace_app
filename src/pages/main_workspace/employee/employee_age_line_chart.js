import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Line, Area } from '@ant-design/plots';

export default function AgeDistributionChart({ data }) {
    if (data != null && Array.isArray(data)) { // Add a check for array type
        let total_age = 0
        let total_value = 0
        for (let i = 0; i < data.length; i++) {
            total_age += data[i].age * data[i].value
            total_value += data[i].value
        }
        let mean = total_age / total_value
        mean = String(Math.round(mean))
        console.log("mean: ", mean)
        const config = {
            data,
            xField: 'age',
            yField: 'value',
            smooth: true,
            annotations: [
                {
                  type: 'text',
                  position: [mean, 10],
                  content: `MEAN: ${mean}`,
                  offsetY: -4,
                  style: {
                    textBaseline: 'bottom',
                  },
                },
                {
                  type: 'line',
                  start: [mean, 'min'],
                  end: [mean, 'max'],
                  style: {
                    stroke: 'red',
                    lineDash: [2, 2],
                  },
                },
              ],
        };
        return <Area {...config} />;
    } else {
        return <></>;
    }
};
