// src/App.jsx
import React from "react";
import Navbar from "./Components/Navbar"; // Import Navbar component
import "./App.css"; // Optional global styles (if any)
import IrrigationTable from "./Components/IrrigationTable";



const data = [
  { index: 0, plot: 'D1', startTime: '070000', endTime: '070459', RunBy: 'M1' },
  { index: 1, plot: 'D2', startTime: '070000', endTime: '070459', RunBy: 'M2' },
  { index: 2, plot: 'D3', startTime: '070500', endTime: '070959', RunBy: 'M1' },
  { index: 3, plot: 'D4', startTime: '070500', endTime: '070959', RunBy: 'M2' },
  { index: 4, plot: 'D1', startTime: '073000', endTime: '073459', RunBy: 'M1' },
  { index: 5, plot: 'D2', startTime: '073000', endTime: '073459', RunBy: 'M2' },
  { index: 6, plot: 'D3', startTime: '073500', endTime: '073959', RunBy: 'M1' },
  { index: 7, plot: 'D4', startTime: '073500', endTime: '073959', RunBy: 'M2' },
  // Add more entries here...
];

const App = () => {
  return (
    <div>
      <Navbar />
      <IrrigationTable />

    </div>
  );
};

export default App;
