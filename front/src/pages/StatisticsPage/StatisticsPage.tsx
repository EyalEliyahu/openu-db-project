// @ts-nocheck
import React from 'react';
import { Graph } from 'pages/StatisticsPage/Graph';
import { CustomPieChart } from 'pages/StatisticsPage/CustomPieChart';

const StatisticsPage = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      padding: 20
    }}>
      <Graph/>
      <CustomPieChart/>
    </div>
  );
}
export default StatisticsPage;
