"use client";
import React, { createContext, useContext, useState } from "react";

const FormInfoContext = createContext();

export function FormInfoProvider({ children }) {
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [customFields, setCustomFields] = useState([]);

  /* ADD FIELD */

  const addCustomField = (name, type, options = []) => {
    if (!name.trim()) return;

    const newField = {
      id: Date.now().toString(),
      name: name.trim(),
      type,
      required: true,
      options,
      example: "" // ✅ needed
    };

    setCustomFields((prev) => [...prev, newField]);
  };

  /* REMOVE FIELD */

  const removeField = (id) => {
    setCustomFields((prev) => prev.filter((f) => f.id !== id));
  };

  /* TOGGLE REQUIRED */

  const toggleRequired = (id) => {
    setCustomFields((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, required: !f.required } : f
      )
    );
  };

  /* SET EXAMPLE */

  const setFieldExample = (id, value) => {
    setCustomFields((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, example: value } : f
      )
    );
  };

  /* REMOVE EXAMPLE */

  const removeExample = (id) => {
    setCustomFields((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, example: "" } : f
      )
    );
  };

  return (
    <FormInfoContext.Provider
      value={{
        formName,
        setFormName,
        formDescription,
        setFormDescription,
        customFields,
        addCustomField,
        removeField,
        toggleRequired,
        setFieldExample,
        removeExample,
      }}
    >
      {children}
    </FormInfoContext.Provider>
  );
}

export const useFormInfo = () => useContext(FormInfoContext);