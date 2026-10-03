import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

export const TIME_STOP_MS = 5000

// DIO counting the seconds of stopped time
const TIMELINE = [
  [0, 'ZA WARUDO!'],
  [1300, '1 секунда прошла…'],
  [2300, '2 секунды прошло…'],
  [3300, '3 секунды прошло…'],
  [4200, 'Токи ва угокидасу… ⏱️'],
]

export default function TimeStop() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const ids = TIMELINE.slice(1).map(([at], i) => setTimeout(() => setStep(i + 1), at))
    return () => ids.forEach(clearTimeout)
  }, [])

  // plain wrapper on purpose: opacity/filter on a parent would stop the children's backdrop-filter from seeing the page
  return (
    <div className="ts-root" aria-live="polite">
      <motion.div
        className="ts-tint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      />
      <motion.div
        className="ts-wave"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 3.2, 0] }}
        transition={{ duration: 1.3, ease: 'easeInOut', times: [0, 0.55, 1] }}
      />
      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          className={`ts-text ${step === 0 ? 'big' : ''}`}
          initial={{ scale: 2.5, opacity: 0, rotate: -6 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 14 }}
        >
          {TIMELINE[step][1]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
