"use client"

import { useState, useEffect } from "react"
import { useBpm } from "./BpmContext"

const clickSound = new Audio("/click.wav")

function Metronome() {
  const { bpm, setBpm } = useBpm() // Context から BPM を取得
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(
      () => {
        clickSound.play()
      },
      (60 / bpm) * 1000,
    )

    return () => clearInterval(interval)
  }, [bpm, isPlaying])

  const containerStyle = {
    backgroundColor: "#1a1a1a",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    maxWidth: "400px",
    margin: "0 auto 40px auto",
    color: "#f5f5f5",
  }

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "300",
    letterSpacing: "1.5px",
    marginBottom: "30px",
    borderBottom: "1px solid #444",
    paddingBottom: "10px",
  }

  const buttonStyle = {
    backgroundColor: "#333",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    margin: "5px",
    fontWeight: "500",
  }

  const largeButtonStyle = {
    ...buttonStyle,
    padding: "12px 24px",
    fontSize: "16px",
    marginTop: "20px",
    width: "120px",
  }

  // BPM調整部分のスタイル改良
  const bpmControlsStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "20px 0",
  }

  const bpmButtonGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  }

  const bpmButtonStyle = {
    backgroundColor: "#333",
    color: "#f5f5f5",
    border: "1px solid #444",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    padding: "0",
  }

  const bpmDisplayStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "0 20px",
    padding: "10px 15px",
    backgroundColor: "#222",
    borderRadius: "8px",
    border: "1px solid #444",
    minWidth: "120px",
  }

  const bpmInputStyle = {
    backgroundColor: "transparent",
    color: "white",
    border: "none",
    fontSize: "32px",
    width: "80px",
    textAlign: "center",
    fontWeight: "bold",
    padding: "5px 0",
    margin: "0",
  }

  const bpmLabelStyle = {
    fontSize: "14px",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: "1px",
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>メトロノーム</h2>

      <div style={bpmControlsStyle}>
        <div style={bpmButtonGroupStyle}>
          <button onClick={() => setBpm(bpm - 10)} style={bpmButtonStyle}>
            -10
          </button>
          <button onClick={() => setBpm(bpm - 1)} style={bpmButtonStyle}>
            -1
          </button>
        </div>

        <div style={bpmDisplayStyle}>
          <input type="number" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} style={bpmInputStyle} />
          <span style={bpmLabelStyle}>BPM</span>
        </div>

        <div style={bpmButtonGroupStyle}>
          <button onClick={() => setBpm(bpm + 10)} style={bpmButtonStyle}>
            +10
          </button>
          <button onClick={() => setBpm(bpm + 1)} style={bpmButtonStyle}>
            +1
          </button>
        </div>
      </div>

      <button
        onClick={() => setIsPlaying(!isPlaying)}
        style={{
          ...largeButtonStyle,
          backgroundColor: isPlaying ? "#555" : "#333",
        }}
      >
        {isPlaying ? "停止" : "再生"}
      </button>
    </div>
  )
}

export default Metronome

