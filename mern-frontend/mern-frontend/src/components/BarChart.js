import React from 'react';
import { Bar } from 'react-chartjs-2';

function BarChart({ data }) {
  return (
    <>
      <h5>Price Range Distribution (Bar Chart)</h5>
      <Bar
        data={{
          labels: data.map(item => item.range),
          datasets: [{
            label: 'Number of Items',
            data: data.map(item => item.count),
            backgroundColor: 'rgba(75, 192, 192, 0.6)'
          }]
        }}
      />
    </>
  );
}

export default BarChart;
