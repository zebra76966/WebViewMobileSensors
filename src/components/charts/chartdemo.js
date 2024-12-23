import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import datas from "./actualdata.json";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const data = datas;

const filterData = data.filter((entry) => entry.latitude !== null && entry.longitude !== null);

const labels = filterData.map((entry) => `${entry.latitude}, ${entry.longitude}`);
const accelerationData = {
  labels,
  datasets: [
    {
      label: "Acceleration X",
      data: filterData.map((entry) => parseFloat(entry.acceleration_x)),
      borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      fill: true,
    },
    {
      label: "Acceleration Y",
      data: filterData.map((entry) => parseFloat(entry.acceleration_y)),
      borderColor: "rgba(54, 162, 235, 1)",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      fill: true,
    },
    {
      label: "Acceleration Z",
      data: filterData.map((entry) => parseFloat(entry.acceleration_z)),
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      fill: true,
    },
  ],
};

const rotationOrientationData = {
  labels,
  datasets: [
    {
      label: "Rotation Alpha",
      data: filterData.map((entry) => parseFloat(entry.rotation_alpha)),
      borderColor: "rgba(255, 159, 64, 1)",
      backgroundColor: "rgba(255, 159, 64, 0.2)",
      fill: true,
    },
    {
      label: "Rotation Beta",
      data: filterData.map((entry) => parseFloat(entry.rotation_beta)),
      borderColor: "rgba(153, 102, 255, 1)",
      backgroundColor: "rgba(153, 102, 255, 0.2)",
      fill: true,
    },
    {
      label: "Rotation Gamma",
      data: filterData.map((entry) => parseFloat(entry.rotation_gamma)),
      borderColor: "rgb(64, 217, 255)",
      backgroundColor: "rgba(64, 153, 255, 0.2)",
      fill: true,
    },
    {
      label: "Orientation Alpha",
      data: filterData.map((entry) => parseFloat(entry.orientation_alpha)),
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      fill: true,
    },
    {
      label: "Orientation Beta",
      data: filterData.map((entry) => parseFloat(entry.orientation_beta)),
      borderColor: "rgba(153, 102, 255, 1)",
      backgroundColor: "rgba(153, 102, 255, 0.2)",
      fill: true,
    },
    {
      label: "Orientation Gamma",
      data: filterData.map((entry) => parseFloat(entry.orientation_gamma)),
      borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      fill: true,
    },
  ],
};

const AccelerationChart = () => (
  <div>
    <h2>Acceleration Data</h2>
    <Line data={accelerationData} />
  </div>
);

const RotationOrientationChart = () => (
  <div>
    <h2>Rotation and Orientation Data</h2>
    <Line data={rotationOrientationData} />
  </div>
);

export { AccelerationChart, RotationOrientationChart };
