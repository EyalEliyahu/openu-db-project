import React, { FC, useEffect } from 'react';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  {
    date: '05/11/2022',
    words: 4000,
    files: 2400,
    labels: 2400,
    expressions: 7000,
  },
  {
    date: '06/11/2022',
    words: 3000,
    files: 1398,
    labels: 2210,
    expressions: 2210,
  },
  {
    date: '07/11/2022',
    words: 2000,
    files: 9800,
    labels: 2290,
    expressions: 2290,
  },
  {
    date: '08/11/2022',
    words: 2780,
    files: 3908,
    labels: 2000,
    expressions: 2780,
  },
  {
    date: '09/11/2022',
    words: 1890,
    files: 4800,
    labels: 2181,
    expressions: 4800,
  },
  {
    date: '10/11/2022',
    words: 2390,
    files: 3800,
    labels: 2500,
    expressions: 3800,
  },
  {
    date: '11/11/2022',
    words: 3490,
    files: 4300,
    labels: 2100,
    expressions: 7000,
  },
];

export const Graph: FC = () => {
  const [amountOverTime, setAmountOverTime] = React.useState(data);
  useEffect(() => {
    // TODO: Fetch Data here
    setAmountOverTime(data);
  }, [])
  return (
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
  );
}
