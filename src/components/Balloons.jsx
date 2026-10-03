import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { burstAt, emojiBurst, floatText, pick, pop, rand } from '../fx'

const COLORS = ['#ff3cac', '#ffd23f', '#3bceac', '#7b2ff7', '#ff6b35', '#00b4ff', '#ff4d6d']
const FACES = ['', '', '', '😜', '🤪', '😎', '🥳']
const ACHIEVEMENTS = {
  1: '🎈 Первый шарик лопнут! Понеслась',
  10: '🏅 Достижение: «Убийца шариков» — 10 штук',
  25: '🏆 Достижение: «Гроза гелия» — 25 шариков',
  50: '👑 50 шариков! Тебе точно не нужно на работу?',
}

export default function Balloons({ onToast }) {
  const [balloons, setBalloons] = useState([])
  const [popped, setPopped] = useState(0)
  const nextId = useRef(0)

  useEffect(() => {
    const phone = window.matchMedia('(max-width: 700px)')
    const id = setInterval(() => {
      const mobile = phone.matches
      // on phones: half the spawn rate, max 3 at once, small, and only along the screen edges
      if (mobile && Math.random() < 0.5) return
      setBalloons((b) =>
        b.length >= (mobile ? 3 : 11)
          ? b
          : [
              ...b,
              {
                id: nextId.current++,
                left: mobile ? pick([rand(0, 6), rand(80, 86)]) : rand(2, 92),
                color: pick(COLORS),
                face: pick(FACES),
                duration: mobile ? rand(10, 14) : rand(9, 16),
                size: mobile ? rand(38, 50) : rand(55, 85),
              },
            ],
      )
    }, 1300)
    return () => clearInterval(id)
  }, [])

  const remove = (id) => setBalloons((b) => b.filter((x) => x.id !== id))

  const handlePop = (e, balloon) => {
    e.stopPropagation()
    pop()
    burstAt(e.clientX, e.clientY, { particleCount: 25, colors: [balloon.color], startVelocity: 20 })
    emojiBurst(e.clientX, e.clientY, 4, ['💥', '✨', '🎈'])
    floatText(e.clientX, e.clientY, 'ПУФ!')
    remove(balloon.id)
    const next = popped + 1
    setPopped(next)
    if (ACHIEVEMENTS[next]) onToast(ACHIEVEMENTS[next])
  }

  return (
    <>
      <div className="balloon-layer">
        {balloons.map((b) => (
          <motion.button
            key={b.id}
            className="balloon"
            style={{ left: `${b.left}vw`, '--c': b.color, '--s': `${b.size}px` }}
            initial={{ y: '110vh' }}
            animate={{ y: '-30vh' }}
            transition={{ duration: b.duration, ease: 'linear' }}
            onAnimationComplete={() => remove(b.id)}
            onPointerDown={(e) => handlePop(e, b)}
            aria-label="Шарик"
          >
            <span className="balloon-body">{b.face}</span>
            <span className="balloon-string" />
          </motion.button>
        ))}
      </div>
      {popped > 0 && (
        <motion.div className="pop-counter" key={popped} initial={{ scale: 1.6 }} animate={{ scale: 1 }}>
          🎈 Лопнуто: {popped}
        </motion.div>
      )}
    </>
  )
}
