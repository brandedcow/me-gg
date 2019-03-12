import React, { useEffect, useState, createContext } from "react";

export const BackgroundContext = createContext([0, () => {}]);
/*
  0: changing background
  1: grey
*/
const BackgroundProvider = props => {
  const [backgroundType, setBackgroundType] = useState(0);

  return (
    <div>
      <BackgroundContext.Provider value={[backgroundType, setBackgroundType]}>
        {props.children}
      </BackgroundContext.Provider>
    </div>
  );
};

export default BackgroundProvider;
