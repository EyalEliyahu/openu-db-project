// @ts-nocheck
import React, { useEffect } from 'react';
import { Graph } from 'pages/StatisticsPage/Graph';
import { CustomPieChart } from 'pages/StatisticsPage/CustomPieChart';

const StatisticsPage = () => {
  const [statistics, setStatistics] = React.useState();
  
  useEffect(() => {
    fetch('http://localhost:8000/statistics')
      .then(res => res.json())
      .then(data => setStatistics(data));
  },[]);
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      padding: 20
    }}>
      <Graph amountOverTime={statistics?.amountOverTime || []}/>
      <CustomPieChart topFiveWords={statistics?.topFiveWords || []}/>
    </div>
  );
}
export default StatisticsPage;
