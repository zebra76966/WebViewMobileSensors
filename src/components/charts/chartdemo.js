import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const processData = (data) => {
  const filteredData = data.filter((entry) => entry.latitude !== null && entry.longitude !== null);

  const labels = filteredData.map((entry) => `${entry.latitude}, ${entry.longitude}`);

  const accelerationData = {
    labels,
    datasets: [
      {
        label: "Acceleration X",
        data: filteredData.map((entry) => parseFloat(entry.acceleration_x)),
        borderColor: "rgba(200, 50, 50, 1)", // Dark red
        backgroundColor: "rgba(200, 50, 50, 0.3)", // Semi-transparent dark red
        fill: true,
      },
      {
        label: "Acceleration Y",
        data: filteredData.map((entry) => parseFloat(entry.acceleration_y)),
        borderColor: "rgba(50, 100, 200, 1)", // Dark blue
        backgroundColor: "rgba(50, 100, 200, 0.3)", // Semi-transparent dark blue
        fill: true,
      },
      {
        label: "Acceleration Z",
        data: filteredData.map((entry) => parseFloat(entry.acceleration_z)),
        borderColor: "rgba(50, 150, 150, 1)", // Dark teal
        backgroundColor: "rgba(50, 150, 150, 0.3)", // Semi-transparent dark teal
        fill: true,
      },
    ],
  };

  const rotationOrientationData = {
    labels,
    datasets: [
      {
        label: "Rotation Alpha",
        data: filteredData.map((entry) => parseFloat(entry.rotation_alpha)),
        borderColor: "rgba(200, 100, 50, 1)", // Dark orange
        backgroundColor: "rgba(200, 100, 50, 0.3)", // Semi-transparent dark orange
        fill: true,
      },
      {
        label: "Rotation Beta",
        data: filteredData.map((entry) => parseFloat(entry.rotation_beta)),
        borderColor: "rgba(100, 50, 200, 1)", // Dark purple
        backgroundColor: "rgba(100, 50, 200, 0.3)", // Semi-transparent dark purple
        fill: true,
      },
      {
        label: "Rotation Gamma",
        data: filteredData.map((entry) => parseFloat(entry.rotation_gamma)),
        borderColor: "rgba(50, 150, 200, 1)", // Dark cyan
        backgroundColor: "rgba(50, 150, 200, 0.3)", // Semi-transparent dark cyan
        fill: true,
      },
      {
        label: "Orientation Alpha",
        data: filteredData.map((entry) => parseFloat(entry.orientation_alpha)),
        borderColor: "rgba(50, 150, 150, 1)", // Dark teal
        backgroundColor: "rgba(50, 150, 150, 0.3)", // Semi-transparent dark teal
        fill: true,
      },
      {
        label: "Orientation Beta",
        data: filteredData.map((entry) => parseFloat(entry.orientation_beta)),
        borderColor: "rgba(100, 50, 200, 1)", // Dark purple
        backgroundColor: "rgba(100, 50, 200, 0.3)", // Semi-transparent dark purple
        fill: true,
      },
      {
        label: "Orientation Gamma",
        data: filteredData.map((entry) => parseFloat(entry.orientation_gamma)),
        borderColor: "rgba(200, 50, 50, 1)", // Dark red
        backgroundColor: "rgba(200, 50, 50, 0.3)", // Semi-transparent dark red
        fill: true,
      },
    ],
  };

  return { accelerationData, rotationOrientationData };
};

const AccelerationChart = ({ data }) => {
  const { accelerationData } = processData(data);

  return (
    <div>
      <h2 style={{ color: "white" }}>Acceleration Data</h2>
      <Line
        data={accelerationData}
        options={{
          plugins: {
            legend: {
              labels: { color: "white" }, // White text for labels
            },
          },
          scales: {
            x: {
              ticks: { color: "white" }, // White text for X-axis labels
              grid: { color: "rgba(255, 255, 255, 0.1)" }, // Light grid color for X-axis
            },
            y: {
              ticks: { color: "white" }, // White text for Y-axis labels
              grid: { color: "rgba(255, 255, 255, 0.1)" }, // Light grid color for Y-axis
            },
          },
        }}
      />
    </div>
  );
};

const RotationOrientationChart = ({ data }) => {
  const { rotationOrientationData } = processData(data);

  return (
    <div>
      <h2 style={{ color: "white" }}>Rotation and Orientation Data</h2>
      <Line
        data={rotationOrientationData}
        options={{
          plugins: {
            legend: {
              labels: { color: "white" }, // White text for labels
            },
          },
          scales: {
            x: {
              ticks: { color: "white" }, // White text for X-axis labels
              grid: { color: "rgba(255, 255, 255, 0.1)" }, // Light grid color for X-axis
            },
            y: {
              ticks: { color: "white" }, // White text for Y-axis labels
              grid: { color: "rgba(255, 255, 255, 0.1)" }, // Light grid color for Y-axis
            },
          },
        }}
      />
    </div>
  );
};

export { AccelerationChart, RotationOrientationChart };
