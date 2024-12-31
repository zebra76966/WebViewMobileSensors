import { useState, useEffect } from "react";
import "./App.css";
import Main from "./components/main";
import Dashboard from "./components/dashboard";

function App() {
  const [toggle, setToggle] = useState(true);

  useEffect(() => {
    if (window.location.pathname == "/dashboard") {
      setToggle(false);
    } else {
      setToggle(true);
    }
  }, []);

  return <>{toggle ? <Main /> : <Dashboard />}</>;
}

export default App;
