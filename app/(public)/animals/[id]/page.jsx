'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAnimals } from '@/hooks/useAnimals'
import { useAuth } from '@/lib/auth-context'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { formatPrice } from '@/lib/utils'
import { 
  Weight, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Truck,
  CalendarDays,
  Zap,
  Shield
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function AnimalDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { getAnimalById, loading: animalsLoading } = useAnimals()
  const { user } = useAuth()
  
  const [animal, setAnimal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [captchaAnswer, setCaptchaAnswer] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    preferredDate: '',
    additionalInfo: ''
  })

  useEffect(() => {
    if (animalsLoading) return
    
    const found = getAnimalById(id)
    setTimeout(() => {
      setAnimal(found || null)
      setLoading(false)
    }, 0)
  }, [id, getAnimalById, animalsLoading])

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }))
    }
  }, [user])

  const handleBooking = async (e) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please login to book this animal')
      router.push(`/login?redirect=/animals/${id}`)
      return
    }

    if (captchaAnswer !== '5') {
      toast.error('Math Verification Failed: 10 - 5 = ?')
      return
    }

    if (!animal) return

    setBookingLoading(true)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          animalId: animal.id,
          animalName: animal.name,
          animalImage: animal.image,
          animalPrice: animal.price,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          preferredDate: formData.preferredDate,
          additionalInfo: formData.additionalInfo,
          paymentMethod: 'pay_later'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Booking failed')
      }

      await response.json()

      toast.success('Your professional booking request has been received!', {
        duration: 5000,
        icon: '✅'
      })

      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: '',
        address: '',
        preferredDate: '',
        additionalInfo: ''
      })
      setCaptchaAnswer('')
      router.push('/my-profile')
    } catch (error) {
      console.error('Booking error:', error)
      toast.error(error.message || 'Booking failed. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }


  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><LoadingSpinner /></div>
  
  if (!animal) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-6" />
        <h1 className="text-3xl font-black text-foreground mb-4">Animal Not Found</h1>
        <p className="text-muted-foreground mb-8 text-lg font-medium">The animal you are looking for has been secured by another buyer or removed.</p>
        <Link href="/animals" className="px-10 py-4 bg-primary text-white rounded-2xl font-black hover:bg-primary-hover transition-all shadow-xl shadow-primary/20">
          Return to Marketplace
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:mt-20">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link href="/animals" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-bold mb-8 transition-colors group">
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Back to Inventory
        </Link>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative aspect-[4/3] rounded-[48px] overflow-hidden shadow-3xl ring-1 ring-black/5"
          >
            <img src={animal.image} alt={animal.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
              <div className="glass p-4 rounded-2xl border-white/20">
                <p className="text-gray-700 text-xs font-black uppercase tracking-widest mb-1">Current Status</p>
                <div className="flex items-center gap-2 text-gray-500 font-black">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Available for Sacrifice
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card p-10 rounded-[40px] border border-border shadow-2xl space-y-8"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-foreground">Detailed Specification</h2>
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">ID: #QMN-{animal.id.slice(0, 5)}</span>
            </div>
            
            <p className="text-muted-foreground leading-relaxed text-lg font-medium">
              {animal.description}
            </p>
            
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border">
              <div className="flex items-start gap-5">
                <div className="p-4 bg-primary/10 text-primary rounded-[20px]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-black uppercase tracking-widest mb-1">Health Status</p>
                  <p className="text-foreground font-black text-lg">Premium Grade</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="p-4 bg-amber-500/10 text-amber-600 rounded-[20px]">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-black uppercase tracking-widest mb-1">Dietary Regimen</p>
                  <p className="text-foreground font-black text-lg">100% Organic</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-border flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-black text-gray-900 dark:text-white">Next-Day Delivery Available</h4>
                <p className="text-sm text-gray-500 font-medium">Verified for safe and stress-free transport.</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-8 sticky top-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card p-10 md:p-12 rounded-[48px] border border-border shadow-3xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-[120px] -z-10" />
            
            <div className="mb-12">
              <div className="flex gap-3 mb-6">
                <span className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-black rounded-full uppercase tracking-widest border border-primary/20">
                  {animal.category}
                </span>
                <span className="px-4 py-1.5 bg-secondary text-white text-xs font-black rounded-full uppercase tracking-widest">
                  Elite Breed
                </span>
              </div>
              <h1 className="text-5xl font-black text-foreground mb-4 tracking-tight leading-none">{animal.name}</h1>
              <div className="flex items-baseline gap-3">
                <p className="text-primary text-4xl font-black tracking-tighter">{formatPrice(animal.price)}</p>
                <p className="text-muted-foreground text-sm font-bold">Includes Service Charge</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-12">
              {[
                { icon: Weight, label: 'Weight', value: `${animal.weight} kg` },
                { icon: Calendar, label: 'Maturity', value: animal.age },
                { icon: MapPin, label: 'Origin', value: animal.breed }
              ].map((stat, i) => (
                <div key={i} className="text-center p-5 bg-gradient-to-br from-sky-50 via-blue-50 to-green-50 dark:bg-slate-900/50 rounded-[28px] border border-border group hover:bg-primary/5 transition-colors">
                  <stat.icon className="h-6 w-6 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] text-gray-900 dark:text-white font-black mb-1 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-gray-500 dark:text-gray-400 font-black text-base">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-8">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="text-xl font-black text-foreground">Registration of Interest</h3>
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              
              <form onSubmit={handleBooking} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
                    <input
                      required
                      type="text"
                      className="w-full px-6 py-4 bg-gradient-to-br from-sky-50 via-blue-50 to-green-50 dark:bg-slate-900/50 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all font-semibold placeholder:text-gray-500 text-gray-500 shadow-inner"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">E-mail Address</label>
                    <input
                      required
                      type="email"
                      className="w-full px-6 py-4 bg-gradient-to-br from-sky-50 via-blue-50 to-green-50 dark:bg-slate-900/50 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all font-semibold placeholder:text-gray-500 text-gray-500 shadow-inner"
                      placeholder="masud@example.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Phone Number</label>
                    <input
                      required
                      type="tel"
                      className="w-full px-6 py-4 bg-gradient-to-br from-sky-50 via-blue-50 to-green-50 dark:bg-slate-900/50 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all font-semibold placeholder:text-gray-500 text-gray-500 shadow-inner"
                      placeholder="+880 1..."
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Preferred Date</label>
                    <div className="relative">
                      <CalendarDays className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
                      <input
                        required
                        type="date"
                        className="w-full px-6 py-4 bg-gradient-to-br from-sky-50 via-blue-50 to-green-50 dark:bg-slate-900/50 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all font-semibold shadow-inner text-gray-500"
                        value={formData.preferredDate}
                        onChange={e => setFormData({...formData, preferredDate: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Delivery Address</label>
                  <textarea
                    required
                    rows={2}
                    className="w-full px-6 py-4 bg-gradient-to-br from-sky-50 via-blue-50 to-green-50 dark:bg-slate-900/50 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all font-semibold placeholder:text-gray-500 shadow-inner"
                    placeholder="Enter full street address for accurate logistics..."
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>

                <div className="p-6 bg-gradient-to-br from-sky-50 via-blue-50 to-green-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-primary/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-primary uppercase tracking-widest">Verification Security</label>
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex-grow py-3 px-6 bg-white dark:bg-slate-900 rounded-xl font-semibold text-xl border border-border text-gray-500 text-center">
                      10 - 5 = ?
                    </div>
                    <input
                      required
                      type="number"
                      className="w-32 px-6 py-3 bg-white dark:bg-slate-900 border border-border rounded-xl focus:ring-2 focus:ring-primary transition-all font-semibold text-xl text-gray-500 text-center shadow-inner"
                      placeholder="Ans"
                      value={captchaAnswer}
                      onChange={e => setCaptchaAnswer(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full py-5 bg-primary text-white rounded-[24px] font-semibold text-xl hover:bg-primary-hover transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-1 active:translate-y-0"
                >
                  {bookingLoading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-6 w-6" />
                      Finalize Selection
                    </>
                  )}
                </button>
                
                {!user && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center p-4 bg-destructive/5 text-destructive text-sm font-semibold rounded-2xl border border-destructive/10"
                  >
                    Account access required for sacred bookings.
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}


