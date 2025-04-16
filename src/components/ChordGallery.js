const chords = [
  { name: "C", image: "C.png" },
  { name: "G", image: "G.png" },
  { name: "D", image: "D.png" },
  { name: "Am", image: "Am.png" },
  { name: "Em", image: "Em.png" },
  { name: "F", image: "F.png" },
  { name: "Bm", image: "Bm.png" },
  { name: "Dm", image: "Dm.png" },
]

export default function ChordGallery() {
  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>コード一覧</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {chords.map((chord) => (
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
