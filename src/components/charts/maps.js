import React, { useMemo } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";

// Custom icon for markers
const customIcon = new Icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "geo-alt-fill.svg",
});

// Function to determine if road conditions are bad based on the thresholds
const isBadRoadCondition = (dataPoint) => {
  const accelerationZ = parseFloat(dataPoint.acceleration_z);
  const rotationAlpha = Math.abs(parseFloat(dataPoint.rotation_alpha));
  const rotationBeta = Math.abs(parseFloat(dataPoint.rotation_beta));
  const rotationGamma = Math.abs(parseFloat(dataPoint.rotation_gamma));
  const orientationAlpha = Math.abs(parseFloat(dataPoint.orientation_alpha));
  const orientationBeta = Math.abs(parseFloat(dataPoint.orientation_beta));
  const orientationGamma = Math.abs(parseFloat(dataPoint.orientation_gamma));

  // Bad road condition thresholds
  const isBadAcceleration = accelerationZ > 9;
  const isBadRotation = rotationAlpha > 8 || rotationBeta > 8 || rotationGamma > 8;
  const isBadOrientation = orientationAlpha > 25 || orientationBeta > 25 || orientationGamma > 25;

  console.log("Acceleration Z: ", isBadAcceleration || isBadRotation || isBadOrientation);

  return isBadAcceleration;
};

const MapPath = ({ data }) => {
  // Filter out data with null latitude and longitude
  const validCoordinates = data.filter((entry) => entry.latitude !== null && entry.longitude !== null).map((entry) => [entry.latitude, entry.longitude]);

  // Create path segments with colors based on road conditions
  const pathSegments = useMemo(() => {
    return validCoordinates.map((coordinate, index) => {
      if (index < validCoordinates.length - 1) {
        const currentData = data[index];
        const nextData = data[index + 1];

        // Determine if either current or next segment has bad road conditions
        const currentBad = isBadRoadCondition(currentData);
        const nextBad = isBadRoadCondition(nextData);

        // Define the color for this segment based on the road condition
        const lineColor =
          currentBad && nextBad
            ? "red" // Both are bad
            : !currentBad && !nextBad
            ? "#11f7b2" // Both are good
            : "#f71193"; // One is bad, one is good

        return <Polyline key={index} positions={[validCoordinates[index], validCoordinates[index + 1]]} color={lineColor} weight={4} />;
      }
      return null;
    });
  }, [validCoordinates]);

  // Start and end markers' coordinates
  const start = validCoordinates[0]; // First coordinate in the list
  const end = validCoordinates[validCoordinates.length - 1];

  return (
    <div className="w-100 h-100 d-flex justify-content-between align-items-center text-light p-5 pt-1">
      <div
        className="h-100 bg-dark p-4 pt-5 w-50"
        style={{
          padding: "10px",

          borderRadius: "5px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          borderRadius: "1.5em 0em 0 1.5em",
        }}
      >
        <h3 className="mb-5">Road Condition</h3>
        <div style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#11f7b2",
                marginRight: "10px",
                borderRadius: "100%",
              }}
            ></div>
            <span>
              <strong>Good Road</strong>: <span className="d-block"> Green - Road conditions are normal. No significant bumps or instability.</span>
            </span>
          </div>
        </div>
        <div className="my-4">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "red",
                marginRight: "10px",
                borderRadius: "100%",
              }}
            ></div>
            <span>
              <strong>Bad Road</strong>: <span className="d-block"> Red - Indicating significant bumps, potholes, or unstable road conditions.</span>
            </span>
          </div>
        </div>

        <div className="my-4">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#f71193",
                marginRight: "10px",
                borderRadius: "100%",
              }}
            ></div>
            <span>
              <strong>Moderate Road</strong>: <span className="d-block"> HotPink - Indicating significant bumps, potholes, or unstable road conditions.</span>
            </span>
          </div>
        </div>

        <hr />
        <h4 className="mt-5 mb-4">Thresholds for Bad Road Conditions:</h4>
        <ul>
          <li className="mb-2">
            <strong>Acceleration (acceleration_z):</strong>
            <span className="d-block">Any value &gt; 9 m/s² (Significant bumps or potholes)</span>
          </li>
          <li className="mb-2">
            <strong>Rotation (rotation_alpha, rotation_beta, rotation_gamma):</strong>
            <span className="d-block">Any value &gt; ±8° (Instability in road surface)</span>
          </li>
          <li className="mb-2">
            <strong>Orientation (orientation_alpha, orientation_beta, orientation_gamma):</strong>
            <span className="d-block">Any value &gt; ±25° (Tilted or uneven road surface)</span>
          </li>
        </ul>
      </div>

      <div style={{ height: "80dvh", width: "90%", borderRadius: "0em 1.5em 1.5em 0" }}>
        <MapContainer center={start} zoom={20} style={{ width: "100%", height: "100%", borderRadius: "0em 1.5em 1.5em 0" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />

          {/* Draw the path on the map using Polyline */}
          {pathSegments}

          {/* Add Marker for the start point */}
          <Marker position={start} icon={customIcon}>
            <Popup>
              Start Location: Latitude {start[0]}, Longitude {start[1]}
            </Popup>
          </Marker>

          {/* Add Marker for the end point */}
          <Marker position={end} icon={customIcon}>
            <Popup>
              End Location: Latitude {end[0]}, Longitude {end[1]}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPath;
