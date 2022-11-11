import * as React from 'react';
import LabelsTable from 'pages/LabelsAndExpressionsPage/components/LabelsTable';
import ExpressionsTable from 'pages/LabelsAndExpressionsPage/components/ExpressionsTable';


export const LabelsAndExpressionsPage = () => {
  return (
    <div style={{ display: 'flex', gap: 50, padding: 40, alignItems: 'flex-start' }}>
      <LabelsTable/>
      <ExpressionsTable/>
    </div>
  );
};



