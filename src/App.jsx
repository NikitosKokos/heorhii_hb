import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import Balloons from './components/Balloons'
import Cake from './components/Cake'
import Fortune from './components/Fortune'
import Intro from './components/Intro'
import Joke from './components/Joke'
import LikeButtons from './components/LikeButtons'
import Photo from './components/Photo'
import Title from './components/Title'
import UpdateBar from './components/UpdateBar'
import { burstAt, cannons, emojiBurst, emojiRain, fart, fireworks, pick, rand, sfx } from './fx'
import './App.css'

const BG_EMOJI = ['🎈', '🎉', '🎂', '🥳', '🎁', '✨', '🍰', '🎊', '🍾', '⭐', '💖', '🤪']
const bgItems = Array.from({ length: 26 }, (_, i) => ({
  emoji: BG_EMOJI[i % BG_EMOJI.length],
  left: rand(0, 100),
  delay: rand(-20, 0),
  duration: rand(12, 24),
  size: rand(1.4, 3.2),
}))

const CHAOS_TOASTS = ['Ну мы же просили не нажимать 😅', 'ХАОС АКТИВИРОВАН 🌀', 'Георгий, что ты наделал?! 🙈']

export default function App() {
  const [opened, setOpened] = useState(false)
  const [muted, setMuted] = useState(false)
  const [chaos, setChaos] = useState(false)
  const [toasts, setToasts] = useState([])
  const audio = useRef(null)
  const recording = useRef(null) // 8-second mic clip from the cake, looped during chaos
  const stopChaos = useRef(null)
  const toastId = useRef(0)

  const toast = useCallback((text) => {
    const id = toastId.current++
    setToasts((t) => [...t.slice(-2), { id, text }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500)
  }, [])

  useEffect(() => {
    const a = new Audio('/song.mp3')
    a.loop = true
    a.volume = 0.6
    audio.current = a
    return () => a.pause()
  }, [])

  const open = () => {
    setOpened(true)
    audio.current.play().catch(() => {})
    cannons(3000)
    setTimeout(() => fireworks(2500), 1200)
  }

  const toggleSound = (e) => {
    e.stopPropagation()
    const next = !muted
    setMuted(next)
    sfx.muted = next
    audio.current.muted = next
    if (recording.current) recording.current.muted = next
    if (!next) audio.current.play().catch(() => {})
  }

  const saveRecording = useCallback((url) => {
    const old = recording.current
    if (old) {
      old.pause()
      URL.revokeObjectURL(old.src)
    }
    const clip = new Audio(url)
    clip.loop = true
    clip.muted = sfx.muted
    recording.current = clip
  }, [])

  // chaos runs until the button is pressed again
  const toggleChaos = (e) => {
    e.stopPropagation()
    if (stopChaos.current) return stopChaos.current()

    setChaos(true)
    fart()
    const a = audio.current
    a.preservesPitch = false // chipmunk mode
    a.playbackRate = 1.7
    a.volume = 0.4
    a.play().catch(() => {})

    // his own blowing from the cake, looping on top of the song
    const clip = recording.current
    if (clip) {
      clip.currentTime = 0
      clip.play().catch(() => {})
      toast('🔁 Узнаёшь этот звук? 😂')
    } else {
      toast(pick(CHAOS_TOASTS))
      setTimeout(() => toast('Псс… задуй свечи в микрофон и нажми ещё раз 😏'), 1200)
    }

    const rain = setInterval(() => emojiRain(pick(['🤪', '😂', '🎉', '🦄', '🍕', '💩', '🎂'])), 500)
    stopChaos.current = () => {
      clearInterval(rain)
      clip?.pause()
      a.playbackRate = 1
      a.preservesPitch = true
      a.volume = 0.6
      stopChaos.current = null
      setChaos(false)
      toast('Фух… 😮‍💨')
    }
  }

  // click anywhere → confetti + emoji explosion
  const handleClick = (e) => {
    if (!opened) return
    burstAt(e.clientX, e.clientY, { particleCount: 30, spread: 70 })
    emojiBurst(e.clientX, e.clientY, 6)
  }

  // sparkle trail behind the cursor
  useEffect(() => {
    if (!opened) return
    let last = 0
    const onMove = (e) => {
      const now = performance.now()
      if (now - last < 45) return
      last = now
      const el = document.createElement('span')
      el.className = 'trail'
      el.textContent = pick(['✨', '⭐', '💫', '🌟'])
      el.style.left = `${e.clientX}px`
      el.style.top = `${e.clientY}px`
      document.body.appendChild(el)
      el.addEventListener('animationend', () => el.remove())
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [opened])

  return (
    <div className={`app ${chaos ? 'chaos' : ''}`} onClick={handleClick}>
      <div className="bg-emoji" aria-hidden>
        {bgItems.map((b, i) => (
          <span
            key={i}
            style={{ left: `${b.left}%`, animationDelay: `${b.delay}s`, animationDuration: `${b.duration}s`, fontSize: `${b.size}rem` }}
          >
            {b.emoji}
          </span>
        ))}
      </div>

      <AnimatePresence>{!opened && <Intro key="intro" onOpen={open} />}</AnimatePresence>

      {opened && (
        <>
          <main className="content">
            <Title />
            <Photo />
            <UpdateBar />
            <div className="grid">
              <Cake onToast={toast} onRecording={saveRecording} />
              <Fortune />
              <Joke />
            </div>
            <LikeButtons onToast={toast} />

            <section className="chaos-section">
              <motion.button
                className="btn btn-danger"
                onClick={toggleChaos}
                animate={{ rotate: [0, -3, 3, -3, 0] }}
                transition={{ duration: 0.4, repeat: Infinity, repeatDelay: chaos ? 0 : 1.5 }}
                whileHover={{ scale: 1.15 }}
              >
                {chaos ? '😱 ХВАТИТ! ОСТАНОВИТЕ ЭТО' : '🚫 НЕ НАЖИМАТЬ 🚫'}
              </motion.button>
              <p className="muted">{chaos ? 'Мы предупреждали.' : 'Серьёзно. Не надо.'}</p>
            </section>

            <footer>
              Сделано с любовью ❤️ и лёгким безумием
            </footer>
          </main>
          <Balloons onToast={toast} />
        </>
      )}

      <button className="sound-btn" onClick={toggleSound} aria-label={muted ? 'Включить звук' : 'Выключить звук'}>
        {muted ? '🔇' : '🔊'}
      </button>

      <div className="toasts">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              className="toast"
              layout
              initial={{ x: 300, opacity: 0, rotate: 10 }}
              animate={{ x: 0, opacity: 1, rotate: 0 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
