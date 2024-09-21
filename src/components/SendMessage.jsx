import React, { useState } from "react";
import supabase from "../supabase";
import { Send } from "react-feather";

function SendMessage() {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("ReportedMessages")
      .insert([{ message }]);
    if (error) {
      console.error("Error inserting message:", error);
    } else {
      console.log("Message inserted:", data);
      setMessage("");
    }
  };

  return (
    <form className="anonymousReportingForm" onSubmit={handleSubmit}>
      <input
        className="anonymousReportingInput"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message"
      />
      <button className="anonymousReportingButton" type="submit">
        <Send />
      </button>
    </form>
  );
}

export default SendMessage;
