import React, { useState, createContext, useMemo } from 'react'

export const MarketContext = createContext(null)

export const MarketContextProvider = ({ children }) => {
  const [selectedCard, setSelectedCard] = useState(null)
  const providerValue = useMemo(() => ({ selectedCard, setSelectedCard}), [selectedCard, setSelectedCard])

  return (
    <MarketContext.Provider value={providerValue}>
      {children}
    </MarketContext.Provider>
  )
}
