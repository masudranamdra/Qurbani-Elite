'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { 
  User, 
  Image as ImageIcon, 
  Save, 
  ArrowLeft, 
  Camera, 
  MapPin, 
  Phone, 
  AtSign, 
  Home, 
  Sparkles,
  Mail
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

const initialFormState = {
  name: '',
  nickname: '',
  email: '',
  gmail: '',
  phone: '',
  address: '',
  home: '',
  photoURL: '',
  coverURL: ''
}

export default function UpdateProfilePage() {
  const { user, loading: authLoading, updateProfile } = useAuth()
  const router = useRouter()
  
  const [formData, setFormData] = useState(() => ({
    name: user?.name || '',
    nickname: user?.nickname || '',
    email: user?.email || '',
    gmail: user?.gmail || '',
    phone: user?.phone || '',
    address: user?.address || '',
    home: user?.home || '',
    photoURL: user?.photoURL || '',
    coverURL: user?.coverURL || ''
  }))
  const [photoPreview, setPhotoPreview] = useState(user?.photoURL || '')
  const [coverPreview, setCoverPreview] = useState(user?.coverURL || '')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  const validateForm = () => {
    const nextErrors = {}
    if (!formData.name.trim()) nextErrors.name = 'Name is required.'
    if (!formData.phone.trim()) nextErrors.phone = 'Phone number is required.'
    if (!formData.gmail.trim()) nextErrors.gmail = 'Email is required.'
    if (!formData.photoURL.trim()) nextErrors.photoURL = 'Profile image is required.'
    if (!formData.coverURL.trim()) nextErrors.coverURL = 'Cover image is required.'
    return nextErrors
  }

  const handleFileSelect = async (type, file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      setFormData((prev) => ({ ...prev, [type]: result }))
      if (type === 'photoURL') setPhotoPreview(result)
      if (type === 'coverURL') setCoverPreview(result)
    }
    reader.readAsDataURL(file)
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors((prev) => ({ ...prev, ...validateForm() }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateForm()
    setErrors(validationErrors)
    setTouched({ name: true, phone: true, gmail: true, photoURL: true, coverURL: true })

    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please complete the highlighted fields.')
      return
    }

    setLoading(true)
    try {
      await updateProfile(formData)
      toast.success('Professional profile updated!', {
        icon: '🏛️',
        style: { borderRadius: '20px', fontWeight: 'bold' }
      })
      router.push('/my-profile')
    } catch {
      toast.error('Failed to update credentials.')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || !user) return <div className="min-h-[60vh] flex items-center justify-center"><LoadingSpinner /></div>

  const renderInputClass = (field) => {
    const hasError = touched[field] && errors[field]
    return `w-full pl-16 pr-6 py-5 bg-sky-500/2 dark:bg-slate-900/50 border ${hasError ? 'border-destructive/60 ring-2 ring-destructive/10' : 'border-transparent'} rounded-3xl focus:border-primary focus:ring-2 focus:ring-primary transition-all font-bold shadow-inner`
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-20 md:mt-10">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <Link href="/my-profile" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-black mb-10 transition-colors group">
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Back to Elite Profile
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[56px] border border-border/80 bg-card shadow-3xl shadow-slate-200/50 dark:bg-slate-950 dark:shadow-none">
        <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-900">
          <Image
            src={coverPreview || formData.coverURL || 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=1200'}
            alt="Cover preview"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-slate-950/30" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
            <div className="space-y-4">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-white/80">Cover Image</p>
              <p className="max-w-lg text-sm leading-6 text-white/80">Upload a strong brand cover image to make your profile feel premium and trusted.</p>
            </div>
            <label htmlFor="cover-upload" className="inline-flex items-center gap-2 rounded-3xl bg-white/95 px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-slate-950 shadow-lg transition hover:-translate-y-0.5 cursor-pointer">
              <Camera className="h-5 w-5 text-primary" />
              Upload Cover
            </label>
          </div>
          <input id="cover-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect('coverURL', e.target.files?.[0] || null)} />
        </div>

        <div className="px-12 pb-16 pt-10">
          <div className="grid gap-10 lg:grid-cols-[280px_1fr] items-start">
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-[36px] border border-border/70 bg-gradient-to-br from-sky-200 via-blue-100 to-green-200 p-6 shadow-xl shadow-slate-900/5">
                <div className="relative mx-auto h-44 w-44 overflow-hidden rounded-[38px] border-8 border-white bg-slate-100 shadow-md ">
                  <Image
                    src={photoPreview || formData.photoURL || 'https://i.pravatar.cc/150?u=default'}
                    alt="Profile preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="mt-8 text-center">
                  <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-3">Profile Preview</p>
                  <p className="text-2xl font-black text-foreground">{formData.name || 'Elite User'}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Instant preview of profile image and cover before saving.</p>
                </div>
                <label htmlFor="photo-upload" className="absolute bottom-6 right-6 inline-flex items-center gap-2 rounded-3xl bg-primary px-4 py-3 text-sm font-black text-white shadow-lg cursor-pointer hover:-translate-y-0.5 transition">
                  <Camera className="h-4 w-4" /> Update Photo
                </label>
                <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect('photoURL', e.target.files?.[0] || null)} />
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <div>
                  <h1 className="text-4xl font-black text-foreground tracking-tight">Refine Credentials</h1>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">A modern profile editor for your Qurbani marketplace identity, contact, and trusted logistics.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[32px] border border-border/70 bg-slate-50 p-6 dark:bg-slate-900/70">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-2">Profile Strength</p>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                      <div className="h-full w-4/5 rounded-full bg-primary transition-all" />
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">Your profile is 80% complete. Fill in all fields for maximum trust.</p>
                  </div>
                  <div className="rounded-[32px] border border-border/70 bg-slate-50 p-6 dark:bg-slate-900/70">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-2">Trusted Connections</p>
                    <p className="text-3xl font-black text-foreground">1.2k</p>
                    <p className="mt-3 text-sm text-muted-foreground">Verified members and livestock professionals trust your account.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12 mt-8">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Identity Matrix</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Legal Name</label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
                      <input
                        required
                        type="text"
                        className={renderInputClass('name')}
                        placeholder="Jane Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        onBlur={() => handleBlur('name')}
                      />
                    </div>
                    {touched.name && errors.name && <p className="text-destructive text-sm font-bold">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Elite Nickname</label>
                    <div className="relative">
                      <AtSign className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
                      <input
                        type="text"
                        className="w-full pl-16 pr-6 py-5 bg-sky-500/2 dark:bg-slate-900/50 border border-transparent rounded-3xl focus:border-primary focus:ring-2 focus:ring-primary transition-all font-bold shadow-inner"
                        placeholder="e.g. QurbaniKing"
                        value={formData.nickname}
                        onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Profile Photo URL</label>
                    <div className="relative">
                      <ImageIcon className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
                      <input
                        required
                        type="url"
                        className={renderInputClass('photoURL')}
                        placeholder="Paste high-quality photo link"
                        value={formData.photoURL}
                        onChange={(e) => setFormData({ ...formData, photoURL: e.target.value })}
                        onBlur={() => handleBlur('photoURL')}
                      />
                    </div>
                    {touched.photoURL && errors.photoURL && <p className="text-destructive text-sm font-bold">{errors.photoURL}</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Logistics & Contact</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Verified Phone</label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
                      <input
                        required
                        type="tel"
                        className={renderInputClass('phone')}
                        placeholder="+880 1700-000000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        onBlur={() => handleBlur('phone')}
                      />
                    </div>
                    {touched.phone && errors.phone && <p className="text-destructive text-sm font-bold">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Gmail / Email</label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
                      <input
                        required
                        type="email"
                        className={renderInputClass('gmail')}
                        placeholder="name@gmail.com"
                        value={formData.gmail}
                        onChange={(e) => setFormData({ ...formData, gmail: e.target.value })}
                        onBlur={() => handleBlur('gmail')}
                      />
                    </div>
                    {touched.gmail && errors.gmail && <p className="text-destructive text-sm font-bold">{errors.gmail}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">City Address</label>
                      <div className="relative">
                        <MapPin className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
                        <input
                          type="text"
                          className="w-full pl-16 pr-6 py-5 bg-sky-500/10 dark:bg-slate-900/50 border border-transparent rounded-3xl focus:border-primary focus:ring-2 focus:ring-primary transition-all font-bold shadow-inner"
                          placeholder="Dhaka, BD"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Home / Villa</label>
                      <div className="relative">
                        <Home className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
                        <input
                          type="text"
                          className="w-full pl-16 pr-6 py-5 bg-sky-500/10 dark:bg-slate-900/50 border border-transparent rounded-3xl focus:border-primary focus:ring-2 focus:ring-primary transition-all font-bold shadow-inner"
                          placeholder="Mansion Name"
                          value={formData.home}
                          onChange={(e) => setFormData({ ...formData, home: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10 flex flex-col sm:flex-row gap-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-grow rounded-[32px] bg-primary px-10 py-6 text-xl font-black text-white shadow-3xl shadow-primary/30 transition hover:bg-primary-hover disabled:opacity-70 active:scale-95"
              >
                {loading ? (
                  <div className="mx-auto h-7 w-7 animate-spin rounded-full border-3 border-white/30 border-t-white" />
                ) : (
                  <div className="inline-flex items-center justify-center gap-4">
                    <Save className="h-6 w-6" />
                    Secure Final Changes
                  </div>
                )}
              </button>
              <Link href="/my-profile" className="inline-flex items-center justify-center rounded-[32px] bg-secondary/5 px-10 py-6 text-xl font-black text-foreground transition hover:bg-secondary/10">
                Discard
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

