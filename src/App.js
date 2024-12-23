import { useState, useEffect } from "react";
import "./App.css";
import Main from "./components/main";
import Dashboard from "./components/dashboard";

function App() {
  const [toggle, setToggle] = useState(false);

  return (
    <>
      <div className="w-100 text-end d-none d-lg-block">
        <button className="btn btn-lg btn-dark m-3" onClick={() => setToggle(!toggle)}>
          Dashboard
        </button>
      </div>
      {toggle ? <Main /> : <Dashboard />}
    </>
  );
}

export default App;
