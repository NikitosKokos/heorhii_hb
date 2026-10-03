import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'
import { emojiBurst, rimshot } from '../fx'

// used if jokes.json is missing or broken
const FALLBACK = [
  'Сидят два друга. Один другому: «Сколько тебе лет?» — «Не знаю, торт ещё не посчитал свечи».',
  '— Доктор, мне каждый год на день рождения становится на год больше! — Ничего, это у всех так.',
  'Торт со свечами — единственный торт, на который сначала дуют, а потом едят.',
  'Программист на дне рождения задул свечи и сказал: «Отлично, теперь сделаем коммит».',
  '— Что тебе подарить? — Сюрприз! — Хорошо: ничего не подарю. Вот это будет сюрприз.',
  'Лучший подарок на день рождения — это когда тебе дарят деньги и говорят: «Купи себе что-нибудь, но не трать».',
  'Коза, привязанная к колышку, лучше восьмиклассника понимает, что такое радиус.',
  'Саперы учат своих детей есть манную кашу, не задевая комочки.',
  'Лето в Сибири очень жаркое, главное — не пропустить этот день.',
  'На международных соревнованиях по плаванию электрик Иванов замкнул тройку лидеров.',
  'В Китае завершилась перепись населения 1905 года.',
  'Антонимом слова «синоним» является слово «антоним».',
  '— Почему ты опоздал? — Будильник прозвенел на день рождения соседа.',
  'Возраст — это когда стоимость свечей на торте начинает превышать стоимость торта.',
  'Оптимист верит, что мы живём в лучшем из миров. Пессимист боится, что так оно и есть.',
  'Ученые доказали: люди, которые празднуют больше дней рождения, живут дольше.',
  'Сказал коту, что сегодня мой день рождения. Кот посмотрел на меня, как на пустую миску.',
  '— Сколько можно спать?! — Сколько дадут.',
  'Вайбкодер не пишет код. Он пишет «сделай красиво» и ждёт.',
  '— Ты в зал ходишь? — Да, по понедельникам. Каждый понедельник собираюсь.',
  'Студент перед сессией — как Стенд: невидимый, но очень сильный.',
  'Код работает — не трогай. Код не работает — спроси нейросеть. Нейросеть не работает — иди в зал.',
]

// keep it a birthday, not a funeral
const BLOCKLIST = /самоуби|умер|смерт|труп|убил|убий|насил|секс|постел|гей|нетрадиц|войн|теракт|похорон|бомж|негр/i

const decode = (s) =>
  new DOMParser().parseFromString(s.replace(/<br\s*\/?>/gi, '\n'), 'text/html').documentElement.textContent.trim()

const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

async function loadJokes() {
  try {
    // snapshot of the shortiki.com API, refreshed on every deploy by scripts/fetch-jokes.mjs
    const res = await fetch(`${import.meta.env.BASE_URL}jokes.json`)
    if (!res.ok) throw new Error(res.status)
    const data = await res.json()
    const jokes = data
      .map((j) => decode(j.content ?? ''))
      .filter((t) => t && t.length < 400 && !BLOCKLIST.test(t))
    if (!jokes.length) throw new Error('empty')
    return shuffle(jokes)
  } catch {
    return shuffle(FALLBACK)
  }
}

export default function Joke() {
  const [joke, setJoke] = useState(null)
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState(0)
  const queue = useRef([])

  const next = async (e) => {
    e.stopPropagation()
    const { clientX: x, clientY: y } = e
    if (loading) return
    if (!queue.current.length) {
      setLoading(true)
      queue.current = await loadJokes()
      setLoading(false)
    }
    setJoke(queue.current.pop())
    setCount((c) => c + 1)
    // let the card land before the punchline drum
    setTimeout(() => {
      rimshot()
      emojiBurst(x, y, 6, ['😂', '🤣', '😹', '🥁'])
    }, 400)
  }

  return (
    <section className="card joke">
      <h2>😂 Анекдот</h2>
      <div className="joke-screen">
        <AnimatePresence mode="wait">
          <motion.p
            key={count}
            initial={{ rotateY: 90, opacity: 0, scale: 0.8 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: -90, opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          >
            {joke ?? 'Жми кнопку — и будет смешно. Ну или хотя бы неловко 🙃'}
          </motion.p>
        </AnimatePresence>
      </div>
      <motion.button
        className="btn"
        onClick={next}
        disabled={loading}
        whileHover={{ scale: 1.08, rotate: [-3, 3, -3, 0] }}
        whileTap={{ scale: 0.9 }}
      >
        {loading ? '⏳ Ищу смешное…' : count ? '🥁 Ещё анекдот' : '🎤 Анекдот'}
      </motion.button>
    </section>
  )
}
