import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [acceleration, setAcceleration] = useState({ x: null, y: null, z: null });
  const [rotationRate, setRotationRate] = useState({ alpha: null, beta: null, gamma: null });
  const [orientation, setOrientation] = useState({ alpha: null, beta: null, gamma: null });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Check if DeviceMotionEvent is supported
    const handleDeviceMotion = (event) => {
      const { acceleration, rotationRate } = event;
      setAcceleration({
        x: acceleration?.x ?? null,
        y: acceleration?.y ?? null,
        z: acceleration?.z ?? null,
      });
      setRotationRate({
        alpha: rotationRate?.alpha ?? null,
        beta: rotationRate?.beta ?? null,
        gamma: rotationRate?.gamma ?? null,
      });
    };

    // Check if DeviceOrientationEvent is supported
    const handleDeviceOrientation = (event) => {
      setOrientation({
        alpha: event.alpha ?? null,
        beta: event.beta ?? null,
        gamma: event.gamma ?? null,
      });
    };

    if (window.DeviceMotionEvent || window.DeviceOrientationEvent) {
      if (typeof DeviceMotionEvent.requestPermission === "function") {
        // For iOS: Request permission
        DeviceMotionEvent.requestPermission()
          .then((response) => {
            if (response === "granted") {
              window.addEventListener("devicemotion", handleDeviceMotion);
              window.addEventListener("deviceorientation", handleDeviceOrientation);
            } else {
              setErrorMessage("Permission denied for motion sensors.");
            }
          })
          .catch((error) => setErrorMessage(error.message));
      } else {
        // Non-iOS browsers
        window.addEventListener("devicemotion", handleDeviceMotion);
        window.addEventListener("deviceorientation", handleDeviceOrientation);
      }
    } else {
      setErrorMessage("Motion and orientation sensors are not supported on this device.");
    }

    return () => {
      // Cleanup event listeners
      window.removeEventListener("devicemotion", handleDeviceMotion);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, []);

  return (
    <div className="App">
      <h1>Gyroscope & Accelerometer Data</h1>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <div>
        <h2>Acceleration</h2>
        <p>X: {acceleration.x}</p>
        <p>Y: {acceleration.y}</p>
        <p>Z: {acceleration.z}</p>
      </div>
      <div>
        <h2>Rotation Rate</h2>
        <p>Alpha (z-axis): {rotationRate.alpha}</p>
        <p>Beta (x-axis): {rotationRate.beta}</p>
        <p>Gamma (y-axis): {rotationRate.gamma}</p>
      </div>
      <div>
        <h2>Orientation</h2>
        <p>Alpha (rotation around z-axis): {orientation.alpha}</p>
        <p>Beta (tilt front-to-back): {orientation.beta}</p>
        <p>Gamma (tilt side-to-side): {orientation.gamma}</p>
      </div>
    </div>
  );
}

export default App;
