import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../Styles/IrrigationChart.css'

// Register the required chart elements
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const IrrigationChart = ({ data }) => {
    // Transform the data into a format suitable for the chart
    const labels = []; // For the X-axis (time)
    const plotData = { D1: [], D2: [], D3: [], D4: [] }; // Store plot data for each plot

    data.forEach((entry) => {
        const startTime = entry.startTime;
        const endTime = entry.endTime;

        // Format time for chart's x-axis
        const start = `${startTime.slice(0, 2)}:${startTime.slice(2, 4)}:${startTime.slice(4, 6)}`;
        const end = `${endTime.slice(0, 2)}:${endTime.slice(2, 4)}:${endTime.slice(4, 6)}`;

        if (!labels.includes(start)) labels.push(start);
        if (!labels.includes(end)) labels.push(end);

        // Add data points for each plot
        plotData[entry.plot].push({
            x: start,
            y: 1, // Representing the start of irrigation
            motor: entry.RunBy
        });
        plotData[entry.plot].push({
            x: end,
            y: 0, // Representing the end of irrigation
            motor: entry.RunBy
        });
    });

    // Sort the labels (time) on X-axis in chronological order
    labels.sort();

    // Prepare data for chart.js
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'D1 Irrigation',
                data: plotData.D1,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
                tension: 0.1
            },
            {
                label: 'D2 Irrigation',
                data: plotData.D2,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                tension: 0.1
            },
            {
                label: 'D3 Irrigation',
                data: plotData.D3,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.1
            },
            {
                label: 'D4 Irrigation',
                data: plotData.D4,
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: true,
                tension: 0.1
            }
        ]
    };

    // Chart Options
    const options = {
        responsive: true,
        scales: {
            x: {
                type: 'category',
                labels: labels,
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                min: 0,
                max: 1,
                ticks: {
                    stepSize: 1
                },
                title: {
                    display: true,
                    text: 'Irrigation Status'
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `Motor: ${tooltipItem.raw.motor}`;
                    }
                }
            }
        }
    };

    return (
        <div style={{ width: '80%', margin: '0 auto' }}>
            <h3 className='irrigation-chart-title'>Irrigation Schedule Chart</h3>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default IrrigationChart;
