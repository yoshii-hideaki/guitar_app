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
  const canvasRef = useRef(null)
  const diffRef = useRef(0)

  useEffect(() => {
    let audioContext
    let analyser
    let source
    let dataArray

    const init = async () => {
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
        } else {
          setFrequency(null)
          diffRef.current = 0
        }
        drawNeedle(expected.note)
        requestAnimationFrame(update)
      }

      update()
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

    ctx.fillStyle = "white"
    ctx.font = "28px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(note, w / 2, 40)

    ctx.beginPath()
    ctx.arc(w / 2, h - 10, w / 2 - 20, Math.PI, 2 * Math.PI)
    ctx.strokeStyle = "#ccc"
    ctx.lineWidth = 4
    ctx.stroke()

    const maxDiff = 50
    const clamped = Math.max(-maxDiff, Math.min(maxDiff, diffRef.current))
    const angle = (clamped / maxDiff) * (Math.PI / 2)

    const centerX = w / 2
    const centerY = h - 10
    const radius = w / 2 - 40
    const x = centerX + radius * Math.sin(angle)
    const y = centerY - radius * Math.cos(angle)

    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(x, y)
    ctx.strokeStyle = Math.abs(diffRef.current) < 1 ? "lime" : "red"
    ctx.lineWidth = 3
    ctx.stroke()
  }

  return (
    <div className="tuner-container">
      <h2 className="tuner-title">ギターチューナー</h2>

      <div className="string-selector">
        <label>
          弦を選択：
          <select
            value={selectedString}
            onChange={(e) => setSelectedString(Number(e.target.value))}
            className="string-select"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n}弦 - {stringNotes[n].note}
              </option>
            ))}
          </select>
        </label>
      </div>

      <canvas
        ref={canvasRef}
        width="300"
        height="180"
        className="tuner-canvas"
      />

      <div className="tuner-info">
        <p>検出周波数: {frequency ? `${frequency} Hz` : "聴き取り中..."}</p>
        <p>誤差：{frequency - stringNotes[selectedString].freq} Hz</p>
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
