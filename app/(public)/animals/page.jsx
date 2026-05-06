'use client'

import { useState, useMemo, useCallback } from 'react'
import { useAnimals } from '@/hooks/useAnimals'
import AnimalCard from '@/components/animals/AnimalCard'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { Search, ArrowUpDown, FilterX, Sparkles, MapPin, DollarSign, SlidersHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AnimalsPage() {
  const { animals, loading } = useAnimals()
  const [sortBy, setSortBy] = useState('none')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    minPrice: '',
    maxPrice: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  const debounce = useCallback((func, delay) => {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(null, args), delay)
    }
  }, [])

  const debouncedSetSearch = useMemo(
    () => debounce((value) => setDebouncedSearchTerm(value), 300),
    [debounce]
  )

  const handleSearchChange = (value) => {
    setSearchTerm(value)
    debouncedSetSearch(value)
  }

  const filteredAndSortedAnimals = useMemo(() => {
    let result = [...animals]

    if (debouncedSearchTerm) {
      result = result.filter(a =>
        a.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        a.breed.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        a.type.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        a.location.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
    }

    if (filters.category) {
      result = result.filter(a => a.category.toLowerCase() === filters.category.toLowerCase())
    }

    if (filters.location) {
      result = result.filter(a => a.location.toLowerCase().includes(filters.location.toLowerCase()))
    }

    if (filters.minPrice) {
      result = result.filter(a => a.price >= parseInt(filters.minPrice))
    }
    if (filters.maxPrice) {
      result = result.filter(a => a.price <= parseInt(filters.maxPrice))
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name))
    }

    return result
  }, [animals, debouncedSearchTerm, filters, sortBy])

  const resetFilters = () => {
    setSearchTerm('')
    setDebouncedSearchTerm('')
    setFilters({ category: '', location: '', minPrice: '', maxPrice: '' })
    setSortBy('none')
  }

  const categories = [...new Set(animals.map(a => a.category))]
  const locations = [...new Set(animals.map(a => a.location.split(',')[0].trim()))]

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 space-y-20">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto"
      >
        <div className="inline-flex items-center gap-3 md:mt-10 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-10">
          <Sparkles className="h-4 w-4" />
          Elite Inventory 2026
        </div>
        <h1 className="text-6xl md:text-7xl font-black text-foreground mb-8 tracking-tighter">Live <span className="text-primary italic">Marketplace</span></h1>
        <p className="text-xl text-muted-foreground font-medium leading-relaxed opacity-80">
          Discover the most prestigious livestock collection in Bangladesh. Every animal is verified for age, health, and spiritual purity.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        <div className="flex flex-col lg:flex-row gap-6 glass p-8 rounded-[32px] border border-border/80 dark:border-white/5 shadow-3xl shadow-slate-200/50 dark:shadow-none">
          <div className="relative flex-grow">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, breed, type, or location..."
              className="w-full pl-16 pr-8 py-5 bg-gradient-to-br from-sky-50 via-blue-50 to-green-50 dark:bg-slate-900/50 border-none rounded-3xl focus:ring-2 focus:ring-primary transition-all text-secondary font-bold placeholder:text-gray-500 shadow-inner"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <div className="relative min-w-[200px]">
              <ArrowUpDown className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <select
                className="w-full pl-14 pr-10 py-5 bg-gradient-to-br from-sky-50 via-blue-50 to-green-50 dark:bg-slate-900/50 border-none rounded-3xl focus:ring-2 focus:ring-primary transition-all appearance-none text-foreground font-bold cursor-pointer border shadow-inner"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="none">Sort By</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-5 bg-gradient-to-br from-sky-50 via-blue-50 to-green-50 dark:bg-slate-900/50 border-none rounded-3xl hover:bg-gradient-to-br hover:from-sky-50 hover:via-blue-50 hover:to-green-50 dark:hover:bg-slate-800/50 transition-all font-bold shadow-inner flex items-center gap-2"
            >
              <SlidersHorizontal className="h-5 w-5" />
              Filters
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass p-8 rounded-[32px] border border-border/80 dark:border-white/5 shadow-3xl overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-black text-foreground/80 uppercase tracking-widest">Category</label>
                  <select
                    className="w-full px-4 py-3 bg-gradient-to-br from-sky-50 via-blue-50 to-green-50 dark:bg-slate-900/50 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all text-foreground font-bold"
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-black text-foreground/80 uppercase tracking-widest">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <select
                      className="w-full pl-10 pr-4 py-3 bg-gradient-to-br from-sky-50 via-blue-50 to-green-50 dark:bg-slate-900/50 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all text-foreground font-bold"
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                    >
                      <option value="">All Locations</option>
                      {locations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-black text-foreground/80 uppercase tracking-widest">Min Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-3 bg-gradient-to-br from-sky-50 via-blue-50 to-green-50 dark:bg-slate-900/50 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all text-foreground font-bold"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-black text-foreground/80 uppercase tracking-widest">Max Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="number"
                      placeholder="1000000"
                      className="w-full pl-10 pr-4 py-3 bg-gradient-to-br from-sky-50 via-blue-50 to-green-50 dark:bg-slate-900/50 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all text-foreground font-bold"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-muted text-muted-foreground rounded-2xl font-bold hover:bg-muted/80 transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-40">
          <LoadingSpinner />
        </div>
      ) : filteredAndSortedAnimals.length > 0 ? (
        <AnimatePresence mode='popLayout'>
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12"
          >
            {filteredAndSortedAnimals.map((animal, i) => (
              <AnimalCard key={animal.id} animal={animal} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-40 glass rounded-[64px] border-4 border-dashed border-border/50 max-w-4xl mx-auto"
        >
          <div className="h-24 w-24 bg-primary/10 text-primary rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-xl">
            <FilterX className="h-12 w-12" />
          </div>
          <h3 className="text-4xl font-black text-foreground mb-6 tracking-tight">No Matching Specimens</h3>
          <p className="text-xl text-muted-foreground mb-12 max-w-md mx-auto font-medium opacity-80">We couldn&apos;t find any animals matching your criteria. Try adjusting your search parameters.</p>

          <button 
            onClick={resetFilters}
            className="px-12 py-5 bg-primary text-white rounded-2xl font-black text-xl hover:bg-primary-hover transition-all shadow-3xl shadow-primary/30 hover:-translate-y-1 active:translate-y-0"
          >
            Reset Filters
          </button>
        </motion.div>
      )}
    </div>
  )
}


