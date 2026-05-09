'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Truck, Award, Sparkles, Zap, Shield, Heart } from 'lucide-react'

import { useAnimals } from '@/hooks/useAnimals'
import AnimalCard from '@/components/animals/AnimalCard'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

export default function HomePage() {
  const { animals, loading } = useAnimals()
  const featuredAnimals = animals.slice(0, 4)

  const stats = [
    { label: 'Verified Partners', value: '250+', icon: ShieldCheck, color: 'text-primary' },
    { label: 'Elite Deliveries', value: '18K+', icon: Truck, color: 'text-amber-600' },
    { label: 'Customer Trust', value: '99.9%', icon: Award, color: 'text-emerald-700' },
  ]

  const tips = [
    { title: 'Prime Maturity', description: 'Certified maturity standards ensuring optimal spiritual and physical readiness.', icon: Zap },
    { title: 'Pure Assurance', description: '100% natural, pasture-fed regimen without any artificial enhancements.', icon: Shield },
    { title: 'Sacred Trust', description: 'Ethical sourcing that respects both the animal and the tradition.', icon: Heart },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="space-y-32 pb-32">
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://i.ibb.co/vn7tnPg/david-dolenc-1-AKu-Vm-Qx-Uk-U-unsplash.jpg"
            fill
            priority
            className="object-cover"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/90 via-secondary/70 to-background" />
        </div>
        
        <div className="relative md:mt-20 z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm text-primary font-semibold text-xs mb-8 tracking-wider uppercase"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-primary">The Gold Standard for Qurbani 2026</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tight leading-[1.1]"
          >
            Elite Tradition, <br />
            <span className="gradient-text">Absolute Purity.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Secure the finest livestock for your sacred sacrifice. Direct from ethically managed organic farms with premium home delivery.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/animals"
              className="px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              Explore Collection
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl font-semibold text-base transition-all border border-white/20 hover:-translate-y-0.5 active:translate-y-0"
            >
              Partner with Us
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10" />
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
        >
          <motion.div variants={itemVariants} className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">Premium <span className="text-primary">Masterpieces</span></h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Every animal in our elite inventory has been personally inspected for health, aesthetics, and spiritual readiness.
            </p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link href="/animals" className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
              Full Inventory <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredAnimals.map((animal, i) => (
              <AnimalCard key={animal.id} animal={animal} index={i} />
            ))}
          </div>
        )}
      </section>

      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 origin-left translate-y-12" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight tracking-tight">Defining the <br /><span className="text-primary">Superior Grade</span></h2>
              <div className="space-y-4">
                {tips.map((tip, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 8 }}
                    className="flex gap-5 p-6 bg-white dark:bg-slate-900/50 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <tip.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-1 text-foreground">{tip.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{tip.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -inset-10 bg-primary/10 rounded-full blur-3xl opacity-30" />
              <div className="grid grid-cols-2 gap-6 relative">
                <div className="space-y-6 pt-12">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-xl border border-white/10 transition-transform duration-300 hover:scale-105">
                    <Image 
                      src="https://i.ibb.co/dwjFtC6q/virginia-long-dp5o5-ERk-Tqg-unsplash.jpg" 
                      fill
                      className="object-cover" 
                      alt="Premium Specimen 1" 
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-xl border border-white/10 transition-transform duration-300 hover:scale-105">
                    <Image 
                      src="https://i.ibb.co/zVr8WfFk/mitchell-orr-Cmn-Xpswx8-QQ-unsplash.jpg" 
                      fill
                      className="object-cover" 
                      alt="Premium Specimen 2" 
                    />
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-secondary rounded-3xl p-12 md:p-16 border border-white/10 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-3xl -mr-48 -mt-48 opacity-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 blur-3xl -ml-48 -mb-48 opacity-10" />
          
          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            {stats.map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center space-y-4"
              >
                <div className={`inline-flex p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm ${stat.color}`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-5xl font-bold text-white tracking-tight mb-2">{stat.value}</h3>
                  <p className="text-white/50 font-semibold uppercase tracking-wider text-xs">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <div className="relative bg-white dark:bg-secondary rounded-3xl p-12 md:p-16 overflow-hidden text-center border border-border shadow-xl">
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-tight tracking-tight">Ready for a <br /><span className="text-primary">Sacred Selection?</span></h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Experience the convergence of ancient tradition and modern transparency. Your perfect sacrifice is one click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/animals" className="px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
                Begin Selection
              </Link>
              <Link href="/contact" className="px-8 py-4 bg-secondary dark:bg-white/10 text-white rounded-xl font-semibold text-base hover:bg-secondary-hover dark:hover:bg-white/20 transition-all border border-white/20 hover:-translate-y-0.5 active:translate-y-0">
                Consult Expert
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight">
            How to Buy <span className="text-primary">Qurbani Animals</span>
          </h2>
          <p className="text-xl text-muted-foreground font-medium leading-relaxed">
            Follow our simple, transparent process to select and purchase your perfect sacrifice animal.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              step: '01',
              title: 'Browse & Select',
              description: 'Explore our verified collection of premium livestock with detailed profiles and pricing.',
              icon: '🔍'
            },
            {
              step: '02',
              title: 'Verify Quality',
              description: 'Check health certificates, age verification, and spiritual purity documentation.',
              icon: '✅'
            },
            {
              step: '03',
              title: 'Secure Payment',
              description: 'Complete your purchase with our secure payment system and instant confirmation.',
              icon: '💳'
            },
            {
              step: '04',
              title: 'Home Delivery',
              description: 'Receive your selected animal at your doorstep with professional handling.',
              icon: '🚚'
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-3xl border border-border/50 hover:border-primary/30 transition-all group hover:-translate-y-2"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
              <div className="text-sm font-black text-primary uppercase tracking-widest mb-3">{item.step}</div>
              <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-sky-50 via-blue-100 to-green-100 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-secondary mb-6 tracking-tight">
              How to Sell <span className="text-primary">Your Animals</span>
            </h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">
              Join our network of trusted farmers and reach customers nationwide with our platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'List Your Livestock',
                description: 'Create detailed listings with photos, health certificates, and pricing information.',
                icon: '📝',
                color: 'bg-blue-500/20 text-blue-400'
              },
              {
                title: 'Reach Customers',
                description: 'Connect with verified buyers across Bangladesh through our marketplace.',
                icon: '🤝',
                color: 'bg-green-500/20 text-green-400'
              },
              {
                title: 'Secure Transactions',
                description: 'Receive payments safely and complete deliveries with our support system.',
                icon: '🔒',
                color: 'bg-purple-500/20 text-purple-400'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass p-8 rounded-3xl border border-white/10 hover:border-primary/30 transition-all group hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-4">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight">
            Why Trust <span className="text-primary">Our Platform</span>
          </h2>
          <p className="text-xl text-muted-foreground font-medium leading-relaxed">
            Built on transparency, quality, and Islamic principles for over 8 years.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'Verified Animals',
              description: 'Every animal undergoes rigorous health and age verification by certified veterinarians.',
              icon: '🏥'
            },
            {
              title: 'Islamic Compliance',
              description: 'All processes follow Islamic guidelines for Qurbani, ensuring spiritual purity.',
              icon: '🕌'
            },
            {
              title: 'Transparent Pricing',
              description: 'No hidden fees or commissions. Clear pricing from farm to customer.',
              icon: '💰'
            },
            {
              title: 'Expert Support',
              description: '24/7 customer support and consultation with Islamic scholars and veterinarians.',
              icon: '👨‍⚕️'
            },
            {
              title: 'Secure Payments',
              description: 'Bank-grade security for all transactions with multiple payment options.',
              icon: '🔐'
            },
            {
              title: 'Nationwide Delivery',
              description: 'Professional transportation ensuring animal welfare during delivery.',
              icon: '🚛'
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-3xl border border-border/50 hover:border-primary/30 transition-all group hover:-translate-y-2 text-center"
            >
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-sky-50 via-blue-100 to-green-100 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight">
              Marketplace <span className="text-primary">Benefits</span>
            </h2>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed">
              Experience the advantages of our modern Qurbani marketplace platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Advanced Search & Filters',
                description: 'Find exactly what you need with our powerful search and filtering system.',
                features: ['Real-time search', 'Category filters', 'Price range', 'Location-based'],
                icon: '🔍'
              },
              {
                title: 'Quality Assurance',
                description: 'Every animal is verified for health, age, and Islamic compliance.',
                features: ['Vet certification', 'Age verification', 'Health reports', 'Islamic approval'],
                icon: '✅'
              },
              {
                title: 'Convenient Delivery',
                description: 'Professional delivery service ensuring animal welfare and timely arrival.',
                features: ['Nationwide coverage', 'Professional handlers', 'Live tracking', 'Insurance included'],
                icon: '🚚'
              },
              {
                title: 'Community Support',
                description: 'Join a community of believers committed to ethical Qurbani practices.',
                features: ['Expert guidance', 'Islamic resources', 'Community forum', 'Educational content'],
                icon: '🤝'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass p-8 rounded-3xl border border-border/50 hover:border-primary/30 transition-all group hover:-translate-y-2"
              >
                <div className="flex items-start gap-6">
                  <div className="text-4xl group-hover:scale-110 transition-transform">{item.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-4">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">{item.description}</p>
                    <ul className="space-y-2">
                      {item.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
