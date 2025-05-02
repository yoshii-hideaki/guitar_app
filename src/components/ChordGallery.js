import { useState } from "react"

const chords = [
  { name: "C", image: "C.png" },
  { name: "G", image: "G.png" },
  { name: "D", image: "D.png" },
  { name: "Am", image: "Am.png" },
  { name: "Em", image: "Em.png" },
  { name: "F", image: "F.png" },
  { name: "Bm", image: "Bm.png" },
  { name: "Dm", image: "Dm.png" },
  { name: "Fm7", image: "Fm7.png" },
]

export default function ChordGallery() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredChords = chords.filter((chord) =>
    chord.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>コード一覧</h2>

      {/* 🔍 検索入力欄 */}
      <input
        type="text"
        placeholder="コードを検索..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "2px",
          marginBottom: "20px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          width: "200px",
        }}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {filteredChords.map((chord) => (
          <div
            key={chord.name}
            style={{
              width: "100px",
              textAlign: "center",
            }}
          >
            <img
              src={chord.image}
              alt={`${chord.name} chord`}
              style={{ width: "100%", borderRadius: "8px" }}
            />
            <p>{chord.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
