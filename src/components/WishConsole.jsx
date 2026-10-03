import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { FLEX, JOTARO } from '../ascii'
import { cannons, ding, fireworks, tick } from '../fx'

const STEPS = [
  'Шифрую желание звёздной пылью ✨',
  'Отправляю запрос во Вселенную 🌌',
  'Получаю одобрение Стенда ゴゴゴ',
  'git push origin судьба 🚀',
  'Деплою желание на весь следующий год 📅',
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const PS1 = 'georgiy@birthday:~$'

export default function WishConsole() {
  const [wish, setWish] = useState('')
  const [secretLength, setSecretLength] = useState(0)
  const [phase, setPhase] = useState('input') // input → running → done
  const [lines, setLines] = useState([])
  const [bar, setBar] = useState(0)
  const alive = useRef(true)

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  const run = async (e) => {
    e.preventDefault()
    const text = wish.trim()
    if (!text || phase !== 'input') return
    // a wish that's shown doesn't come true — only its length is kept, for the ***** mask
    setSecretLength(text.length)
    setWish('')
    setPhase('running')
    setLines([])
    setBar(0)

    for (const step of STEPS) {
      setLines((l) => [...l, { text: step, ok: false }])
      await sleep(700)
      if (!alive.current) return
      tick()
      setLines((l) => l.map((x, i) => (i === l.length - 1 ? { ...x, ok: true } : x)))
    }
    for (let n = 1; n <= 10; n++) {
      setBar(n)
      tick()
      await sleep(120)
      if (!alive.current) return
    }

    ding()
    cannons(2500)
    fireworks(4000)
    setPhase('done')
  }

  const reset = () => {
    setPhase('input')
    setSecretLength(0)
    setLines([])
    setBar(0)
  }

  return (
    <section className="card wish">
      <h2>🌠 Загадай желание</h2>

      {/* clicks here shouldn't fire the page-wide confetti */}
      <div className="term" onClick={(e) => e.stopPropagation()}>
        <div className="term-bar">
          <i />
          <i />
          <i />
          <span>wish.sh — georgiy@birthday</span>
        </div>

        <div className="term-body">
          <p className="t-dim">{PS1} cat welcome.txt</p>
          <p>{FLEX} Загадай желание на год — Стенд «WISH MAKER» его исполнит.</p>

          {phase === 'input' ? (
            <form className="t-prompt" onSubmit={run}>
              <label htmlFor="wish" className="t-ps1">
                {PS1} wish
              </label>
              <input
                id="wish"
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                maxLength={120}
                placeholder="напиши желание и жми Enter"
                autoComplete="off"
                enterKeyHint="send"
              />
              <button type="submit" className="t-run" disabled={!wish.trim()} aria-label="Загадать">
                ⏎
              </button>
            </form>
          ) : (
            <>
              <p>
                <span className="t-ps1">{PS1}</span> wish {'*'.repeat(Math.min(secretLength, 24))}
              </p>
              <p className="t-dim">🔒 Желание скрыто. Его никто не увидит — иначе не сбудется 🤫</p>
              {lines.map((l, i) => (
                <p key={i}>
                  <span className="t-dim">
                    [{i + 1}/{STEPS.length}]
                  </span>{' '}
                  {l.text}… {l.ok ? <span className="t-ok">OK</span> : <span className="t-cursor" />}
                </p>
              ))}
              {bar > 0 && (
                <p>
                  [{'█'.repeat(bar)}
                  {'░'.repeat(10 - bar)}] {bar * 10}%
                </p>
              )}
            </>
          )}

          {phase === 'done' && (
            <motion.div
              className="t-done"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="t-ok">✅ ЖЕЛАНИЕ ЗАГАДАНО. Статус: сбудется 🌟</p>
              <div className="t-jotaro">
                <pre>{JOTARO}</pre>
                <span className="menacing" aria-hidden>
                  ゴ<br />ゴ<br />ゴ
                </span>
              </div>
              <p className="t-quote">«Yare yare daze… это желание точно сбудется.»</p>
            </motion.div>
          )}
        </div>
      </div>

      {phase === 'done' && (
        <motion.button
          className="btn"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.6 }}
          onClick={(e) => (e.stopPropagation(), reset())}
        >
          ↻ Загадать ещё одно
        </motion.button>
      )}
    </section>
  )
}
