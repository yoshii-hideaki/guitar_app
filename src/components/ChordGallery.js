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
    <div className="chord-gallery">
      <h2 className="chord-gallery-title">コード一覧</h2>

      {/* 🔍 検索入力欄 */}
      <input
        type="text"
        placeholder="コードを検索..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="chord-search"
      />

      <div className="chord-grid">
        {filteredChords.map((chord) => (
          <div key={chord.name} className="chord-item">
            <img
              src={chord.image}
              alt={`${chord.name} chord`}
              className="chord-image"
            />
            <p>{chord.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
