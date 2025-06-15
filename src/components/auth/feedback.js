import React, { useState, useEffect, useRef } from "react";
import "./feedback.css";
import axios from "axios";

const FeedBack = ({ setUemailG, setSessionG, toggle }) => {
  const [email, setUemail] = useState("");
  const [session, setSession] = useState("");
  const [firstLoad, setFirstLoad] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const lastSession = localStorage.getItem("lastSession");

    if (savedEmail && email === "") {
      setUemail(savedEmail);
    }
    if (toggle) {
      if (lastSession && /^test\d+$/.test(lastSession)) {
        const sessionNumber = parseInt(lastSession.replace("test", ""), 10) + 1;
        setSession(`test${sessionNumber}`);
      } else {
        setSession("test1");
      }
    } else {
      setSession("");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    localStorage.setItem("savedEmail", email);
    localStorage.setItem("lastSession", session);

    setUemailG(email);
    setSessionG(session);
  };

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Define the function inside useEffect or use useCallback to memoize it
  const GetData = async () => {
    setIsLoading(true);
    setFirstLoad(true);
    try {
      const response = await axios.post(
        "https://eknows.in/getSessionNames.php",
        {
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        console.log(response.data);
        setData(response.data.sessions);
        setIsLoading(false);
      } else {
        setData([]);
        setIsLoading(false);
        console.error("No sessions found for the provided email.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-100 bg-dark d-flex align-items-center justify-content-center" style={{ height: "100dvh" }}>
      {console.log("toggle:", toggle)}
      <form onSubmit={handleSubmit} className="help-form bg-darkOpac p-4 shadow text-light pt-5">
        <div class="mb-4">
          <label for="exampleInputEmail1" class="form-label fw-bold">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setUemail(e.target.value);
            }}
            class="form-control p-2 px-3"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="joeswanson@hotmail.com"
          />
          <div id="emailHelp" class="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>

        {/* <div class="mb-4">
          <label for="session" class="form-label fw-bold">
            Session Name
          </label>
          <input
            type="text"
            value={session}
            onChange={(e) => {
              setSession(e.target.value);
            }}
            class="form-control p-2 px-3"
            id="session"
            placeholder="NH11-10KM"
          />
          <div id="sessionHelp" class="form-text">
            Add a session name for this Test
          </div>
        </div> */}

        {!toggle && (
          <div class="mb-4">
            {data && data.length > 0 ? (
              <>
                <label for="session" class="form-label fw-bold">
                  Session Name
                </label>
                <select
                  value={session}
                  onChange={(e) => {
                    setSession(e.target.value);
                  }}
                  class="form-select p-2 px-3"
                  id="session"
                  placeholder="NH11-10KM"
                >
                  <option value="" disabled>
                    Select a session
                  </option>
                  {data.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <div id="sessionHelp" class="form-text">
                  Select Session
                </div>
              </>
            ) : !isLoading && firstLoad ? (
              "Sorry there are no tests avaialble for the provided email."
            ) : (
              "Add your email and fetch sessions to get started."
            )}
          </div>
        )}

        {toggle && (
          <>
            {session !== "" && email !== "" ? (
              <button type="submit" class="btn bg-dark text-primary w-100 fw-bold text-light border-light border-1 border">
                SUBMIT
              </button>
            ) : (
              <button type="button" class="btn bg-dark text-primary w-100 fw-bold text-light border-light border-1 border" disabled>
                SUBMIT
              </button>
            )}
          </>
        )}

        {!toggle && (
          <>
            {session !== "" && email !== "" ? (
              <button type="submit" class="btn bg-dark text-primary w-100 fw-bold text-light border-light border-1 border">
                SUBMIT
              </button>
            ) : isLoading ? (
              <button type="button" onClick={GetData} class="btn bg-dark text-primary w-100 fw-bold text-light border-light border-1 border" disabled>
                FETCH SESSIONS <i className="fa fa-spinner fa-spin ms-2" />
              </button>
            ) : (
              <button type="button" onClick={GetData} class="btn bg-dark text-primary w-100 fw-bold text-light border-light border-1 border">
                FETCH SESSIONS
              </button>
            )}
          </>
        )}
      </form>
    </div>
  );
};

export default FeedBack;
