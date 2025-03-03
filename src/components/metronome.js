import React, { useState, useEffect } from "react";
import { useBpm } from "./BpmContext";

const clickSound = new Audio("/click.wav");

function Metronome() {
  const { bpm, setBpm } = useBpm(); // Context から BPM を取得
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      clickSound.play();
    }, (60 / bpm) * 1000);

    return () => clearInterval(interval);
  }, [bpm, isPlaying]);

  return (
    <div>
      <h2>メトロノーム</h2>
      <button onClick={() => setBpm(bpm + 1)} style={{marginRight: "5px"}}>+1</button>
      <button onClick={() => setBpm(bpm + 10)} style={{marginBottom: "5px", marginRight: "40px"}}>+10</button>
      <br />
      <input
        type="number"
        value={bpm}
        onChange={(e) => setBpm(Number(e.target.value))}
        style={{ fontSize: "20px", width: "80px", textAlign: "center", marginLeft: "10px" }}
      />
      <span style={{ fontSize: "20px", marginLeft: "10px" }}>BPM</span>
      <br />
      <button onClick={() => setBpm(bpm - 1)} style={{marginRight: "5px"}}>-1</button>
      <button onClick={() => setBpm(bpm - 10)} style={{marginTop: "5px", marginRight: "40px"}}>-10</button>
      <br />
      <button onClick={() => setIsPlaying(!isPlaying)} style={{ fontSize: "20px", marginTop: "10px" }}>
        {isPlaying ? "停止" : "再生"}
      </button>
    </div>
  );
}

export default Metronome;
