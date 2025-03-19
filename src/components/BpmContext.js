"use client"

import { createContext, useContext, useState } from "react"

const BpmContext = createContext()

export function BpmProvider({ children }) {
  const [bpm, setBpm] = useState(120)
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <BpmContext.Provider value={{ bpm, setBpm, isPlaying, setIsPlaying }}>
      {children}
    </BpmContext.Provider>
  )
}

export function useBpm() {
  return useContext(BpmContext)
}
