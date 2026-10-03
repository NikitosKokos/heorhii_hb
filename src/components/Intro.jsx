import { motion } from 'motion/react'
import { useState } from 'react'
import { boing } from '../fx'

const dodges = ['Открыть 🎁', 'Точно открыть? 🤔', 'Ну давай уже! 😤']

export default function Intro({ onOpen }) {
  const [step, setStep] = useState(0)

  const handleClick = () => {
    // two fake-out clicks before it actually opens
    if (step < dodges.length - 1) {
      boing()
      setStep(step + 1)
      return
    }
    onOpen()
  }

  return (
    <motion.div
      className="intro"
      exit={{ opacity: 0, scale: 3, rotate: 25, filter: 'blur(20px)' }}
      transition={{ duration: 0.7 }}
    >
      <motion.div
        className="intro-gift"
        animate={{ rotate: [0, -12, 12, -12, 12, 0], scale: [1, 1.1, 1, 1.15, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.6 }}
      >
        🎁
      </motion.div>
      <h2 className="intro-title">Георгий, тебе посылка!</h2>
      <p className="intro-sub">Осторожно: содержимое может вызвать улыбку 😁</p>
      <motion.button
        key={step}
        className="btn btn-big"
        onClick={handleClick}
        initial={{ scale: 0.3, rotate: step ? 360 : 0 }}
        animate={{ scale: 1, rotate: 0, x: step === 1 ? 40 : step === 2 ? -40 : 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 12 }}
      >
        {dodges[step]}
      </motion.button>
      <p className="intro-hint">🔊 со звуком веселее</p>
    </motion.div>
  )
}
