import React from 'react';
import { Pie } from 'react-chartjs-2';

function PieChart({ data }) {
  return (
    <>
      <h5>Category Distribution (Pie Chart)</h5>
      <Pie
        data={{
          labels: data.map(item => item._id),
          datasets: [{
            data: data.map(item => item.count),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
          }]
        }}
      />
    </>
  );
}

export default PieChart;
