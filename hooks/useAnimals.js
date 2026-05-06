'use client'

import { useState, useEffect } from 'react'
import animalsData from '@/data/animals.json'

export function useAnimals() {
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimals(animalsData)
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const getAnimalById = (id) => {
    return animals.find(a => a.id === id)
  }

  return { animals, loading, getAnimalById }
}
