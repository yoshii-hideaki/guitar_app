"use client"

import { useState, useEffect, useRef } from "react"
import { useBpm } from "./BpmContext"

function Metronome() {
  const { bpm, setBpm, isPlaying, setIsPlaying } = useBpm()
  const audioContextRef = useRef(null)
  const audioBufferRef = useRef(null)

  // コンポーネントマウント時に AudioContext の作成とクリック音の読み込みを行う
  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    audioContextRef.current = new AudioContext()

    fetch("/click.wav")
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) =>
        audioContextRef.current.decodeAudioData(arrayBuffer)
      )
      .then((decodedData) => {
        audioBufferRef.current = decodedData
      })
      .catch((error) =>
        console.error("クリック音の読み込みに失敗しました:", error)
      )

    // アンマウント時に AudioContext を閉じる
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // クリック音を再生する関数（Web Audio API を利用）
  const playClick = () => {
    if (!audioBufferRef.current || !audioContextRef.current) return
    const source = audioContextRef.current.createBufferSource()
    source.buffer = audioBufferRef.current
    source.connect(audioContextRef.current.destination)
    source.start()
  }

  // BPM や再生状態に合わせて再生のインターバルを設定する
  useEffect(() => {
    if (!isPlaying) return

    // スマホなどで AudioContext が "suspended" 状態の場合、ユーザー操作で再開する
    if (
      audioContextRef.current &&
      audioContextRef.current.state === "suspended"
    ) {
      audioContextRef.current.resume()
    }

    const interval = setInterval(() => {
      playClick()
    }, (60 / bpm) * 1000)

    return () => clearInterval(interval)
  }, [bpm, isPlaying])

  return (
    <div className="metronome-container">
      <h2 className="component-title">メトロノーム</h2>

      <div className="metronome-controls">
        <div className="bpm-button-group">
          <button onClick={() => setBpm(bpm - 10)} className="bpm-button">
            -10
          </button>
          <button onClick={() => setBpm(bpm - 1)} className="bpm-button">
            -1
          </button>
        </div>

        <div className="bpm-display">
          <input 
            type="number" 
            value={bpm} 
            onChange={(e) => {
                const newBpm = Number(e.target.value);
                setBpm(newBpm > 0 ? newBpm : 1);
            }} 
            className="bpm-input" 
          />
          <span className="bpm-label">BPM</span>
        </div>

        <div className="bpm-button-group">
          <button onClick={() => setBpm(bpm + 10)} className="bpm-button">
            +10
          </button>
          <button onClick={() => setBpm(bpm + 1)} className="bpm-button">
            +1
          </button>
        </div>
      </div>

      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className={`metronome-button ${isPlaying ? 'active' : ''}`}
      >
        {isPlaying ? "停止" : "再生"}
      </button>
    </div>
  )
}

export default Metronome

