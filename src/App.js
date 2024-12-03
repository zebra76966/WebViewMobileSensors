import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [motionData, setMotionData] = useState({
    acceleration: { x: 0, y: 0, z: 0 },
    rotationRate: { alpha: 0, beta: 0, gamma: 0 },
  });

  const [orientationData, setOrientationData] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });

  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const [ambientLight, setAmbientLight] = useState(null); // For ambient light sensor data
  const [selectedImage, setSelectedImage] = useState(null); // For uploaded image

  const ACCELERATION_THRESHOLD = 0.5;

  useEffect(() => {
    const handleMotion = (event) => {
      const { acceleration, rotationRate } = event;

      const filterValue = (value) => (Math.abs(value) > ACCELERATION_THRESHOLD ? value : 0);

      setMotionData({
        acceleration: {
          x: filterValue(acceleration?.x || 0),
          y: filterValue(acceleration?.y || 0),
          z: filterValue(acceleration?.z || 0),
        },
        rotationRate: {
          alpha: rotationRate?.alpha || 0,
          beta: rotationRate?.beta || 0,
          gamma: rotationRate?.gamma || 0,
        },
      });
    };

    const handleOrientation = (event) => {
      const { alpha, beta, gamma } = event;

      setOrientationData({
        alpha: alpha || 0,
        beta: beta || 0,
        gamma: gamma || 0,
      });
    };

    const getGeolocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
          },
          (error) => {
            console.error("Error fetching geolocation:", error.message);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    // Ambient Light Sensor
    // const initAmbientLightSensor = () => {
    //   if ("AmbientLightSensor" in window) {
    //     try {
    //       const sensor = new AmbientLightSensor();
    //       sensor.addEventListener("reading", () => {
    //         setAmbientLight(sensor.illuminance);
    //       });
    //       sensor.addEventListener("error", (event) => {
    //         console.error("Ambient Light Sensor error:", event.error.message);
    //       });
    //       sensor.start();
    //     } catch (error) {
    //       console.error("Error initializing Ambient Light Sensor:", error.message);
    //     }
    //   } else {
    //     console.warn("Ambient Light Sensor is not supported by this browser.");
    //   }
    // };

    // Add Event Listeners for motion and orientation
    window.addEventListener("devicemotion", handleMotion);
    window.addEventListener("deviceorientation", handleOrientation);

    // Initial geolocation and sensor initialization
    getGeolocation();
    // initAmbientLightSensor();

    // Update geolocation every 1 minute (60000ms)
    const geoInterval = setInterval(getGeolocation, 60000);

    // Cleanup function
    return () => {
      clearInterval(geoInterval);
      window.removeEventListener("devicemotion", handleMotion);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  // Placeholder function for uploading image
  const uploadImageToServer = async (imageFile) => {
    try {
      console.log("Uploading image to server:", imageFile);
      // Add API call logic here, e.g., Axios or fetch.
    } catch (error) {
      console.error("Error uploading image:", error.message);
    }
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      // Placeholder for uploading image
      uploadImageToServer(file);
    }
  };

  return (
    <div className="App">
      <h1>Sensor Data</h1>

      <h2>Motion</h2>
      <p>
        Acceleration (m/s²): <br />
        X: {motionData.acceleration.x.toFixed(2)}, Y: {motionData.acceleration.y.toFixed(2)}, Z: {motionData.acceleration.z.toFixed(2)}
      </p>
      <p>
        Rotation Rate (deg/s): <br />
        Alpha: {motionData.rotationRate.alpha.toFixed(2)}, Beta: {motionData.rotationRate.beta.toFixed(2)}, Gamma: {motionData.rotationRate.gamma.toFixed(2)}
      </p>

      <h2>Orientation</h2>
      <p>
        Alpha: {orientationData.alpha.toFixed(2)}, Beta: {orientationData.beta.toFixed(2)}, Gamma: {orientationData.gamma.toFixed(2)}
      </p>

      <h2>Location</h2>
      <p>
        Latitude: {location.latitude?.toFixed(2) || "Fetching..."} <br />
        Longitude: {location.longitude?.toFixed(2) || "Fetching..."}
      </p>

      <h2>Ambient Light</h2>
      <p>Illuminance: {ambientLight !== null ? `${ambientLight} lux` : "Fetching..."}</p>

      <h2>Camera</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {selectedImage && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={selectedImage} alt="Uploaded Preview" style={{ width: "300px", marginTop: "10px" }} />
        </div>
      )}
    </div>
  );
}

export default App;
