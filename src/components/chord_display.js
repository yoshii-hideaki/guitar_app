"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useBpm } from "./BpmContext"

const allChords = ["C", "G", "D", "Am", "Em", "F", "Bm", "Dm", "Fm7"]
const numBeatsPerMeasure = 4

function ChordDisplay() {
  const { bpm, isPlaying, setIsPlaying } = useBpm()
  const [chord, setChord] = useState("C")
  const [nextChord, setNextChord] = useState("G")
  const [selectedChords, setSelectedChords] = useState([...allChords])
  const indexRef = useRef(0)
  const lastChordRef = useRef(null)
  const [mode, setMode] = useState("random") // "random" | "noRepeat" | "sequential"
  
  const getRandomChord = useCallback(() => {
    if (selectedChords.length === 0) return "N/A"
  
    let chord = "N/A"
  
    switch (mode) {
      case "random":
        chord = selectedChords[Math.floor(Math.random() * selectedChords.length)]
        break
      case "noRepeat":
        do {
          chord = selectedChords[Math.floor(Math.random() * selectedChords.length)]
        } while (chord === lastChordRef.current && selectedChords.length > 1)
        break
      case "sequential":
        chord = selectedChords[indexRef.current % selectedChords.length]
        indexRef.current = indexRef.current + 1
        break
    }
  
    lastChordRef.current = chord
    return chord
  }, [selectedChords, mode])
  

  useEffect(() => {
    if (!isPlaying) return

    const updateChord = () => {
      setChord(nextChord)
      setNextChord(getRandomChord())
    }

    const interval = setInterval(updateChord, (60 / bpm) * numBeatsPerMeasure * 1000)
    return () => clearInterval(interval)
  }, [bpm, isPlaying, getRandomChord, nextChord]) // ここで getRandomChord を依存に追加

  useEffect(() => {
    setNextChord(getRandomChord())
  }, [getRandomChord]) // selectedChords を削除

  const toggleChordSelection = (chord) => {
    setSelectedChords((prev) => (prev.includes(chord) ? prev.filter((c) => c !== chord) : [...prev, chord]))
  }

  return (
    <div className="component-container chord-display">
      <h1 className="component-title">ランダムギターコード</h1>
      <div className="chord-text">{chord}</div>
      <div className="next-chord">次: {nextChord}</div>
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className={`button ${isPlaying ? 'active' : ''}`}
      >
        {isPlaying ? "停止" : "自動更新"}
      </button>

      <h3 style={{ marginTop: "40px", fontWeight: "300" }}>使用するコード</h3>
      <div className="chord-selector">
        {allChords.map((ch) => (
          <label
            key={ch}
            className={`chord-label ${selectedChords.includes(ch) ? 'active' : ''}`}
          >
            <input
              type="checkbox"
              checked={selectedChords.includes(ch)}
              onChange={() => toggleChordSelection(ch)}
              className="checkbox"
            />
            {ch}
          </label>
        ))}
      </div>
      <div style={{ marginTop: "30px" }}>
        <h3 style={{ fontWeight: "300", marginBottom: "10px" }}>コードの出し方</h3>
        <label>
          <input
            type="radio"
            name="mode"
            value="random"
            checked={mode === "random"}
            onChange={() => setMode("random")}
            className="checkbox"
          />
          完全ランダム
        </label>
        <label style={{ marginLeft: "20px" }}>
          <input
            type="radio"
            name="mode"
            value="noRepeat"
            checked={mode === "noRepeat"}
            onChange={() => setMode("noRepeat")}
            className="checkbox"
          />
          前回と同じは避ける
        </label>
        <label style={{ marginLeft: "20px" }}>
          <input
            type="radio"
            name="mode"
            value="sequential"
            checked={mode === "sequential"}
            onChange={() => setMode("sequential")}
            className="checkbox"
          />
          順番に表示
        </label>
      </div>
    </div>
  )
}

export default ChordDisplay

