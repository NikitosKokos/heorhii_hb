import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

const STEPS = [
  [0, '> claude "сделай Георгию +1 год, без багов"'],
  [14, 'Вайбкодинг нового возраста… ✨'],
  [28, 'npm install мышцы@latest… 💪'],
  [41, 'Удаление старых багов… 🐛'],
  [55, 'Сдача сессии на автомате… 🎓'],
  [68, 'Пробуждение Стенда… ゴゴゴ'],
  [82, 'Калибровка крутости… 😎'],
  [93, 'Почти готово, не выключай компьютер…'],
  [99, 'Ещё чуть-чуть… 🙃'],
  [100, '✅ «Георгий +1» установлен. Тесты? Какие тесты?'],
]

export default function UpdateBar() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (step >= STEPS.length - 1) return
    // stalls at 99% for longer, like every real progress bar
    const id = setTimeout(() => setStep((s) => s + 1), step === STEPS.length - 2 ? 2500 : 900)
    return () => clearTimeout(id)
  }, [step])

  const [pct, label] = STEPS[step]
  const done = pct === 100

  return (
    <div className={`update ${done ? 'done' : ''}`}>
      <div className="update-label">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="update-track">
        <motion.div className="update-fill" animate={{ width: `${pct}%` }} transition={{ type: 'spring', stiffness: 60 }} />
      </div>
    </div>
  )
}
