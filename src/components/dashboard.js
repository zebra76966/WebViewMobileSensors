import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { AccelerationChart, RotationOrientationChart } from "./charts/chartdemo";
import MapPath from "./charts/maps";
import datas from "./charts/actualdata.json";
import Loader from "./laoder";
const Dashboard = ({ uemailG, sessionG }) => {
  const [data, setData] = useState(datas);
  const [isLoading, setIsLoading] = useState(false);

  // Define the function inside useEffect or use useCallback to memoize it
  const GetData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://b2bgloble.in/getdata.php",
        {
          email: uemailG,
          session: sessionG,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        console.log(response.data);
        setData(response.data.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setIsLoading(false);
    }
  };

  const hasFetched = useRef(false);

  // useEffect(() => {
  //   if (!hasFetched.current) {
  //     hasFetched.current = true;
  //     GetData();
  //   }
  // }, []);

  const [activeDash, setActiveDash] = useState("map");

  return (
    <div className="container-fluid bg-black slim-scroll">
      <div className="d-flex justify-content-center w-100 py-4">
        <div className="border-light border border-2 p-1 d-flex gap-2 rounded-pill">
          <button className={`btn btn-lg rounded-pill ${activeDash == "map" ? "btn-light" : "btn-outline-light border-0"}`} onClick={() => setActiveDash("map")}>
            Path <i className="fa fa-map-o ms-2" />
          </button>

          <button className={`btn  btn-lg rounded-pill ${activeDash == "chart" ? "btn-light" : "btn-outline-light border-0"}`} onClick={() => setActiveDash("chart")}>
            Charts <i className="fa fa-area-chart" />
          </button>
        </div>
      </div>

      <div className="w-100 slim-scroll" style={{ minHeight: "100dvh" }}>
        {isLoading && (
          <div className="w-100 d-flex align-items-center justify-content-center p-5">
            {" "}
            <Loader />
          </div>
        )}

        {data && data.length !== 0 && (
          <div className="w-100 slim-scroll">
            {activeDash == "chart" && (
              <div className="row">
                <div className="col-xl-10 mx-auto p-4">
                  <AccelerationChart data={data} />
                </div>
                <div className="col-xl-10 mx-auto p-4">
                  <RotationOrientationChart data={data} />
                </div>
              </div>
            )}

            {activeDash == "map" && (
              <div className="row slim-scroll">
                <div className="col-lg-12 my-4 mx-auto d-flex align-items-center justify-content-center">
                  <MapPath data={data} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
