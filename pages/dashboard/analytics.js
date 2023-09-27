// pages/index.js

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BuildingRevenueChartPage = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // Store a reference to the chart instance

  useEffect(() => {
    const data = {
      labels: [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
      ],
      datasets: [
        {
          label: 'Building A',
          data: [1000, 1200, 1500, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000],
          backgroundColor: 'rgba(255, 99, 132, 0.6)', // Customize the color
        },
        {
          label: 'Building B',
          data: [800, 900, 1100, 1200, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2200],
          backgroundColor: 'rgba(54, 162, 235, 0.6)', // Customize the color
        },
        // Add more buildings' data here
      ],
    };

    const ctx = chartRef.current.getContext('2d');

    // Check if a chart instance already exists and destroy it
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create a new chart instance
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, []);

  return (
    <div>
      <div style={{ width: '80%', margin: '0 auto' }}>
        <canvas ref={chartRef} width={400} height={200} />
      </div>
    </div>
  );
};

export default BuildingRevenueChartPage;
