"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useBpm } from "./BpmContext"

const allChords = ["C", "G", "D", "Am", "Em", "F", "Bm", "Dm"]
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

  const containerStyle = {
    textAlign: "center",
    marginTop: "50px",
    padding: "30px",
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#1a1a1a",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    color: "#f5f5f5",
  }

  const chordDisplayStyle = {
    fontSize: "72px",
    fontWeight: "bold",
    margin: "30px 0",
    letterSpacing: "2px",
    color: "#ffffff",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  }

  const nextChordStyle = {
    fontSize: "32px",
    opacity: "0.7",
    marginBottom: "30px",
    fontWeight: "300",
  }

  const buttonStyle = {
    backgroundColor: "#333",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    margin: "10px 0",
    fontWeight: "500",
    letterSpacing: "1px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  }

  const chordSelectorStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
    marginTop: "20px",
  }

  const chordLabelStyle = {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "#333",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  }

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "300",
    letterSpacing: "1.5px",
    marginBottom: "30px",
    borderBottom: "1px solid #444",
    paddingBottom: "10px",
  }

  const checkboxStyle = {
    marginRight: "8px",
    accentColor: "#666",
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>ランダムギターコード</h1>
      <div style={chordDisplayStyle}>{chord}</div>
      <div style={nextChordStyle}>次: {nextChord}</div>
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        style={{
          ...buttonStyle,
          backgroundColor: isPlaying ? "#555" : "#333",
        }}
      >
        {isPlaying ? "停止" : "自動更新"}
      </button>

      <h3 style={{ marginTop: "40px", fontWeight: "300" }}>使用するコード</h3>
      <div style={chordSelectorStyle}>
        {allChords.map((ch) => (
          <label
            key={ch}
            style={{
              ...chordLabelStyle,
              backgroundColor: selectedChords.includes(ch) ? "#555" : "#333",
            }}
          >
            <input
              type="checkbox"
              checked={selectedChords.includes(ch)}
              onChange={() => toggleChordSelection(ch)}
              style={checkboxStyle}
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
          style={checkboxStyle}
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
          style={checkboxStyle}
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
          style={checkboxStyle}
        />
        順番に表示
      </label>
    </div>
    </div>
  )
}

export default ChordDisplay

