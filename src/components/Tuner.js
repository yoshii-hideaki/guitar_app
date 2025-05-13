import { useEffect, useState, useRef } from "react"

const stringNotes = {
  1: { note: "E4", freq: 329.63 },
  2: { note: "B3", freq: 246.94 },
  3: { note: "G3", freq: 196.0 },
  4: { note: "D3", freq: 146.83 },
  5: { note: "A2", freq: 110.0 },
  6: { note: "E2", freq: 82.41 },
}

function Tuner() {
  const [frequency, setFrequency] = useState(null)
  const [selectedString, setSelectedString] = useState(1)
  const [tuningStatus, setTuningStatus] = useState("waiting") // "in-tune", "close", "out-of-tune", "waiting"
  const canvasRef = useRef(null)
  const diffRef = useRef(0)

  useEffect(() => {
    let audioContext
    let analyser
    let source
    let dataArray

    const init = async () => {
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        source = audioContext.createMediaStreamSource(stream)
        analyser = audioContext.createAnalyser()
        analyser.fftSize = 2048
        dataArray = new Float32Array(analyser.fftSize)
        source.connect(analyser)

        const update = () => {
          analyser.getFloatTimeDomainData(dataArray)
          const freq = autoCorrelate(dataArray, audioContext.sampleRate)
          const expected = stringNotes[selectedString]
          
          if (freq) {
            setFrequency(freq.toFixed(1))
            diffRef.current = freq - expected.freq
            
            // Set tuning status based on difference
            const absDiff = Math.abs(diffRef.current)
            if (absDiff < 1) {
              setTuningStatus("in-tune")
            } else if (absDiff < 5) {
              setTuningStatus("close")
            } else {
              setTuningStatus("out-of-tune")
            }
          } else {
            setFrequency(null)
            diffRef.current = 0
            setTuningStatus("waiting")
          }
          
          drawNeedle(expected.note)
          requestAnimationFrame(update)
        }

        update()
      } catch (err) {
        console.error("マイクアクセスに失敗しました:", err)
        // マイクへのアクセスが失敗した場合のフォールバック表示
      }
    }

    init()
    return () => {
      audioContext?.close()
    }
  }, [selectedString])

  const drawNeedle = (note) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const w = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, w, h)

    // Draw note name with shadow for better visibility
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 32px sans-serif"
    ctx.textAlign = "center"
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
    ctx.shadowBlur = 5
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    
    // Position note at the very top of the canvas
    ctx.fillText(note, w / 2, 35)
    
    // Reset shadow for other drawings
    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    // Draw gauge background
    ctx.beginPath()
    ctx.arc(w / 2, h - 10, w / 2 - 20, Math.PI, 2 * Math.PI)
    ctx.strokeStyle = "#444"
    ctx.lineWidth = 8
    ctx.stroke()

    // Draw color zones on the gauge
    const drawColorZone = (startAngle, endAngle, color) => {
      ctx.beginPath()
      ctx.arc(w / 2, h - 10, w / 2 - 20, startAngle, endAngle)
      ctx.strokeStyle = color
      ctx.lineWidth = 8
      ctx.stroke()
    }

    // Red zone (left)
    drawColorZone(Math.PI, Math.PI + Math.PI / 4, "#b71c1c")
    // Yellow zone (left)
    drawColorZone(Math.PI + Math.PI / 4, Math.PI + Math.PI / 2 - 0.1, "#f57f17")
    // Green zone (middle)
    drawColorZone(Math.PI + Math.PI / 2 - 0.1, Math.PI + Math.PI / 2 + 0.1, "#1b5e20")
    // Yellow zone (right)
    drawColorZone(Math.PI + Math.PI / 2 + 0.1, Math.PI + 3 * Math.PI / 4, "#f57f17")
    // Red zone (right)
    drawColorZone(Math.PI + 3 * Math.PI / 4, 2 * Math.PI, "#b71c1c")

    // Draw centering lines
    ctx.beginPath()
    ctx.moveTo(w / 2, h - 10)
    ctx.lineTo(w / 2, h - 10 - (w / 2 - 20) * 0.2)
    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 2
    ctx.stroke()

    // Calculate and clamp needle position
    const maxDiff = 50
    const clamped = Math.max(-maxDiff, Math.min(maxDiff, diffRef.current))
    const angle = (clamped / maxDiff) * (Math.PI / 2)

    const centerX = w / 2
    const centerY = h - 10
    const radius = w / 2 - 40
    const x = centerX + radius * Math.sin(angle)
    const y = centerY - radius * Math.cos(angle)

    // Draw needle
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(x, y)
    ctx.strokeStyle = getStatusColor(tuningStatus)
    ctx.lineWidth = 4
    ctx.stroke()

    // Draw needle tip as a circle
    ctx.beginPath()
    ctx.arc(x, y, 8, 0, 2 * Math.PI)
    ctx.fillStyle = getStatusColor(tuningStatus)
    ctx.fill()
  }

  const getStatusColor = (status) => {
    switch(status) {
      case "in-tune": return "#1b5e20";
      case "close": return "#f57f17";
      case "out-of-tune": return "#b71c1c";
      default: return "#777";
    }
  }

  const getStatusText = () => {
    switch(tuningStatus) {
      case "in-tune": return "チューニング完了！";
      case "close": return "もう少し...";
      case "out-of-tune": return "チューニングが必要です";
      default: return "音を検出中...";
    }
  }

  // Calculate the difference to show as an instruction
  const getTuningDirection = () => {
    if (!frequency || tuningStatus === "in-tune" || tuningStatus === "waiting") return "";
    
    return diffRef.current > 0 ? "緩めてください" : "締めてください";
  }

  return (
    <div className="tuner-container">
      <h2 className="tuner-title">ギターチューナー</h2>

      <div className="string-selector">
        {/* 上段 - 1弦から3弦 */}
        <div className="string-row">
          {[1, 2, 3].map((stringNum) => (
            <div
              key={stringNum}
              className={`string-option ${selectedString === stringNum ? 'selected' : ''}`}
              onClick={() => setSelectedString(stringNum)}
            >
              {stringNum}弦 - {stringNotes[stringNum].note}
            </div>
          ))}
        </div>
        
        {/* 下段 - 4弦から6弦 */}
        <div className="string-row">
          {[4, 5, 6].map((stringNum) => (
            <div
              key={stringNum}
              className={`string-option ${selectedString === stringNum ? 'selected' : ''}`}
              onClick={() => setSelectedString(stringNum)}
            >
              {stringNum}弦 - {stringNotes[stringNum].note}
            </div>
          ))}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width="300"
        height="200"
        className="tuner-canvas"
      />

      <div className="tuner-info">
        <p>
          検出周波数: <span className="frequency-display">{frequency ? `${frequency} Hz` : "---"}</span>
        </p>
        <p>
          誤差: <span className="frequency-display">{frequency ? `${diffRef.current.toFixed(1)} Hz` : "---"}</span>
        </p>
      </div>

      <div className={`tuner-status ${tuningStatus}`}>
        {getStatusText()}
        <div>{getTuningDirection()}</div>
      </div>
    </div>
  )
}

function autoCorrelate(buffer, sampleRate) {
  const SIZE = buffer.length
  let rms = 0
  for (let i = 0; i < SIZE; i++) rms += buffer[i] * buffer[i]
  rms = Math.sqrt(rms / SIZE)
  if (rms < 0.01) return null

  let r1 = 0, r2 = SIZE - 1
  for (let i = 0; i < SIZE / 2; i++) if (Math.abs(buffer[i]) < 0.2) { r1 = i; break }
  for (let i = 1; i < SIZE / 2; i++) if (Math.abs(buffer[SIZE - i]) < 0.2) { r2 = SIZE - i; break }

  buffer = buffer.slice(r1, r2)
  const newSize = buffer.length
  const c = new Array(newSize).fill(0)

  for (let i = 0; i < newSize; i++) {
    for (let j = 0; j < newSize - i; j++) {
      c[i] += buffer[j] * buffer[j + i]
    }
  }

  let d = 0
  while (c[d] > c[d + 1]) d++
  let maxval = -1, maxpos = -1
  for (let i = d; i < newSize; i++) {
    if (c[i] > maxval) {
      maxval = c[i]
      maxpos = i
    }
  }

  return maxpos > 0 ? sampleRate / maxpos : null
}

export default Tuner
