import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import { cannons, ding, pick, tick } from '../fx'

const PREDICTIONS = [
  'В этом году ты наконец-то выспишься 😴 …нет',
  'Тебя ждёт огромная сумма денег 💰 Главное — не в виде штрафа',
  'Ты станешь на год мудрее. Но это не точно 🧠',
  'Холодильник будет полон, а весы — добры 🍕',
  'Wi-Fi будет ловить везде, даже в лифте 📶',
  'Каждый понедельник будет ощущаться как пятница 🎉',
  'Ты найдёшь второй носок. Тот самый 🧦',
  'Котики будут подходить к тебе сами 🐈',
  'Удача прилипнет к тебе, как жвачка к подошве 🍀',
  'Тебя ждёт путешествие. Как минимум до магазина 🛒',
  'Твой будильник сломается. Только по выходным ⏰',
  'Ты будешь выглядеть на 18. Издалека. В темноте 🕶️',
  'Все пробки рассосутся при твоём приближении 🚗💨',
  'Зарплата удвоится. Цены — нет. Ну почти 📈',
  'Claude напишет за тебя курсач с первого промпта 🤖',
  'Сессия закроется сама собой. Ты даже не заметишь 🎓',
  'Твой код заработает с первого раза. И никто не поймёт почему 💻',
  'Новый PR в жиме и на GitHub в один день 💪',
  'Ты досмотришь JoJo. Все части. Без сна ゴゴゴ',
  'Препод скажет «автомат». И это будет не про оружие 🎓',
  'Ты встретишь свой Стенд. Это будет шейкер для протеина 🥤',
  'В зале освободится скамья. Сразу, без очереди 🏋️',
  'Вайб будет, баги — нет. Ну, почти нет ✨',
]

export default function Fortune() {
  const [text, setText] = useState('Нажми и узнай, что тебя ждёт в новом году 🔮')
  const [spinning, setSpinning] = useState(false)
  const [round, setRound] = useState(0)
  const timer = useRef()

  const spin = (e) => {
    e.stopPropagation()
    if (spinning) return
    setSpinning(true)
    let n = 0
    const total = 22
    const step = () => {
      n++
      setText(pick(PREDICTIONS))
      tick()
      if (n < total) {
        timer.current = setTimeout(step, 40 + n * 8) // slows down like a slot machine
      } else {
        setSpinning(false)
        setRound((r) => r + 1)
        ding()
        cannons(1200)
      }
    }
    step()
  }

  return (
    <section className="card fortune">
      <h2>🔮 Предсказание на год</h2>
      <motion.div
        key={round}
        className={`fortune-screen ${spinning ? 'spinning' : ''}`}
        initial={{ scale: 0.8, rotate: -3 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        {text}
      </motion.div>
      <motion.button
        className="btn"
        onClick={spin}
        disabled={spinning}
        whileHover={{ scale: 1.08, rotate: [-2, 2, -2, 0] }}
        whileTap={{ scale: 0.9 }}
      >
        {spinning ? '🎰 Крутится…' : round ? '🎰 Ещё разок!' : '🎰 Крутить барабан'}
      </motion.button>
    </section>
  )
}
