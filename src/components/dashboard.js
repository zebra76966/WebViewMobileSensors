import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { AccelerationChart, RotationOrientationChart } from "./charts/chartdemo";
import MapPath from "./charts/maps";
import datas from "./charts/actualdata.json";
const Dashboard = ({ uemailG, sessionG }) => {
  const [data, setData] = useState([]);

  // Define the function inside useEffect or use useCallback to memoize it
  const GetData = async () => {
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
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      GetData();
    }
  }, []);

  return (
    <div className="container-fluid">
      {data && data.length !== 0 && (
        <div className="row">
          <div className="col-lg-6">
            <AccelerationChart data={data} />
          </div>
          <div className="col-lg-6">
            <RotationOrientationChart data={data} />
          </div>

          <div className="col-lg-12 my-4 mx-auto d-flex align-items-center justify-content-center">
            <MapPath data={data} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
