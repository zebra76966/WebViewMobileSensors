import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState([]);

  const GetData = async () => {
    try {
      const response = await axios.post("https://b2bgloble.in/serverPhp/getdata.php", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        console.log(response.data);
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  useEffect(() => {
    GetData();
  }, []);

  return (
    <div className="container">
      <h1 className="display-1">Dashboard</h1>
      <div className="row">
        {data &&
          data.map((ini) => {
            return (
              <div className="col-lg-4">
                <img src={ini.image_path} className="w-100" style={{ height: "200px", objectFit: "cover" }} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Dashboard;
