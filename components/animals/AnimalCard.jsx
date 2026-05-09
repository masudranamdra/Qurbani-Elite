'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, Weight, Calendar, ChevronRight, Heart, Star, ShieldCheck } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function AnimalCard({ animal, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      viewport={{ once: true }}
      className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border flex flex-col h-full hover:-translate-y-2"
    >
      <div className="relative aspect-[4/3] overflow-hidden m-3 rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent z-10 opacity-70 group-hover:opacity-40 transition duration-300" />
        <Image
          src={animal.image}
          alt={animal.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full bg-white/90 text-primary shadow-sm">
            {animal.category}
          </span>
          {animal.price > 100000 && (
            <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full bg-secondary text-white shadow-sm">
              Elite Grade
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3 z-20">
           <div className="flex items-center gap-1 px-2 py-1 bg-white/90 rounded-md text-[10px] font-semibold text-primary shadow-sm">
              <ShieldCheck className="h-3 w-3" />
              VERIFIED
           </div>
        </div>

        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 text-gray-700 hover:text-red-500 hover:bg-white transition duration-300 z-20 shadow-sm">
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <div className="p-5 pt-4 flex flex-col flex-grow gap-3">
        <div className="flex justify-between items-start">
          <h3 className="text-lg md:text-xl font-bold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition">
            {animal.name}
          </h3>
          <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold bg-amber-100 px-2 py-0.5 rounded-md">
            <Star className="h-3 w-3 fill-amber-500" />
            4.9
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-xs text-muted-foreground font-semibold flex items-center gap-2 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {animal.breed}
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {animal.location}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted text-primary group-hover:bg-primary group-hover:text-white transition">
              <Weight className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase">Weight</span>
              <span className="text-sm font-semibold">{animal.weight} kg</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted text-primary group-hover:bg-primary group-hover:text-white transition">
              <Calendar className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase">Age</span>
              <span className="text-sm font-semibold">{animal.age}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase">Price</span>
            <span className="text-xl font-bold text-primary">
              {formatPrice(animal.price)}
            </span>
          </div>
          <Link
            href={`/animals/${animal.id}`}
            className="flex items-center justify-center h-12 w-12 bg-primary text-white rounded-xl hover:bg-primary/90 transition shadow-md group-hover:-translate-y-0.5"
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}