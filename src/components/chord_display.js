import React, { useState, useEffect } from "react";
import { useBpm } from "./BpmContext";

const numBeatsPerMeasure = 4; // 1小節あたりの拍数

function ChordDisplay() {
  const { bpm } = useBpm(); // Context から BPM を取得
  const [chord, setChord] = useState("C");
  const [nextChord, setNextChord] = useState("G"); // 次のコードを管理
  const [isPlaying, setIsPlaying] = useState(false);

  const getRandomChord = async () => {
    const response = await fetch("http://127.0.0.1:5001/random_chord");
    const data = await response.json();
    return data.chord; // 取得したコードを返す
  };

  useEffect(() => {
    if (!isPlaying) return;

    const updateChord = async () => {
      setChord(nextChord); // 次のコードを現在のコードにセット
      const newNextChord = await getRandomChord(); // 新しい次のコードを取得
      setNextChord(newNextChord);
    };

    const interval = setInterval(updateChord, (60 / bpm) * numBeatsPerMeasure * 1000);

    return () => clearInterval(interval);
  }, [bpm, isPlaying, nextChord]);

  // 初回に次のコードを取得しておく
  useEffect(() => {
    getRandomChord().then(setNextChord);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>ランダムギターコード</h2>
      <h1>現在のコード: {chord}</h1>
      <h3>次のコード: {nextChord}</h3>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? "停止" : "自動更新"}
      </button>
    </div>
  );
}

export default ChordDisplay;
