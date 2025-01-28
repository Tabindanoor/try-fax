"use client";
import React, { useEffect, useState } from "react";

const Hello = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function SayHello() {
        const response = await fetch("/api/hello");
       
        const data = await response.json();
        setMessage(data.message);
    }
    SayHello();
  }, []);

  return (
    <div>
      <p>This is the frontend and backend communication in action.</p>
      <p>
        Here is the message from the backend:{" "}
        <b className="text-purple-600">:) {message}</b>
      </p>
    </div>
  );
};

export default Hello;
