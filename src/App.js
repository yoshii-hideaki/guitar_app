import ChordDisplay from "./components/chord_display"
import Metronome from "./components/metronome"
import { BpmProvider } from "./components/BpmContext"

function App() {
  return (
    <BpmProvider>
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
        <Metronome />
        <ChordDisplay />
      </div>
    </BpmProvider>
  )
}

export default App

