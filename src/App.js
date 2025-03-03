import React from "react";
import ChordDisplay from "./components/chord_display";
import Metronome from "./components/metronome";
import { BpmProvider } from "./components/BpmContext";

function App() {
  return (
    <BpmProvider>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>ギター練習アプリ</h1>
        <Metronome />
        <ChordDisplay />
      </div>
    </BpmProvider>
  );
}

export default App;
