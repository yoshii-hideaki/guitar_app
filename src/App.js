import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Metronome from "./components/metronome"
import ChordDisplay from "./components/chord_display"
import ChordGallery from "./components/ChordGallery"
import { BpmProvider } from "./components/BpmContext"
import { Link } from "react-router-dom"

function Home() {
  return (
    <>
      <ChordDisplay />
      <Metronome />
    </>
  )
}

function App() {
  return (
    <BpmProvider>
      <Router>
        <div
          style={{
            backgroundColor: "#121212",
            minHeight: "100vh",
            padding: "40px 20px",
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            color: "#f5f5f5",
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

          <nav style={{ textAlign: "center", marginBottom: "30px" }}>
            <Link to="/" style={{ marginRight: "20px", color: "#90caf9" }}>
              ランダムコード
            </Link>
            <Link to="/metronome" style={{ marginRight: "20px", color: "#90caf9" }}>
              メトロノーム
            </Link>
            <Link to="/chords" style={{ color: "#90caf9" }}>
              コード一覧
            </Link>
          </nav>

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
