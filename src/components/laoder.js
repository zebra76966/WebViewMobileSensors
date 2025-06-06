import React from "react";
import "./loader.css";

const Loader = () => {
  return (
    <div class="gearbox">
      <div class="overlay"></div>
      <div class="gear one">
        <div class="gear-inner">
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
        </div>
      </div>
      <div class="gear two">
        <div class="gear-inner">
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
        </div>
      </div>
      <div class="gear three">
        <div class="gear-inner">
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
        </div>
      </div>
      <div class="gear four large">
        <div class="gear-inner">
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
