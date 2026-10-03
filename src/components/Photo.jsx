import { motion, useAnimationControls } from 'motion/react'
import { useState } from 'react'
import { boing, burstAt, floatText, pick, whoosh } from '../fx'

// Drop the real picture into /public as photo.jpg — placeholder shows until then.
const PHOTO_SRC = '/photo.jpg'

const TRICKS = [
  { rotate: [0, 720], transition: { duration: 1, ease: 'backOut' } },
  { scaleX: [1, 1.7, 0.6, 1.2, 1], scaleY: [1, 0.5, 1.5, 0.9, 1], transition: { duration: 0.9 } },
  { rotateY: [0, 360], transition: { duration: 0.8 } },
  { x: [0, -40, 40, -30, 30, -10, 0], rotate: [0, -10, 10, -8, 8, 0, 0], transition: { duration: 0.6 } },
  { scale: [1, 0.15, 1.5, 1], transition: { duration: 0.9 } },
  { y: [0, -220, 0, -60, 0], rotate: [0, 180, 360, 360, 360], transition: { duration: 1.1 } },
  { skewX: [0, 30, -30, 15, 0], transition: { duration: 0.7 } },
]

const QUOTES = [
  '+100 к крутости 😎',
  'Красавчики! 💅',
  'Легенды 🏆',
  'Лучшие друзья 🤜🤛',
  'Оскар за лучшее фото 🎬',
  'Ну и лица 🤣',
  'Вау 😱',
]

const ORBIT = ['🎈', '🎂', '🥳', '🎉', '🍾', '⭐', '🎁', '💖']

export default function Photo() {
  const controls = useAnimationControls()
  const [failed, setFailed] = useState(false)
  const [clicks, setClicks] = useState(0)

  const handleClick = async (e) => {
    e.stopPropagation()
    const trick = pick(TRICKS)
    if (trick.rotate) whoosh()
    else boing()
    burstAt(e.clientX, e.clientY, { particleCount: 40 })
    floatText(e.clientX, e.clientY, pick(QUOTES))
    setClicks((c) => c + 1)
    await controls.start(trick)
    controls.set({ rotate: 0, rotateY: 0, scale: 1, scaleX: 1, scaleY: 1, x: 0, y: 0, skewX: 0 })
  }

  return (
    <section className="photo-section">
      <div className="orbit">
        {ORBIT.map((em, i) => (
          <span key={i} className="orbit-item" style={{ '--i': i, '--n': ORBIT.length }}>
            <span>{em}</span>
          </span>
        ))}
      </div>

      {/* outer layer does the click tricks, so the frame's clip-path moves with it */}
      <motion.div className="photo-trick" animate={controls} onClick={handleClick}>
        <motion.div
          className="photo-frame"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 80, damping: 10, delay: 1.6 }}
        >
          <div className="photo-inner">
            {failed ? (
              <div className="photo-placeholder">
                <span className="ph-emoji">🤜🤛</span>
                <span>Тут будет наше фото</span>
                <small>(когда кто-то его наконец пришлёт 📸)</small>
              </div>
            ) : (
              <img src={PHOTO_SRC} alt="Мы с Георгием" onError={() => setFailed(true)} draggable={false} />
            )}
          </div>
        </motion.div>
        <span className="party-hat">🥳</span>
        <span className="sunglasses">🕶️</span>
      </motion.div>

      <p className="photo-counter">
        {clicks === 0 ? 'Кликни по фото 👆' : `Фото покручено: ${clicks} раз ${clicks > 9 ? '— голова не кружится? 😵‍💫' : ''}`}
      </p>
    </section>
  )
}
