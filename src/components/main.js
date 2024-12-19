import { useState, useEffect } from "react";
import axios from "axios";

function Main() {
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

  const [selectedImage, setSelectedImage] = useState(null); // For Base64 image

  const [ambientLight, setAmbientLight] = useState(null); // For ambient light sensor data

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

    const initAmbientLightSensor = () => {
      try {
        const sensor = new AmbientLightSensor();
        sensor.addEventListener("reading", () => {
          setAmbientLight(sensor.illuminance);
        });
        sensor.addEventListener("error", (event) => {
          console.error("Ambient Light Sensor error:", event.error.message);
        });
        sensor.start();
      } catch (error) {
        console.warn("Ambient Light Sensor is not supported on this device.");
      }
    };

    window.addEventListener("devicemotion", handleMotion);
    window.addEventListener("deviceorientation", handleOrientation);

    getGeolocation();
    initAmbientLightSensor();

    const geoInterval = setInterval(getGeolocation, 60000); // 1-minute interval

    return () => {
      clearInterval(geoInterval);
      window.removeEventListener("devicemotion", handleMotion);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Create a new image object
        const image = new Image();
        const objectUrl = URL.createObjectURL(file);
        image.src = objectUrl;

        // Wait for the image to load
        await new Promise((resolve) => {
          image.onload = resolve;
        });

        // Create a canvas element to compress the image
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Resize image dimensions (make it smaller to reduce size)
        const maxWidth = 200; // Further reduce the max width to 400px or any other lower value
        const scaleFactor = maxWidth / image.width;
        canvas.width = maxWidth;
        canvas.height = image.height * scaleFactor;

        // Draw the image onto the canvas
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Convert the canvas content to a compressed base64 image (WebP format for better compression)
        const compressedBase64Image = canvas.toDataURL("image/webp", 0.2); // 0.5 for aggressive compression

        setSelectedImage(compressedBase64Image); // Save compressed base64 in state
        URL.revokeObjectURL(objectUrl); // Clean up the object URL
      } catch (error) {
        console.error("Error converting image to Base64:", error.message);
      }
    }
  };

  const handleSubmit = async () => {
    if (!location.latitude || !location.longitude) {
      console.log("Location data is incomplete. Waiting for valid latitude and longitude...");
      return;
    }

    try {
      const payload = {
        motionData,
        orientationData,
        location,
        selectedImage, // Base64 image
      };

      const response = await axios.post("https://b2bgloble.in/save.php", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        console.log("Data submitted successfully!");
      } else {
        console.log(`Submission failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("An error occurred while submitting the data. Please Restart the test (Recommended).");
    }
  };

  const [isStart, setIsStart] = useState(false);

  useEffect(() => {
    let intervalId;

    if (isStart) {
      intervalId = setInterval(() => {
        handleSubmit();
      }, 2000);
    }

    return () => {
      // Clear the interval whenever `isStart` changes or the component unmounts
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isStart]);

  return (
    <>
      {!isStart && (
        <div className="App w-100 d-flex align-items-center justify-content-center" style={{ height: "100dvh" }}>
          <button className="btn btn-dark fw-bold btn-lg" onClick={() => setIsStart(true)}>
            START TEST
          </button>
        </div>
      )}

      {isStart && (
        <div className="App">
          <h1 className="display-6 fw-bold text-center">Sensor Tests</h1>
          <button className="btn btn-danger fw-bold btn-lg" onClick={() => setIsStart(false)}>
            STOP TEST
          </button>

          <div className="container-fluid mt-4">
            <h2 className="display-6 fw-bold text-start text-muted">Motion</h2>
            <div className="row">
              <div className="col-12">
                <div class="card text-white bg-primary mb-3 w-100 shadow ">
                  <div class="card-header fw-bold d-flex align-items-center justify-content-between ">
                    Acceleration (m/s²)
                    <i className="fa fa-tachometer fs-2"></i>
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
                    <i className="fa fa-rotate-left fs-2"></i>
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
                    <i className="fa fa-ellipsis-v fs-2"></i>
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
                    <i className="fa fa-location-arrow fs-2"></i>
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
                    <i className="fa fa-sun-o fs-2"></i>
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

                {console.log(selectedImage)}

                <div class="card text-white bg-dark mb-3 w-100 shadow ">
                  <div class="card-header fw-bold d-flex align-items-center justify-content-between ">
                    Camera
                    <i className="fa fa-camera fs-2"></i>
                  </div>
                  <div class="card-body">
                    <div className="w-100 ">
                      <label htmlFor="file" class="custum-file-upload">
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

              {/* <div className="col-12 text-center py-5">
            <button className="btn btn-lg btn-dark rounded shadow" onClick={handleSubmit}>
              Submit
            </button>
          </div> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Main;