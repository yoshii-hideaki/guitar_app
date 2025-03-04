import React, { useState, useEffect, useCallback } from "react";
import { useBpm } from "./BpmContext";

const allChords = ["C", "G", "D", "Am", "Em", "F", "Bm"];
const numBeatsPerMeasure = 4;

function ChordDisplay() {
  const { bpm } = useBpm();
  const [chord, setChord] = useState("C");
  const [nextChord, setNextChord] = useState("G");
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedChords, setSelectedChords] = useState([...allChords]);

  // getRandomChord を useCallback でメモ化
  const getRandomChord = useCallback(() => {
    if (selectedChords.length === 0) return "N/A";
    return selectedChords[Math.floor(Math.random() * selectedChords.length)];
  }, [selectedChords]);

  useEffect(() => {
    if (!isPlaying) return;

    const updateChord = () => {
      setChord(nextChord);
      setNextChord(getRandomChord());
    };

    const interval = setInterval(updateChord, (60 / bpm) * numBeatsPerMeasure * 1000);
    return () => clearInterval(interval);
  }, [bpm, isPlaying, nextChord, getRandomChord]); // ここで getRandomChord を依存に追加

  useEffect(() => {
    setNextChord(getRandomChord());
  }, [selectedChords, getRandomChord]);

  const toggleChordSelection = (chord) => {
    setSelectedChords((prev) =>
      prev.includes(chord) ? prev.filter((c) => c !== chord) : [...prev, chord]
    );
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>ランダムギターコード</h2>
      <h1>現在のコード: {chord}</h1>
      <h3>次のコード: {nextChord}</h3>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? "停止" : "自動更新"}
      </button>

      <h3>使用するコードを選択</h3>
      <div>
        {allChords.map((ch) => (
          <label key={ch} style={{ marginRight: "10px" }}>
            <input
              type="checkbox"
              checked={selectedChords.includes(ch)}
              onChange={() => toggleChordSelection(ch)}
            />
            {ch}
          </label>
        ))}
      </div>
    </div>
  );
}

export default ChordDisplay;
