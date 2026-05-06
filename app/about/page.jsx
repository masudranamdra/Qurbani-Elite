'use client'

import { motion } from 'framer-motion'
import { Heart, Star, BookOpen, Users, Shield, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function AboutTraditionPage() {
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

  const traditionPoints = [
    {
      title: 'The Significance of Qurbani',
      description: 'Qurbani is a fundamental Islamic practice that commemorates Prophet Ibrahim\'s willingness to sacrifice his son Ismail for Allah. It teaches us the values of obedience, sacrifice, and submission to divine will.',
      icon: Heart,
      color: 'text-red-500'
    },
    {
      title: 'Spiritual Benefits',
      description: 'Performing Qurbani purifies wealth and brings spiritual rewards. It demonstrates our commitment to Allah and helps us develop compassion and generosity towards others.',
      icon: Star,
      color: 'text-yellow-500'
    },
    {
      title: 'Community Welfare',
      description: 'The meat from Qurbani is distributed to the poor and needy, fostering community bonds and ensuring that everyone can participate in the celebration of Eid al-Adha.',
      icon: Users,
      color: 'text-blue-500'
    },
    {
      title: 'Ethical Animal Treatment',
      description: 'Islam emphasizes humane treatment of animals. Qurbani must be performed with compassion, ensuring the animal feels minimal pain and is treated with respect throughout the process.',
      icon: Shield,
      color: 'text-green-500'
    }
  ]

  const steps = [
    {
      step: '01',
      title: 'Preparation',
      description: 'Select a healthy animal that meets Islamic criteria. Ensure it has been properly fed and cared for.'
    },
    {
      step: '02',
      title: 'Intention (Niyyah)',
      description: 'Make a sincere intention for Qurbani, seeking Allah\'s pleasure and following the Sunnah of Prophet Muhammad (PBUH).'
    },
    {
      step: '03',
      title: 'Proper Method',
      description: 'The animal should be slaughtered by a Muslim who is knowledgeable, using a sharp knife to minimize suffering.'
    },
    {
      step: '04',
      title: 'Distribution',
      description: 'Divide the meat into three parts: one for family, one for relatives/friends, and one for the poor and needy.'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 space-y-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-4xl mx-auto"
      >
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-black text-sm uppercase tracking-widest mb-10">
          <Sparkles className="h-4 w-4" />
          Sacred Tradition
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-foreground mb-8 tracking-tighter">
          About <span className="text-primary italic">Qurbani</span>
        </h1>
        <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-3xl mx-auto">
          Discover the profound meaning, significance, and proper way to perform Qurbani - a cornerstone of Islamic faith that teaches sacrifice, compassion, and community welfare.
        </p>
      </motion.div>

      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="glass p-12 rounded-3xl border border-border/50"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-4xl font-black text-foreground mb-6">What is Qurbani?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Qurbani, also known as Udhiyah, is the Islamic practice of sacrificing an animal during Eid al-Adha.
            It is obligatory for Muslims who can afford it and serves as a reminder of Prophet Ibrahim&apos;s devotion to Allah.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="prose prose-lg max-w-none text-foreground">
          <p className="text-center text-muted-foreground leading-relaxed mb-8">
            The word &quot;Qurbani&quot; comes from the Arabic word &quot;Qurban&quot; which means &quot;sacrifice&quot; or &quot;to draw near to Allah.&quot;
            This sacred ritual is performed to seek Allah&apos;s pleasure and mercy, and to commemorate the willingness of Prophet Ibrahim
            to sacrifice his beloved son Ismail in obedience to Allah&apos;s command.
          </p>

          <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
            <h3 className="text-2xl font-bold text-foreground mb-4 text-center">The Story of Prophet Ibrahim</h3>
            <p className="text-muted-foreground leading-relaxed text-center">
              Prophet Ibrahim was tested by Allah to sacrifice his son Ismail. Despite the immense love he had for his son,
              Ibrahim demonstrated complete submission to Allah&apos;s will. At the moment of sacrifice, Allah replaced Ismail with a ram,
              teaching humanity the virtue of sacrifice and obedience.
            </p>
          </div>
        </motion.div>
      </motion.section>

      <section className="space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-black text-foreground mb-6">The Significance of Qurbani</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Qurbani holds deep spiritual, social, and ethical significance in Islam
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8"
        >
          {traditionPoints.map((point, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="glass p-8 rounded-3xl border border-border/50 hover:border-primary/30 transition-all group hover:-translate-y-2"
            >
              <div className="flex items-start gap-6">
                <div className={`p-4 rounded-2xl bg-white dark:bg-slate-900/50 ${point.color} group-hover:scale-110 transition-transform`}>
                  <point.icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{point.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{point.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="bg-gradient-to-br from-sky-50 via-blue-100 to-green-100 py-24 -mx-6 px-6 rounded-3xl">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-foreground mb-6">How to Perform Qurbani</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Follow these steps to ensure your Qurbani is performed correctly and earns maximum reward
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="glass p-8 rounded-3xl border border-white/10 hover:border-primary/30 transition-all group hover:-translate-y-2 text-center"
              >
                <div className="text-4xl font-black text-primary mb-4 group-hover:scale-110 transition-transform">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-black text-foreground mb-6">Ethical Animal Treatment</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Islam places great emphasis on the humane treatment of animals
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-6">
            <div className="glass p-8 rounded-3xl border border-border/50">
              <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-primary" />
                Islamic Guidelines
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  Use a sharp knife to minimize pain
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  Face the animal towards the Qibla
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  Recite &quot;Bismillah Allahu Akbar&quot; before slaughter
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  Ensure quick and humane slaughter
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass p-8 rounded-3xl border border-border/50">
              <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                Animal Welfare
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  Animals must be healthy and well-fed
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  No cruelty or mistreatment allowed
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  Professional and compassionate handling
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  Respect for all living creatures
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center glass p-12 rounded-3xl border border-border/50"
      >
        <h2 className="text-4xl font-black text-foreground mb-6">
          Ready to Perform Your <span className="text-primary">Qurbani?</span>
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Browse our collection of verified, healthy animals and perform your Qurbani with confidence and peace of mind.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/animals"
            className="px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 hover:-translate-y-1"
          >
            Browse Animals
          </Link>
          <Link
            href="/contact"
            className="px-8 py-4 bg-secondary dark:bg-white/10 text-white rounded-2xl font-bold text-lg hover:bg-secondary-hover dark:hover:bg-white/20 transition-all border border-white/20 hover:-translate-y-1"
          >
            Get Expert Advice
          </Link>
        </div>
      </motion.section>
    </div>
  )
}