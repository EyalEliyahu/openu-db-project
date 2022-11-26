import React, { FC } from 'react';
import { Pie, PieChart, Tooltip } from 'recharts';

// @ts-ignore
export const CustomPieChart: FC = ({ topFiveWords }: { topFiveWords: any }) => {
  if(topFiveWords.length > 0) {
    topFiveWords[0].fill = '#FF9FB2';
    topFiveWords[1].fill = 'rgb(136, 132, 216)';
    topFiveWords[2].fill = '#0ACDFF';
    topFiveWords[3].fill = 'rgb(130, 202, 157)';
    topFiveWords[4].fill = 'rgb(117, 129, 194)';
  }
  return (
    <div style={{
      position: 'relative',
    }}>
    
    <p style={{
      position: 'absolute',
      fontSize: 20,
      fontWeight: 'bold',
      top: '10%',
      left: '33%',
    }}>Top five words</p>
    <PieChart width={400} height={400}>
      <Pie
        dataKey="value"
        isAnimationActive={false}
        data={topFiveWords}
        cx="50%"
        cy="50%"
        outerRadius={80}
        label
      />
      <Tooltip/>
    </PieChart>
          </div>
  
  );
}
