import React, { useState } from "react";
import "./feedback.css";

const FeedBack = ({ setUemailG, setSessionG }) => {
  const [email, setUemail] = useState("");
  const [session, setSession] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setUemailG(email);
    setSessionG(session);
  };

  return (
    <div className="w-100 bg-dark d-flex align-items-center justify-content-center" style={{ height: "100dvh" }}>
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

        <div class="mb-4">
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
        </div>

        <button type="submit" class="btn bg-dark text-primary w-100 fw-bold text-light border-light border-1 border">
          SUBMIT
        </button>
      </form>
    </div>
  );
};

export default FeedBack;
