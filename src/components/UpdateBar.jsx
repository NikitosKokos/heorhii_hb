import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

const STEPS = [
  [0, 'Загрузка нового возраста…'],
  [18, 'Установка мудрости… 🧠'],
  [37, 'Удаление старых багов… 🐛'],
  [55, 'Добавление седины… шутка 😅'],
  [72, 'Калибровка крутости… 😎'],
  [89, 'Почти готово, не выключай компьютер…'],
  [99, 'Ещё чуть-чуть… 🙃'],
  [100, 'Обновление «Георгий +1» установлено ✅'],
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
