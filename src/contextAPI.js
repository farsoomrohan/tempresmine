import React, { createContext, useState } from "react";

export const ResumeContext = createContext();

const ResumeContextProvider = ({ children }) => {
  const [jd, setJd] = useState([]);
  const update = (data) => {
    setJd(data);
  };

  return (
    <ResumeContext.Provider value={{ jd, update }}>
      {children}
    </ResumeContext.Provider>
  );
};

export default ResumeContextProvider;
