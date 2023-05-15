import React from 'react'
import useWindowSize from './useWindowSize'

export const LoadingCard = () => {
    return (
        <div className="w-full rounded overflow-hidden shadow-lg">
            <div className="w-5/6 min-[280px]:mx-auto rounded overflow-hidden shadow-lg h-80 sm:h-96 md:h-96 lg:h-96 sm:w-full md:w-full lg:w-full bg-yellow-300 animate-pulse pb-10"></div>
            <div className="px-6 py-4 items-center">
                <div className="max-[624px]:m-3 font-regular text-xl mb-2 w-20 h-4 bg-yellow-300 animate-pulse"></div>
                <div className="max-[624px]:m-3 font-regular text-xl mb-2 w-20 h-4 bg-yellow-300 animate-pulse"></div>
            </div>
        </div>
    )
}

export const LoadingCards = () => {
    const { width } = useWindowSize()
    let numLoadingCards = 4
  
    // Adjust the number of loading cards based on viewport width
    if (width >= 1700) {
        numLoadingCards = 5 // xl:grid-cols-5
    } else if (width >= 1200) {
        numLoadingCards = 4 // lg:grid-cols-3
    }else if (width >= 1060) {
        numLoadingCards = 3 // md:grid-cols-3
    } else if (width <= 860) {
        numLoadingCards = 2 // sm:grid-cols-2
    } else if (width >= 625) {
        numLoadingCards = 2 
    } else if (width >= 280) {
        numLoadingCards = 1
    } 
  
    // generates an array of numbers representing the pages of loading cards
    const loadPages = Array.from({ length: numLoadingCards }, (_, index) => index + 1)
  
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5
      gap-4 content-start min-[280px]:grid-cols-1 min-[625px]:grid-cols-2">
        {loadPages.map((num, index) => {
          return <LoadingCard key={index + 1} />
        })}
      </div>
    )
  }