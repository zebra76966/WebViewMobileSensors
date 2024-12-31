import { useState, useEffect } from "react";
import "./App.css";
import Main from "./components/main";
import Dashboard from "./components/dashboard";
import FeedBack from "./components/auth/feedback";

function App() {
  const [toggle, setToggle] = useState(true);

  const [sessionG, setSessionG] = useState("");
  const [uemailG, setUemailG] = useState("");

  useEffect(() => {
    if (window.location.pathname == "/dashboard") {
      setToggle(false);
    } else {
      setToggle(true);
    }
  }, []);

  return (
    <>
      {sessionG == "" && uemailG == "" && <FeedBack setSessionG={(e) => setSessionG(e)} setUemailG={(e) => setUemailG(e)} />}

      {sessionG !== "" && uemailG !== "" && <>{toggle ? <Main uemailG={uemailG} sessionG={sessionG} /> : <Dashboard uemailG={uemailG} sessionG={sessionG} />}</>}
    </>
  );
}

export default App;
