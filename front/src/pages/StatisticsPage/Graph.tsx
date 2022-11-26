import React, { FC } from 'react';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';


// @ts-ignore
export const Graph: FC = ({amountOverTime}: {amountOverTime: any}) => {
  return (
    
    <div style={{
      position: 'relative',
      paddingTop: 70,
    }}>
    
    <p style={{
      position: 'absolute',
      fontSize: 20,
      fontWeight: 'bold',
      top: '10%',
      left: '33%',
    }}>Entries over time</p>
    <LineChart
      width={500}
      height={300}
      data={amountOverTime}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="date"/>
          <YAxis/>
          <Tooltip/>
          <Legend/>
          <Line type="monotone" dataKey="files" stroke="#8884d8" activeDot={{ r: 8 }}/>
          <Line type="monotone" dataKey="words" stroke="#82ca9d"/>
          <Line type="monotone" dataKey="labels" stroke="#7581c2"/>
          <Line type="monotone" dataKey="expressions" stroke="#c27575"/>
        </LineChart>
      </div>
  );
}
