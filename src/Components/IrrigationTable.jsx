import React, { useState, useEffect } from 'react';
import '../Styles/IrrigationTable.css';
import { FaFilter } from 'react-icons/fa'; // Importing filter icon from react-icons
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const IrrigationTable = () => {
    const [plots, setPlots] = useState([]);
    const [numPlots, setNumPlots] = useState('');
    const [numMotors, setNumMotors] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [motorRuntime, setMotorRuntime] = useState('');
    const [cycleInterval, setCycleInterval] = useState('');
    const [filteredPlots, setFilteredPlots] = useState([]);
    const [plotFilter, setPlotFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isScheduleGenerated, setIsScheduleGenerated] = useState(false);

    const generateSchedule = () => {
        const startTimeNum = parseInt(startTime.replace(":", ""));
        const newPlots = [];
        let currentStartTime = startTimeNum;
        let currentEndTime = startTimeNum + motorRuntime * 100;

        for (let i = 0; i < numPlots; i++) {
            for (let j = 0; j < numMotors; j++) {
                newPlots.push({
                    index: newPlots.length,
                    plot: `D${(i % numPlots) + 1}`,
                    startTime: currentStartTime.toString().padStart(6, '0'),
                    endTime: currentEndTime.toString().padStart(6, '0'),
                    runBy: `M${(j % numMotors) + 1}`,
                });

                currentStartTime += cycleInterval * 100;
                currentEndTime += cycleInterval * 100;
            }
        }

        setPlots(newPlots);
        setFilteredPlots(newPlots);
        setIsScheduleGenerated(true);
    };

    const getStatus = (startTime, endTime) => {
        const currentTime = new Date();
        const start = new Date();
        start.setHours(startTime.slice(0, 2), startTime.slice(2, 4), startTime.slice(4, 6));
        const end = new Date();
        end.setHours(endTime.slice(0, 2), endTime.slice(2, 4), endTime.slice(4, 6));

        if (currentTime >= start && currentTime <= end) return 'In Progress';
        if (currentTime > end) return 'Done';
        return 'Pending';
    };

    const filterData = () => {
        let filtered = plots;

        if (plotFilter) {
            filtered = filtered.filter(item => item.plot === plotFilter);
        }

        if (statusFilter) {
            filtered = filtered.filter(item => getStatus(item.startTime, item.endTime) === statusFilter);
        }

        setFilteredPlots(filtered);
    };

    useEffect(() => {
        filterData();
    }, [plotFilter, statusFilter]);

    const chartData = {
        labels: filteredPlots.map(item => item.plot),
        datasets: [
            {
                label: 'Irrigation Duration (min)',
                data: filteredPlots.map(item => {
                    const startTimeNum = parseInt(item.startTime);
                    const endTimeNum = parseInt(item.endTime);
                    return (endTimeNum - startTimeNum) / 100; // in minutes
                }),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
            },
        ],
    };

    return (
        <div className="irrigation-table-container"
            style={{
                flexDirection: isScheduleGenerated ? 'row' : 'column',
                alignItems: isScheduleGenerated ? 'flex-start' : 'center',
            }}>

            <div className="form-container">
                <h3>Irrigation Schedule Form</h3>
                <label>Number of Plots: </label>
                <input
                    type="number"
                    value={numPlots}
                    onChange={(e) => setNumPlots(e.target.value)}
                />

                <label>Number of Motors: </label>
                <input
                    type="number"
                    value={numMotors}
                    onChange={(e) => setNumMotors(e.target.value)}
                />

                <label>Start Time: </label>
                <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                />

                <label>End Time: </label>
                <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                />

                <label>Motor Runtime (minutes): </label>
                <input
                    type="number"
                    value={motorRuntime}
                    onChange={(e) => setMotorRuntime(e.target.value)}
                />

                <label>Irrigation Cycle Interval (minutes): </label>
                <input
                    type="number"
                    value={cycleInterval}
                    onChange={(e) => setCycleInterval(e.target.value)}
                />

                <button onClick={generateSchedule}>Generate Schedule</button>
            </div>

            {isScheduleGenerated && (
                <>
                    <div className="table-container">
                        <h1>Irrigation Schedule</h1>
                        <table className="irrigation-table">
                            <thead>
                                <tr>
                                    <th>Index</th>
                                    <th>
                                        Plot <FaFilter />
                                        <select
                                            value={plotFilter}
                                            onChange={(e) => setPlotFilter(e.target.value)}
                                            style={{ marginTop: '5px', width: '80%' }}
                                        >
                                            <option value="">All</option>
                                            <option value="D1">D1</option>
                                            <option value="D2">D2</option>
                                            <option value="D3">D3</option>
                                            <option value="D4">D4</option>
                                        </select>
                                    </th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th>
                                        Status <FaFilter />
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            style={{ marginTop: '5px', width: '80%' }}
                                        >
                                            <option value="">All</option>
                                            <option value="Done">Done</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Pending">Pending</option>
                                        </select>
                                    </th>
                                    <th>Run By</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPlots.length > 0 ? filteredPlots.map((item) => (
                                    <tr key={item.index}>
                                        <td>{item.index}</td>
                                        <td>{item.plot}</td>
                                        <td>{item.startTime.slice(0, 2)}:{item.startTime.slice(2, 4)}</td>
                                        <td>{item.endTime.slice(0, 2)}:{item.endTime.slice(2, 4)}</td>
                                        <td>{getStatus(item.startTime, item.endTime)}</td>
                                        <td>{item.runBy}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="chart-container">
                        <h3>Irrigation Duration Chart</h3>
                        <Line data={chartData} />
                    </div>
                </>
            )}
        </div>
    );
};

export default IrrigationTable;
