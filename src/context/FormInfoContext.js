"use client";

import React, { createContext, useContext, useState } from "react";

const FormInfoContext = createContext();

export function FormInfoProvider({ children }) {
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [includeName, setIncludeName] = useState(false);
  const [includeRollNo, setIncludeRollNo] = useState(false);
  const [customFields, setCustomFields] = useState([]);

  const addCustomField = (field) => {
    if (field.trim()) {
      setCustomFields((prev) => [...prev, field.trim()]);
    }
  };

  const clearCustomFields = () => setCustomFields([]);

  // You can add other helpers if needed

  return (
    <FormInfoContext.Provider
      value={{
        formName,
        setFormName,
        formDescription,
        setFormDescription,
        includeName,
        setIncludeName,
        includeRollNo,
        setIncludeRollNo,
        customFields,
        addCustomField,
        clearCustomFields,
      }}
    >
      {children}
    </FormInfoContext.Provider>
  );
}

export function useFormInfo() {
  const context = useContext(FormInfoContext);
  if (!context) {
    throw new Error("useFormInfo must be used within a FormInfoProvider");
  }
  return context;
}
