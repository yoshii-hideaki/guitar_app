import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Metronome from "./components/metronome"
import ChordDisplay from "./components/chord_display"
import ChordGallery from "./components/ChordGallery"
import { BpmProvider } from "./components/BpmContext"
import "./App.css"

function Home() {
  return (
    <>
      <ChordDisplay />
      <Metronome />
    </>
  )
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <BpmProvider>
      <Router>
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>

        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <Link to="/" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            ランダムコード
          </Link>
          <Link to="/metronome" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            メトロノーム
          </Link>
          <Link to="/chords" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            コード一覧
          </Link>
        </div>

        <div
          style={{
            backgroundColor: "#121212",
            minHeight: "100vh",
            padding: "40px 20px",
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            color: "#f5f5f5",
            marginLeft: sidebarOpen ? "250px" : "0",
            transition: "margin-left 0.3s ease",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              fontSize: "36px",
              fontWeight: "200",
              letterSpacing: "3px",
              marginBottom: "40px",
              color: "#ffffff",
              textTransform: "uppercase",
            }}
          >
            ギター練習アプリ
          </h1>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/metronome" element={<Metronome />} />
            <Route path="/chords" element={<ChordGallery />} />
          </Routes>
        </div>
      </Router>
    </BpmProvider>
  )
}

export default App
