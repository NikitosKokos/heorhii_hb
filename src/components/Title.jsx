import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { boing, emojiBurst, rand } from '../fx'

const LINES = [
  ['С', 'днем', 'рождения'],
  ['Георгий!'],
]

const TAGLINES = [
  'Уровень повышен: +1 🎮',
  'Официально стал ещё круче 😎',
  'Батарея мудрости заряжена на 99% 🔋',
  'Возраст — это просто число. Большое число 🤫',
  'Сегодня тебе можно ВСЁ (почти) 🎉',
  'Торт сам себя не съест 🍰',
  'Студент, вайбкодер и качок в одном флаконе 🎓💻💪',
  'Yare yare daze… ещё один год 🧢',
  'Сила: A · Скорость: A · Сон: E 😴',
  'Сегодня день груди. И день рождения 🏋️',
  'git commit -m "Георгий +1" 💻',
]

function Letter({ char, index }) {
  const [spin, setSpin] = useState(0)

  const handleClick = (e) => {
    e.stopPropagation()
    boing()
    emojiBurst(e.clientX, e.clientY, 5)
    setSpin((s) => s + 1)
  }

  return (
    <motion.span
      className="letter-wrap"
      initial={{ y: rand(-700, -300), x: rand(-300, 300), rotate: rand(-720, 720), opacity: 0, scale: 3 }}
      animate={{ y: 0, x: 0, rotate: spin * 360, opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 9, delay: spin ? 0 : 0.3 + index * 0.07 }}
      whileHover={{ scale: 1.5, y: -20 }}
      onClick={handleClick}
    >
      <span className="letter" style={{ animationDelay: `${index * -0.15}s` }}>
        {char}
      </span>
    </motion.span>
  )
}

export default function Title() {
  const [tag, setTag] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTag((t) => (t + 1) % TAGLINES.length), 2600)
    return () => clearInterval(id)
  }, [])

  let i = 0
  return (
    <header className="title-block">
      <span className="menacing side left" aria-hidden>ゴ<br />ゴ<br />ゴ</span>
      <span className="menacing side right" aria-hidden>ゴ<br />ゴ<br />ゴ</span>
      <h1 className="title" aria-label="С днем рождения, Георгий!">
        {LINES.map((words, li) => (
          <span key={li} className={`title-line ${li === 1 ? 'title-name' : ''}`}>
            {words.map((w, wi) => (
              <span key={wi} className="word">
                {[...w].map((c) => (
                  <Letter key={i} char={c} index={i++} />
                ))}
              </span>
            ))}
          </span>
        ))}
      </h1>

      <div className="tagline">
        <AnimatePresence mode="wait">
          <motion.p
            key={tag}
            initial={{ y: 30, opacity: 0, rotateX: 90 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: -30, opacity: 0, rotateX: -90 }}
            transition={{ duration: 0.35 }}
          >
            {TAGLINES[tag]}
          </motion.p>
        </AnimatePresence>
      </div>
      <p className="hint">👆 Тыкай в буквы. И вообще во всё.</p>
    </header>
  )
}
