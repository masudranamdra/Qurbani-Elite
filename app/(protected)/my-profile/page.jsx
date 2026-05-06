'use client'

import { useAuth } from '@/lib/auth-context'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { 
  User, 
  Mail, 
  Shield, 
  Edit3, 
  LogOut, 
  ArrowRight, 
  Camera, 
  Star, 
  Award, 
  Heart, 
  Clock, 
  MapPin, 
  Calendar,
  CheckCircle2,
  Phone,
  Home
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { formatPrice } from '@/lib/utils'

export default function MyProfilePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { user, loading, logout } = useAuth()
  const [bookings, setBookings] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [cancelingOrder, setCancelingOrder] = useState(null)
  const sessionLoading = status === 'loading'
  const isLoading = sessionLoading || loading

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    let mounted = true

    async function loadOrders() {
      if (!user) {
        setBookings([])
        setOrdersLoading(false)
        return
      }

      setOrdersLoading(true)
      try {
        const response = await fetch('/api/bookings')
        if (!response.ok) {
          throw new Error('Unable to load bookings')
        }

        const data = await response.json()
        if (mounted) {
          setBookings(data.orders || [])
        }
      } catch (error) {
        console.error('Bookings fetch error:', error)
        if (mounted) {
          setBookings([])
        }
      } finally {
        if (mounted) {
          setOrdersLoading(false)
        }
      }
    }

    if (!loading) {
      loadOrders()
    }

    return () => {
      mounted = false
    }
  }, [user, loading])

  const handleCancel = async (bookingId) => {
    setCancelingOrder(bookingId)
    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: bookingId, action: 'cancel' })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Unable to cancel booking')
      }

      const data = await response.json()
      setBookings((current) => current.map((item) => (item.id === bookingId ? data.order : item)))
      toast.success('Booking cancelled successfully.')
    } catch (error) {
      console.error('Cancel booking error:', error)
      toast.error(error.message || 'Cancellation failed')
    } finally {
      setCancelingOrder(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <LoadingSpinner />
      </div>
    )
  }

  const profile = user || session?.user || {}

  const profileFields = [
    { icon: User, label: 'Legal Name', value: profile.name || 'Unknown' },
    { icon: Mail, label: 'Communication', value: profile.gmail || profile.email || 'Not provided' },
    { icon: Phone, label: 'Secure Line', value: profile.phone || 'Not provided' },
    { icon: MapPin, label: 'Elite Location', value: profile.address || 'Not provided' },
    { icon: Home, label: 'Mansion / Home', value: profile.home || 'Not provided' },
  ]

  const activeBookings = bookings.filter((booking) => booking.status !== 'Cancelled').length

  const stats = [
    { label: 'Active Bookings', value: activeBookings.toString(), icon: Award, accent: 'bg-primary/10', color: 'text-primary' },
    { label: 'Saved Animals', value: '0', icon: Heart, accent: 'bg-rose-500/10', color: 'text-rose-500' },
    { label: 'Market Visits', value: '18', icon: Star, accent: 'bg-amber-500/10', color: 'text-amber-500' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <motion.div 
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-[56px] overflow-hidden border border-border/80 shadow-3xl shadow-primary/10"
      >
        <section className="relative bg-slate-950/5 dark:bg-slate-950">
          <div className="relative h-150">
            <Image
              src={'https://i.ibb.co.com/95v6dB3/leon-ephraim-Axo-Nnn-H1-Y98-unsplash.jpg'||user.coverURL}
              alt="Cover image"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(5,150,105,0.16),_transparent_24%)]" />
          </div>

          <div className="absolute inset-x-0 bottom-0 px-6 md:px-12 pb-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 rounded-[40px] bg-gradient-to-br from-sky-50/1 via-blue-100/1 to-green-100/20 border border-white/10 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-md">
              <div className="flex items-center gap-6">
                <div className="relative w-40 h-40 rounded-[32px] border-8 border-slate-950/90 overflow-hidden shadow-2xl bg-card">
                  <Image
                    src={user.photoURL || 'https://i.pravatar.cc/150?u=default'}
                    alt={user.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <Link
                    href="/update-profile"
                    className="absolute inset-0 flex items-center justify-center bg-slate-950/20 opacity-0 hover:opacity-100 transition-opacity text-white"
                  >
                    <Camera className="h-6 w-6" />
                  </Link>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-300 mb-3">Qurbani Elite</p>
                  <h1 className="text-5xl font-black tracking-tight text-white">{user.name}</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300/90">
                    {user.nickname ? `Known as ${user.nickname} in elite marketplace circles — your verified profile brings trust, bookings, and premium livestock management together.` : 'Your verified profile brings trust, bookings, and premium livestock management together.'}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] border border-white/10 text-white">
                      <Shield className="h-4 w-4" /> Verified Elite
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] border border-amber-500/20 text-amber-200">
                      <Star className="h-4 w-4" /> Premium Member
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-1 lg:grid-cols-2">
                <Link
                  href="/update-profile"
                  className="inline-flex items-center justify-center gap-3 rounded-3xl bg-emerald-500 px-8 py-4 text-sm font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-emerald-500/20 transition-transform hover:-translate-y-0.5"
                >
                  <Edit3 className="h-5 w-5" /> Edit Profile
                </Link>
                <button
                  onClick={logout}
                  className="inline-flex items-center justify-center gap-3 rounded-3xl bg-slate-900/90 px-8 py-4 text-sm font-black uppercase tracking-[0.2em] text-white border border-white/10 shadow-xl shadow-slate-950/20 transition-transform hover:-translate-y-0.5"
                >
                  <LogOut className="h-5 w-5" /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-12 pb-16 pt-24">
          <div className="grid xl:grid-cols-[360px_1fr] gap-10">
            <aside className="space-y-10">
              <div className="rounded-[40px] bg-card/95 border border-border p-8 shadow-xl shadow-slate-900/5">
                <h2 className="text-xs font-black text-foreground/40 uppercase tracking-[0.3em] mb-6">Personal Credentials</h2>
                <div className="space-y-5">
                  {profileFields.map((field, index) => (
                    <div key={index} className="flex items-start gap-5 p-5 rounded-[32px] bg-primary/5 dark:bg-slate-900/60 border border-border/60 transition hover:bg-white dark:hover:bg-slate-900">
                      <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-3xl bg-white dark:bg-slate-800 text-primary shadow-sm">
                        <field.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-muted-foreground mb-1">{field.label}</p>
                        <p className="text-lg font-black text-foreground truncate">{field.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[40px] bg-primary/5 p-8 border border-primary/10 shadow-xl shadow-primary/5">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-[24px] bg-white text-primary shadow-sm">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-2xl font-black text-foreground tracking-tight">Data Privacy Protected</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground opacity-90">Your credentials and booking history are protected in the marketplace with the same premium care you expect from a professional livestock platform.</p>
              </div>
            </aside>

            <main className="space-y-16">
              <div className="grid sm:grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                  <motion.article
                    key={index}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="rounded-[40px] bg-card dark:bg-slate-900/75 p-10 border border-border/70 shadow-xl shadow-slate-100/40 hover:shadow-primary/10 transition-all"
                  >
                    <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-[22px] ${stat.accent} ${stat.color}`}>
                      <stat.icon className="h-7 w-7" />
                    </div>
                    <p className="text-5xl font-black text-foreground mb-2">{stat.value}</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground">{stat.label}</p>
                  </motion.article>
                ))}
              </div>

              <div className="space-y-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary text-white shadow-xl shadow-primary/20">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-foreground tracking-tight">Professional Booking History</h2>
                      <p className="text-sm text-muted-foreground">A modern snapshot of your verified booking activity.</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-border/70 bg-sky-500/50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{bookings.length} Records</span>
                </div>

                <div className="space-y-6">
                  <AnimatePresence mode="popLayout">
                    {ordersLoading ? (
                      <div className="rounded-[40px] border border-border/70 bg-slate-50 p-16 text-center text-muted-foreground">Loading booking history...</div>
                    ) : bookings.length > 0 ? (
                      bookings.map((booking, index) => (
                        <motion.article
                          key={booking.id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group rounded-[40px] border border-border/70 bg-card dark:bg-slate-950/80 p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all"
                        >
                          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-5">
                              <div className="relative h-40 w-40 overflow-hidden rounded-[32px] border border-slate-200/80 shadow-sm">
                                <Image
                                  src={booking.animalImage}
                                  alt={booking.animalName}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                              <div>
                                <div className="flex flex-wrap items-center gap-3">
                                  <h3 className="text-2xl font-black text-foreground">{booking.animalName}</h3>
                                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">#{booking.orderNumber}</span>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{booking.address}</span>
                                  <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />{booking.preferredDate}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-center md:text-right">
                              <p className="text-2xl font-black text-primary">{formatPrice(booking.animalPrice)}</p>
                              <span className="mt-3 inline-flex rounded-full bg-primary/10 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-primary font-black">{booking.status}</span>
                            </div>
                          </div>
                          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-4 text-[11px] font-bold text-muted-foreground">
                            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Vet Inspected</span>
                            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Transport Booked</span>
                            {booking.status !== 'Cancelled' && (
                              <button
                                type="button"
                                onClick={() => handleCancel(booking.id)}
                                disabled={cancelingOrder === booking.id}
                                className="inline-flex items-center gap-2 rounded-3xl bg-destructive/10 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-destructive font-black transition hover:bg-destructive/20 disabled:opacity-60"
                              >
                                {cancelingOrder === booking.id ? 'Cancelling' : 'Cancel Booking'}
                              </button>
                            )}
                          </div>
                        </motion.article>
                      ))
                    ) : (
                      <div className="rounded-[40px] border border-dashed border-border/70 bg-sky-500/10 py-20 px-8 text-center">
                        <Award className="mx-auto mb-6 h-16 w-16 text-muted-foreground opacity-30" />
                        <h3 className="text-2xl font-black text-foreground mb-3">No Professional Bookings Yet</h3>
                        <p className="mx-auto max-w-lg text-sm leading-7 text-muted-foreground opacity-90">Your elite selection will appear here once you finalize a booking in the marketplace.</p>
                        <Link href="/animals" className="mt-10 inline-flex items-center gap-3 rounded-3xl bg-primary px-10 py-4 text-sm font-black text-white shadow-xl shadow-primary/20 transition hover:-translate-y-0.5">
                          Start Selection
                          <ArrowRight className="h-5 w-5" />
                        </Link>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </main>
          </div>
        </section>
      </motion.div>
    </div>
  )
}
