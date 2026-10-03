import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { boing, pick, rand, tick } from '../fx'

const DIALOGS = [
  ['Error 404', 'Сон не найден 😴'],
  ['Error 404', 'Страница «Скучный день рождения» не найдена'],
  ['Fatal error', 'Слишком много крутости. Сервер не выдержал 🔥'],
  ['Антивирус', 'Обнаружен Стенд. Удалить невозможно ゴゴゴ'],
  ['npm ERR!', 'missing peer dependency: торт@^1.0.0 🎂'],
  ['Warning', 'Пропущен день ног. Риск падения: 87% 🦵'],
  ['Claude', 'Превышен лимит вайба. Попробуйте через 5 минут ✨'],
  ['Error 418', "I'm a teapot ☕ Это реальный HTTP-код, честно"],
  ['ZA WARUDO.exe', 'Программа не отвечает: время остановлено ⏱️'],
  ['Сессия', 'FileNotFoundError: курсач_final_v7_точно_final.docx 🎓'],
  ['Error 500', 'Internal Party Error: слишком весело 🎉'],
  ['Gym.exe', 'Штанга застряла в стеке. Требуется спотер 🏋️'],
]

const LOGS = [
  ['err', 'Uncaught TypeError: georgiy.sleep is not a function'],
  ['dim', '    at Birthday.celebrate (party.js:404:18)'],
  ['warn', 'Warning: Each child in a list should have a unique "key" prop. (свечи)'],
  ['err', 'ERROR: protein_shake.exe stopped working'],
  ['err', 'Segmentation fault (core dumped) 💥'],
  ['err', 'fatal: refusing to merge unrelated birthdays'],
  ['warn', 'ORA ORA ORA ORA ORA ORA ORA ORA… (stack overflow)'],
  ['err', 'RangeError: Maximum call stack size exceeded (слишком много поздравлений)'],
  ['err', 'CORS error: торт заблокирован политикой same-origin 🎂'],
  ['warn', 'DeprecationWarning: возраст.js будет обновлён через 365 дней'],
  ['err', 'GET https://сон.ru/8-часов 404 (Not Found)'],
  ['ok', '✔ 1 test passed (тест на крутость)'],
]

const MAX = 12
const width = () => Math.min(300, window.innerWidth * 0.86)

function spawn(id) {
  const w = width()
  const base = {
    id,
    w,
    left: rand(8, Math.max(8, window.innerWidth - w - 8)),
    top: rand(window.innerHeight * 0.06, window.innerHeight * 0.62),
    tilt: rand(-6, 6),
  }
  if (Math.random() < 0.55) {
    const [title, text] = pick(DIALOGS)
    return { ...base, kind: 'dialog', title, text }
  }
  const start = (Math.random() * LOGS.length) | 0
  return { ...base, kind: 'console', lines: [0, 1, 2, 3].map((k) => LOGS[(start + k) % LOGS.length]) }
}

// fake error windows and consoles raining down while chaos is on
export default function ChaosErrors() {
  const [items, setItems] = useState([])
  const nextId = useRef(0)

  useEffect(() => {
    const id = setInterval(() => {
      tick()
      setItems((list) => [...list, spawn(nextId.current++)].slice(-MAX))
    }, 650)
    return () => clearInterval(id)
  }, [])

  // closing an error spawns two more. Classic.
  const close = (e, id) => {
    e.stopPropagation()
    boing()
    setItems((list) => [...list.filter((x) => x.id !== id), spawn(nextId.current++), spawn(nextId.current++)].slice(-MAX))
  }

  return (
    <div className="chaos-errors">
      <AnimatePresence>
        {items.map((it) => (
          <motion.div
            key={it.id}
            className={`err-win ${it.kind}`}
            style={{ left: it.left, top: it.top, width: it.w }}
            initial={{ scale: 0, rotate: it.tilt * 4, opacity: 0 }}
            animate={{ scale: 1, rotate: it.tilt, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="err-bar">
              <span>{it.kind === 'dialog' ? `⚠️ ${it.title}` : '>_ console'}</span>
              <button onClick={(e) => close(e, it.id)} aria-label="Закрыть">✕</button>
            </div>
            {it.kind === 'dialog' ? (
              <div className="err-body">
                <p>{it.text}</p>
                <button className="err-ok" onClick={(e) => close(e, it.id)}>
                  OK
                </button>
              </div>
            ) : (
              <pre className="err-console">
                {it.lines.map(([type, text], i) => (
                  <span key={i} className={`log-${type}`}>
                    {text}
                    {'\n'}
                  </span>
                ))}
              </pre>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
