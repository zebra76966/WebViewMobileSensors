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
      <h1 className="display-6 fw-bold text-center">Sensor Tests</h1>

      <div className="container-fluid mt-4">
        <h2 className="display-6 fw-bold text-start text-muted">Motion</h2>
        <div className="row">
          <div className="col-12">
            <div class="card text-white bg-primary mb-3 w-100 shadow ">
              <div class="card-header fw-bold d-flex align-items-center justify-content-between ">
                Acceleration (m/s²)
                <i className="fa fa-tachometer"></i>
              </div>
              <div class="card-body">
                <div className="w-100 d-flex align-items-center justify-content-between">
                  <h5 class="card-titled w-100">X:</h5>
                  <h5 class="card-titled w-100">{motionData.acceleration.x.toFixed(2)}</h5>
                </div>
                <div className="w-100 d-flex align-items-center justify-content-between">
                  <h5 class="card-titled w-100">Y:</h5>
                  <h5 class="card-titled w-100">{motionData.acceleration.y.toFixed(2)}</h5>
                </div>
                <div className="w-100 d-flex align-items-center justify-content-between">
                  <h5 class="card-titled w-100">Z:</h5>
                  <h5 class="card-titled w-100">{motionData.acceleration.z.toFixed(2)}</h5>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div class="card text-white bg-dark mb-3 w-100 shadow ">
              <div class="card-header fw-bold d-flex align-items-center justify-content-between ">
                Rotation Rate (deg/s)
                <i className="fa fa-rotate-left"></i>
              </div>
              <div class="card-body">
                <div className="w-100 d-flex align-items-center justify-content-between">
                  <h5 class="card-titled w-100">Alpha:</h5>
                  <h5 class="card-titled w-100">{motionData.rotationRate.alpha.toFixed(2)}</h5>
                </div>
                <div className="w-100 d-flex align-items-center justify-content-between">
                  <h5 class="card-titled w-100">Beta:</h5>
                  <h5 class="card-titled w-100"> {motionData.rotationRate.beta.toFixed(2)}</h5>
                </div>
                <div className="w-100 d-flex align-items-center justify-content-between">
                  <h5 class="card-titled w-100">Gamma:</h5>
                  <h5 class="card-titled w-100">{motionData.rotationRate.gamma.toFixed(2)}</h5>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div class="card text-white bg-warning mb-3 w-100 shadow ">
              <div class="card-header fw-bold d-flex align-items-center justify-content-between ">
                Orientation(deg/s)
                <i className="fa fa-ellipsis-v"></i>
              </div>
              <div class="card-body">
                <div className="w-100 d-flex align-items-center justify-content-between">
                  <h5 class="card-titled w-100"> Alpha:</h5>
                  <h5 class="card-titled w-100"> {orientationData.alpha.toFixed(2)}</h5>
                </div>
                <div className="w-100 d-flex align-items-center justify-content-between">
                  <h5 class="card-titled w-100"> Beta:</h5>
                  <h5 class="card-titled w-100"> {orientationData.beta.toFixed(2)}</h5>
                </div>
                <div className="w-100 d-flex align-items-center justify-content-between">
                  <h5 class="card-titled w-100"> Gamma:</h5>
                  <h5 class="card-titled w-100"> {orientationData.gamma.toFixed(2)}</h5>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div class="card text-white bg-info mb-3 w-100 shadow ">
              <div class="card-header fw-bold d-flex align-items-center justify-content-between ">
                Location
                <i className="fa fa-location-arrow"></i>
              </div>
              <div class="card-body">
                <div className="w-100 d-flex align-items-center justify-content-between">
                  <h5 class="card-titled w-100"> Latitude: </h5>
                  <h5 class="card-titled w-100"> {location.latitude?.toFixed(2) || "Fetching..."}</h5>
                </div>
                <div className="w-100 d-flex align-items-center justify-content-between">
                  <h5 class="card-titled w-100"> Longitude: </h5>
                  <h5 class="card-titled w-100"> {location.longitude?.toFixed(2) || "Fetching..."}</h5>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div class="card text-white  mb-3 w-100 shadow " style={{ background: "coral" }}>
              <div class="card-header fw-bold d-flex align-items-center justify-content-between ">
                Ambient Light
                <i className="fa fa-sun-o"></i>
              </div>
              <div class="card-body">
                <div className="w-100 d-flex align-items-center justify-content-between">
                  <h5 class="card-titled w-100"> Illuminance: </h5>
                  <h5 class="card-titled w-100"> {ambientLight !== null ? `${ambientLight} lux` : "Fetching..."}</h5>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            {selectedImage && (
              <div className="my-2">
                <h3 className="text-muted fs-3 fw-bold">Uploaded Image:</h3>
                <img src={selectedImage} className="uploaded" alt="Uploaded Preview" style={{ width: "300px", marginTop: "10px" }} />
              </div>
            )}

            <div class="card text-white bg-dark mb-3 w-100 shadow ">
              <div class="card-header fw-bold d-flex align-items-center justify-content-between ">
                Camera
                <i className="fa fa-tachometer"></i>
              </div>
              <div class="card-body">
                <div className="w-100 ">
                  <label for="file" class="custum-file-upload">
                    <div class="icon display-2">
                      <i className="fa fa-camera-retro" />
                    </div>
                    <div class="text">
                      <span>Click to upload image</span>
                    </div>
                    <input id="file" type="file" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
