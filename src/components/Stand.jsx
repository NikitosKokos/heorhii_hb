import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { burstAt, ding, pick } from '../fx'

const STANDS = [
  { name: 'GOLDEN PROMPT', ability: 'Один промпт — и код оживает. Как он работает, не знает никто. Даже сам Стенд.' },
  { name: 'STAR PLATINUM: THE GYM', ability: 'ORA-ORA-ORA по штанге со скоростью 300 повторов в секунду. День ног не пропускает. Почти.' },
  { name: 'KILLER BUG', ability: 'Любой баг взрывается и исчезает. Вместе с половиной кода. Зато тесты зелёные!' },
  { name: 'CRAZY DEPLOY', ability: 'Чинит упавший прод одним ударом. Уронил его, правда, тоже он.' },
  { name: 'ZA WARUDO: DEADLINE', ability: 'Останавливает время за ночь до дедлайна. Курсовая пишется сама.' },
  { name: 'HERMIT PURPLE Wi-Fi', ability: 'Находит ответ на любой вопрос в Stack Overflow за 0.3 секунды.' },
  { name: 'SILVER PROTEIN', ability: 'Протеиновый шейк на скорости света. Бицепс +5 см за одну серию.' },
  { name: 'SHEER HEART ATTENDANCE', ability: 'Сам ходит на пары вместо хозяина. Преподаватель ничего не замечает.' },
]

const STATS = ['Сила', 'Скорость', 'Дальность', 'Стойкость', 'Точность', 'Потенциал']
const GRADES = ['E', 'D', 'C', 'B', 'A']

const roll = () =>
  STATS.map((label, i) => {
    if (i === STATS.length - 1) return { label, grade: '∞', v: 5 }
    const v = 2 + ((Math.random() * 4) | 0) // C..A mostly — it's his birthday
    return { label, grade: GRADES[v - 1], v }
  })

// hexagon point for stat i at value v (0..5)
const C = 110
const R = 72
const point = (i, v) => {
  const a = ((-90 + i * 60) * Math.PI) / 180
  return [C + Math.cos(a) * R * (v / 5), C + Math.sin(a) * R * (v / 5)]
}
const poly = (vals) => vals.map((v, i) => point(i, v).join(',')).join(' ')

function Radar({ stats }) {
  return (
    <svg className="radar" viewBox="-14 -10 248 240" role="img" aria-label="Характеристики Стенда">
      {[1, 2, 3, 4, 5].map((lvl) => (
        <polygon key={lvl} points={poly(Array(6).fill(lvl))} className="radar-grid" />
      ))}
      {stats.map((_, i) => {
        const [x, y] = point(i, 5)
        return <line key={i} x1={C} y1={C} x2={x} y2={y} className="radar-grid" />
      })}
      <motion.polygon
        className="radar-value"
        initial={{ points: poly(Array(6).fill(0)) }}
        animate={{ points: poly(stats.map((s) => s.v)) }}
        transition={{ type: 'spring', stiffness: 120, damping: 10 }}
      />
      {stats.map((s, i) => {
        const [x, y] = point(i, 6.6)
        return (
          <text key={s.label} x={x} y={y} className="radar-label" textAnchor="middle" dominantBaseline="middle">
            <tspan x={x} dy="-0.5em">{s.label}</tspan>
            <tspan x={x} dy="1.15em" className="radar-grade">{s.grade}</tspan>
          </text>
        )
      })}
    </svg>
  )
}

export default function Stand({ onTimeStop, timeStopped }) {
  const [stand, setStand] = useState(null)

  const awaken = (e) => {
    e.stopPropagation()
    let next
    do {
      next = pick(STANDS)
    } while (next === stand?.info)
    setStand({ info: next, stats: roll(), id: Date.now() })
    ding()
    burstAt(e.clientX, e.clientY, { colors: ['#7b2ff7', '#ffd23f', '#ff3cac'], particleCount: 80 })
  }

  return (
    <section className="card stand">
      <h2>
        <span className="menacing" aria-hidden>ゴゴゴ</span> Стенд Георгия <span className="menacing" aria-hidden>ゴゴゴ</span>
      </h2>

      <AnimatePresence mode="wait">
        {stand ? (
          <motion.div
            key={stand.id}
            className="stand-reveal"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -60, skewX: 20 }}
            transition={{ type: 'spring', stiffness: 220, damping: 16 }}
          >
            <p className="stand-name">「{stand.info.name}」</p>
            <p className="stand-owner">Владелец Стенда: Георгий</p>
            <Radar stats={stand.stats} />
            <p className="stand-ability">{stand.info.ability}</p>
          </motion.div>
        ) : (
          <motion.p key="empty" className="muted" exit={{ opacity: 0 }}>
            Каждый настоящий вайбкодер-качок рано или поздно пробуждает Стенд…
          </motion.p>
        )}
      </AnimatePresence>

      <div className="row">
        <motion.button className="btn btn-jojo" onClick={awaken} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}>
          {stand ? '🔄 Другой Стенд' : '⭐ Пробудить Стенд'}
        </motion.button>
        <motion.button
          className="btn btn-world"
          onClick={(e) => (e.stopPropagation(), onTimeStop())}
          disabled={timeStopped}
          whileHover={{ scale: 1.08, rotate: [-2, 2, 0] }}
          whileTap={{ scale: 0.9 }}
        >
          ⏱️ ZA WARUDO!
        </motion.button>
      </div>
    </section>
  )
}
