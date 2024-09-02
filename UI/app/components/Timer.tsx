"use client";

import React, { useEffect, useState } from "react";
import Questions from "./Questions";

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState(3);

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div>
      {timeLeft > 0 ? (
        <div className="flex items-center justify-center h-screen backdrop-blur-md">
          <div className="text-5xl font-bold rounded-full p-20 bg-white text-gray-800">
            {timeLeft > 0 && `${timeLeft}`}
          </div>
        </div>
      ) : (
        <Questions />
      )}
    </div>
  );
};

export default Timer;
