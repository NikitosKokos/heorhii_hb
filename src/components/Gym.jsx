import { useEffect, useRef, useState } from 'react'
import { burstAt, ding, floatText, pick, punch } from '../fx'

const START = 60
const STEP = 20
const PUSH = 10
const SHOUTS = ['ORA!', 'ORA ORA!', 'ORA!', 'MUDA!', 'ORAAA!', 'Ещё!', 'Давай!']
const DONE = ['LIGHT WEIGHT, BABY! 💪', 'YEAH BUDDY! 🔥', 'ORA ORA ORA! 👊', 'Изи 😎']
const RECORDS = {
  100: '💪 100 кг! Качалка гордится тобой',
  140: '🦍 140 кг! Это уже не человек, это Стенд',
  200: '🏆 200 кг! Тренер просит автограф',
}

const face = (p) => (p < 25 ? '😐' : p < 50 ? '😤' : p < 75 ? '🥵' : '😱')

export default function Gym({ onToast }) {
  const [weight, setWeight] = useState(START)
  const [progress, setProgress] = useState(0)
  const [best, setBest] = useState(0)
  const weightRef = useRef(weight)
  const progressRef = useRef(0) // source of truth; state only mirrors it for rendering

  useEffect(() => {
    weightRef.current = weight
  }, [weight])

  // gravity: the bar sinks unless you keep mashing — heavier weight sinks faster
  useEffect(() => {
    const id = setInterval(() => {
      if (progressRef.current <= 0) return
      progressRef.current = Math.max(0, progressRef.current - (0.8 + (weightRef.current - START) / 50))
      setProgress(progressRef.current)
    }, 50)
    return () => clearInterval(id)
  }, [])

  const press = (e) => {
    e.stopPropagation()
    punch()
    floatText(e.clientX, e.clientY, pick(SHOUTS))
    const next = progressRef.current + PUSH
    if (next < 100) {
      progressRef.current = next
      setProgress(next)
      return
    }
    // rep complete
    ding()
    burstAt(e.clientX, e.clientY, { particleCount: 90 })
    floatText(e.clientX, e.clientY - 40, pick(DONE))
    onToast(RECORDS[weight] ?? `💪 ${weight} кг взято! Докидываем блины…`)
    setBest((b) => Math.max(b, weight))
    setWeight(weight + STEP)
    progressRef.current = 0
    setProgress(0)
  }

  const plates = Math.min(6, 1 + (weight - START) / STEP)

  return (
    <section className="card gym">
      <h2>🏋️ Жим лёжа</h2>
      <p className="muted">Штанга тянет вниз — жми кнопку как можно быстрее!</p>

      <div className="gym-rack">
        <div className="barbell" style={{ bottom: `${28 + progress * 0.56}%` }}>
          <span className="plates">{Array.from({ length: plates }, (_, i) => <i key={i} />)}</span>
          <span className="bar" />
          <span className="plates">{Array.from({ length: plates }, (_, i) => <i key={i} />)}</span>
        </div>
        <span className="lifter-face">{face(progress)}</span>
        <span className="gym-weight">{weight} кг</span>
      </div>

      <button className="btn btn-ora" onPointerDown={press} onClick={(e) => e.stopPropagation()}>
        👊 ORA!
      </button>
      <p className="muted">{best ? `Личный рекорд: ${best} кг` : 'Рекорда пока нет. Пока.'}</p>
    </section>
  )
}
