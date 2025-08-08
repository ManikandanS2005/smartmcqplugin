"use client";
import React, { createContext, useContext, useState } from "react";

const MCQContext = createContext();

export const MCQProvider = ({ children }) => {
  const [generatedMCQs, setGeneratedMCQs] = useState([]);

  const updateMCQ = (index, updatedMCQ) => {
    setGeneratedMCQs((prev) =>
      prev.map((mcq, i) => (i === index ? updatedMCQ : mcq))
    );
  };

  return (
    <MCQContext.Provider value={{ generatedMCQs, setGeneratedMCQs, updateMCQ }}>
      {children}
    </MCQContext.Provider>
  );
};

export const useMCQ = () => useContext(MCQContext);
