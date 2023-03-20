import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Area } from '@ant-design/plots';

export default function JoiningByGenderChart({ data }) {
    if (data != null && Array.isArray(data)) { // Add a check for array type
      const config = {
        data,
        xField: 'joining_date',
        yField: 'value',
        seriesField: 'gender',
        smooth: true,
        tackField: null,
        areaStyle: { fillOpacity: 0.5 },
      };
  
      return <Area {...config} />;
    } else {
      return <></>;
    }
  }