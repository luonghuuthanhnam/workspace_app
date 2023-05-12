import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Area, Column } from '@ant-design/plots';

export default function JoiningByGenderChart({ data, title }) {
  if (data != null && Array.isArray(data)) { // Add a check for array type
    // const config = {
    //   data,
    //   xField: 'joining_date',
    //   yField: 'value',
    //   seriesField: 'gender',
    //   smooth: true,
    //   tackField: null,
    //   areaStyle: { fillOpacity: 0.5 },
    // };

    // return <Area {...config} />;
    const config = {
      data,
      xField: 'joining_date',
      yField: 'value',
      seriesField: 'gender',
      isGroup: true,
      columnStyle: {
        radius: [20, 20, 0, 0],
      },
      slider: {
        start: 0.7,
        end: 1.0,
      },
    };

    return <div>
      <h3 className="chart_title" style={{ display: 'flex', alignItems: 'center' }}>{title}</h3>
      <Column {...config} ></Column>
    </div>
  } else {
    return <></>;
  }
}