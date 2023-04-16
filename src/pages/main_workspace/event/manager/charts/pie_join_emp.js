import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Pie } from '@ant-design/plots';

const PieJoiningEmp = ({data}) => {
  if (!data || data.length === 0) {
    return <div>Empty chart</div>;
  }
  let value_sum = data.map((item) => item.value).reduce((a, b) => a + b);
  console.log(value_sum);
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
        content: `Tổng\n${value_sum}`,
      },
    },
  };
  return <div style={{textAlign:"left"}}>
    <h2>TỔNG SỐ LƯỢT ĐĂNG KÝ THEO ĐƠN VỊ</h2>
    <Pie {...config} />;

  </div>
};

export default PieJoiningEmp;