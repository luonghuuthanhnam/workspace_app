import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Pie } from '@ant-design/plots';

const PieJoiningEmp = () => {
  const data = [
    {
      type: 'Đơn vị 1',
      value: 24,
    },
    {
      type: 'Đơn vị 2',
      value: 12,
    },
    {
      type: 'Đơn vị 3',
      value: 22,
    },
    {
      type: 'Đơn vị 5',
      value: 10,
    },
  ];
  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: 'Tổng\n68',
      },
    },
  };
  return <Pie {...config} />;
};

export default PieJoiningEmp;