import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { ding, fireworks, whoosh } from '../fx'

const CANDLES = 5
const RECORD_SECONDS = 8

export default function Cake({ onToast, onRecording }) {
  const [lit, setLit] = useState(() => Array(CANDLES).fill(true))
  const [secondsLeft, setSecondsLeft] = useState(0)
  const micRef = useRef(null)
  const litRef = useRef(lit)
  litRef.current = lit
  const allOut = lit.every((l) => !l)
  const listening = secondsLeft > 0

  const blow = (i) => {
    if (!lit[i]) return
    whoosh()
    setLit((prev) => prev.map((l, j) => (j === i ? false : l)))
  }

  // blow out the next lit candle (used by the microphone)
  const blowNext = () => {
    if (!litRef.current.includes(true)) return
    whoosh()
    setLit((prev) => {
      const i = prev.indexOf(true)
      return i === -1 ? prev : prev.map((l, j) => (j === i ? false : l))
    })
  }

  useEffect(() => {
    if (!allOut) return
    ding()
    fireworks(3500)
    onToast('🌟 Желание загадано! Оно сбудется, проверено')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allOut])

  // listens for blowing AND records the whole 8 seconds — the recording is used later by the chaos button 😈
  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const ac = new AudioContext()
      const analyser = ac.createAnalyser()
      analyser.fftSize = 512
      ac.createMediaStreamSource(stream).connect(analyser)
      const data = new Uint8Array(analyser.fftSize)

      const chunks = []
      const recorder = new MediaRecorder(stream)
      recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data)
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        ac.close()
        if (!chunks.length) return
        onRecording(URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType })))
        onToast('🎙️ Записано! Эта запись ещё пригодится… 😈')
      }
      recorder.start()

      let raf
      let loud = 0
      const loop = () => {
        analyser.getByteTimeDomainData(data)
        let sum = 0
        for (const v of data) sum += (v - 128) ** 2
        const rms = Math.sqrt(sum / data.length)
        loud = rms > 25 ? loud + 1 : 0
        if (loud > 6) {
          blowNext()
          loud = -20 // short cooldown between candles
        }
        raf = requestAnimationFrame(loop)
      }
      loop()

      setSecondsLeft(RECORD_SECONDS)
      const countdown = setInterval(() => setSecondsLeft((s) => s - 1), 1000)
      const stop = () => {
        clearInterval(countdown)
        clearTimeout(timeout)
        cancelAnimationFrame(raf)
        if (recorder.state !== 'inactive') recorder.stop()
        micRef.current = null
        setSecondsLeft(0)
      }
      const timeout = setTimeout(stop, RECORD_SECONDS * 1000)
      micRef.current = { stop }
    } catch {
      onToast('🎤 Микрофон не дали. Дуй на экран сильнее, вдруг сработает 😅')
    }
  }

  useEffect(() => () => micRef.current?.stop(), [])

  return (
    <section className="card cake-section">
      <h2>🎂 Задуй свечи!</h2>
      <p className="muted">Тыкай по огонькам — или дуй в микрофон по-настоящему</p>

      <div className="cake">
        <div className="candles">
          {lit.map((on, i) => (
            <button key={i} className="candle" onClick={(e) => (e.stopPropagation(), blow(i))} aria-label="Свеча">
              <AnimatePresence>
                {on ? (
                  <motion.span
                    key="flame"
                    className="flame"
                    exit={{ scale: 0, y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                ) : (
                  <motion.span
                    key="smoke"
                    className="smoke"
                    initial={{ opacity: 0.8, y: 0, scale: 0.5 }}
                    animate={{ opacity: 0, y: -60, scale: 2 }}
                    transition={{ duration: 1.5 }}
                  >
                    💨
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
        <div className="cake-layer top" />
        <div className="cake-layer middle" />
        <div className="cake-layer bottom" />
        <div className="plate" />
      </div>

      <div className="row">
        {listening ? (
          <button className="btn btn-alt pulse" disabled onClick={(e) => e.stopPropagation()}>
            🔴 ДУЙ! Запись… {secondsLeft}
          </button>
        ) : allOut ? (
          <motion.button
            className="btn"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={(e) => (e.stopPropagation(), setLit(Array(CANDLES).fill(true)))}
          >
            🔥 Зажечь снова
          </motion.button>
        ) : (
          <button className="btn btn-alt" onClick={(e) => (e.stopPropagation(), startMic())}>
            🎤 Задуть в микрофон
          </button>
        )}
      </div>
    </section>
  )
}
