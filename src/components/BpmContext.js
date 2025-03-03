import React, { createContext, useState, useContext } from "react";

// Context の作成
const BpmContext = createContext();

// Provider コンポーネント
export const BpmProvider = ({ children }) => {
  const [bpm, setBpm] = useState(120); // BPMの状態管理

  return (
    <BpmContext.Provider value={{ bpm, setBpm }}>
      {children}
    </BpmContext.Provider>
  );
};

// BPM の値を使うカスタムフック
export const useBpm = () => useContext(BpmContext);