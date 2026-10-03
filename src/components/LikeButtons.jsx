import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import { boing, fireworks, ding, rand } from '../fx'

const NO_LABELS = [
  'Мне не нравится 😒',
  'Не-а 😏',
  'Слишком медленно 🐢',
  'Даже не пытайся 😂',
  'Я быстрее 🏃‍♂️💨',
  'Сдавайся 🏳️',
  'Ладно, ладно… нравится же? 😘',
]

export default function LikeButtons({ onToast }) {
  const area = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [escapes, setEscapes] = useState(0)
  const [liked, setLiked] = useState(false)

  const runAway = (e) => {
    e?.preventDefault()
    const box = area.current.getBoundingClientRect()
    const maxX = box.width / 2 - 90
    const maxY = box.height / 2 - 30
    setPos({ x: rand(-maxX, maxX), y: rand(-maxY, maxY) })
    setEscapes((n) => n + 1)
    boing()
    if (escapes === 6) onToast('🏅 Достижение: «Упорство» — 7 попыток поймать кнопку')
  }

  const like = (e) => {
    e.stopPropagation()
    setLiked(true)
    ding()
    fireworks(2500)
  }

  return (
    <section className="card">
      <h2>🤔 Ну как тебе сайт?</h2>
      <div className="like-area" ref={area}>
        <motion.button
          className="btn btn-yes"
          onClick={like}
          animate={{ scale: 1 + Math.min(escapes, 8) * 0.12 }}
          whileHover={{ scale: 1.15 + Math.min(escapes, 8) * 0.12 }}
          whileTap={{ scale: 0.9 }}
        >
          {liked ? 'Кто бы сомневался 💖' : 'Мне нравится 😍'}
        </motion.button>
        <motion.button
          className="btn btn-no"
          animate={{ x: pos.x, y: pos.y, rotate: escapes ? rand(-25, 25) : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 18 }}
          onPointerEnter={runAway}
          onPointerDown={runAway}
          onClick={(e) => (e.stopPropagation(), onToast('Ошибка 404: обида не найдена 🤖'))}
        >
          {NO_LABELS[Math.min(escapes, NO_LABELS.length - 1)]}
        </motion.button>
      </div>
    </section>
  )
}
