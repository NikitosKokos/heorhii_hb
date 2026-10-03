import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import { cannons, ding, pick, tick } from '../fx'

// every prediction is about his stuff: gym, vibe coding, uni, JoJo
const PREDICTIONS = [
  // gym
  'Жим вырастет на 20 кг. Самооценка — на все 100 💪',
  'В зале освободится скамья. Сразу, без очереди 🏋️',
  'Ты не пропустишь ни одного дня ног. Ну, может, один… или два 🦵',
  'Протеин станет вкусным. Даже со вкусом «ваниль-картон» 🥤',
  'Зеркало в раздевалке будет показывать только удачные ракурсы 🪞',
  'Тренер скажет «техника идеальная». Впервые в истории зала 🏆',
  // vibe coding
  'Claude напишет за тебя курсач с первого промпта 🤖',
  'Твой код заработает с первого раза. И никто не поймёт почему 💻',
  'git push --force ни разу ничего не сломает 🙏',
  'Деплой в пятницу вечером пройдёт без происшествий. Настоящее чудо 🚀',
  'Лимит токенов закончится ровно в тот момент, когда код будет готов ✨',
  'Вайб будет, баги — нет. Ну, почти нет 🐛',
  'Твой pet-проект наберёт 1000 звёзд на GitHub ⭐',
  // uni
  'Сессия закроется сама собой. Ты даже не заметишь 🎓',
  'Препод скажет «автомат». И это будет не про оружие 🎓',
  'Дедлайн перенесут на неделю. Трижды 📅',
  'Пары в 8 утра будут отменяться. Каждая 😴',
  // JoJo
  'Ты досмотришь JoJo. Все части. Без сна ゴゴゴ',
  'Ты встретишь свой Стенд. Это будет шейкер для протеина 🥤',
  'Начнёшь вставать в позы Джотаро. Непроизвольно, прямо в зале 🧍',
  'Время будет останавливаться на 5 секунд перед каждым дедлайном ⏱️',
  'Ты перестанешь говорить «Yare yare daze». Шутка, не перестанешь 🧢',
  // all at once
  'Стенд «GOLDEN PROMPT» сделает за тебя всё: код, курсач и сет на грудь ✨',
  'Год будет как опенинг JoJo: эпично, громко и с позами 🎶',
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
