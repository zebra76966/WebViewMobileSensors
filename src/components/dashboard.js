import React, { useEffect, useState } from "react";
import axios from "axios";
import { AccelerationChart, RotationOrientationChart } from "./charts/chartdemo";
import MapPath from "./charts/maps";
import datas from "./charts/actualdata.json";
const Dashboard = () => {
  const [data, setData] = useState(datas.reverse());

  // const GetData = async () => {
  //   try {
  //     const response = await axios.post("https://b2bgloble.in/getdata.php", {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (response.data.success) {
  //       console.log(response.data);
  //       setData(response.data.data);
  //     }
  //   } catch (error) {
  //     console.error("Error submitting data:", error);
  //   }
  // };

  // useEffect(() => {
  //   GetData();
  // }, []);

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
