// @ts-nocheck

import React, { useState } from 'react';
import { Cell, Pie, PieChart, Sector } from 'recharts';

// import { noticePeriod } from './data';

const noticePeriod = [{
  label: '0 - 15',
  unit: 'days',
  candidates: 43000
}, {
  label: '15 - 30',
  unit: 'days',
  candidates: 48000
}, {
  label: '1 - 2',
  unit: 'months',
  candidates: 87000
}, {
  label: '2 - 3',
  unit: 'months',
  candidates: 53000
}]


export const CustomPieChart = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  function toK(value) {
    return value / 1000 + 'K';
  }
  
  const Info = () => {
    
    if (activeIndex === null) {
      return <div></div>
    }
    
    const data = noticePeriod[activeIndex];
    
    return <div className="pie-info">
      <h2 className="weight700">{toK(data.candidates)}</h2>
      <p>{data.label} {data.unit}</p>
    </div>
  }
  
  
  const COLORS = ['#3E5ED6', '#50E2C2', '#FDCC72', '#FA8686'];
  
  
  function renderActiveShape(props) {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end'
    
    return <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 8}
        outerRadius={outerRadius + 11}
        fill={fill}
      />
    </g>
  }
  
  function onPieHover(data, index) {
    setActiveIndex(index);
  }
  
  function onMouseLeave() {
    setActiveIndex(0);
  }
  
  function mouseEnter() {
    console.log(this);
  }
  
  return <div className="pie-chart">
    <h1>Notice period distribution</h1>

    <div class="chart">
      <div className="pie">
        <Info/>
        <PieChart
          width={250}
          height={250}
        >
          <Pie
            activeIndex={activeIndex}
            data={noticePeriod}
            dataKey="candidates"
            nameKey="name"
            outerRadius={100}
            innerRadius={80}
            activeShape={renderActiveShape}
            onMouseOver={onPieHover}
            onMouseLeave={onMouseLeave}
          >
          {noticePeriod.map((entry, index) => {
            return <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          })}
          </Pie>
        </PieChart>
      </div>
      <div className="data">
        <ul>
          {noticePeriod.map((entry, index) => {
            const color = COLORS[index % COLORS.length];
            return <li className={activeIndex === index ? 'active' : ''} onMouseOver={onPieHover.bind(null, null, index)}
                       onMouseLeave={onMouseLeave.bind(null, null, index)}>
              <span class="dot" style={{ backgroundColor: color }}></span>
              <span class="label">{entry.label} {entry.unit}</span>
              <span>{toK(entry.candidates)} Candidates</span>
            </li>
          })}
        </ul>
      </div>
    </div>
  </div>
}
