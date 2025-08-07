"use client";
import React, { createContext, useContext, useState } from "react";

const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    role: "",
    formName: "",
    formDesc: "",
    name: "",
    gmail: "",
    rollno: "",
    forWhom: "",
    topic: "",
    choices: 0,
    additionalDesc: "",
  });

  const updateFormData = (newData) => {
    setFormData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  const resetFormData = () => {
    setFormData({
      role: "",
      formName: "",
      formDesc: "",
      name: "",
      gmail: "",
      rollno: "",
      forWhom: "",
      topic: "",
      choices: 0,
      mcqno:0,
      additionalDesc: "",
    });
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData, resetFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => useContext(FormContext);