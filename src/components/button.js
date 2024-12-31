import React from "react";
import "./button.css";

const Button = ({ isStart, handleStart, handleStop }) => {
  const handleState = () => {
    if (isStart) {
      handleStop();
    } else {
      handleStart();
    }
  };

  return (
    <>
      <label for="button" class="wrap" onClick={handleState}>
        <input id="button" aria-label="Bluetooth" type="checkbox" checked={!isStart} />
        <button class="button">
          <div class="corner"></div>
          <div class="inner">
            <h5 className="fs-3 StartFont"> {isStart ? "STOP" : "START"} </h5>
          </div>
        </button>
        <div class="led"></div>
        <div class="bg">
          <div class="shine-1"></div>
          <div class="shine-2"></div>
        </div>
        <div class="bg-glow"></div>
      </label>

      <div class="noise">
        <svg height="100%" width="100%">
          <defs>
            <pattern height="500" width="500" patternUnits="userSpaceOnUse" id="noise-pattern">
              <filter y="0" x="0" id="noise">
                <feTurbulence stitchTiles="stitch" numOctaves="3" baseFrequency="0.65" type="fractalNoise"></feTurbulence>
                <feBlend mode="screen"></feBlend>
              </filter>
              <rect filter="url(#noise)" height="500" width="500"></rect>
            </pattern>
          </defs>
          <rect fill="url(#noise-pattern)" height="100%" width="100%"></rect>
        </svg>
      </div>
    </>
  );
};

export default Button;
