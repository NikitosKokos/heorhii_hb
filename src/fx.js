import confetti from 'canvas-confetti'

// ---------- sound effects (synthesized, no files needed) ----------
let ctx
const getCtx = () => (ctx ??= new (window.AudioContext || window.webkitAudioContext)())

export const sfx = { muted: false }

function tone({ freq = 440, to, dur = 0.15, type = 'sine', vol = 0.2, delay = 0 }) {
  if (sfx.muted) return
  const c = getCtx()
  const t = c.currentTime + delay
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, t)
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur)
  g.gain.setValueAtTime(vol, t)
  g.gain.exponentialRampToValueAtTime(0.001, t + dur)
  o.connect(g).connect(c.destination)
  o.start(t)
  o.stop(t + dur)
}

export const pop = () => tone({ freq: 900, to: 60, dur: 0.12, type: 'triangle', vol: 0.35 })
export const boing = () => tone({ freq: 120, to: 700, dur: 0.35, type: 'square', vol: 0.07 })
export const whoosh = () => tone({ freq: 1400, to: 90, dur: 0.45, type: 'sawtooth', vol: 0.05 })
export const fart = () => tone({ freq: 90, to: 40, dur: 0.6, type: 'sawtooth', vol: 0.12 })
export const ding = () => {
  tone({ freq: 880, dur: 0.3 })
  tone({ freq: 1320, dur: 0.5, delay: 0.1 })
  tone({ freq: 1760, dur: 0.6, delay: 0.2 })
}
export const tick = () => tone({ freq: 2000, dur: 0.03, type: 'square', vol: 0.04 })

function noise({ dur = 0.6, vol = 0.15, delay = 0 }) {
  if (sfx.muted) return
  const c = getCtx()
  const t = c.currentTime + delay
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate)
  const ch = buf.getChannelData(0)
  for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1
  const src = c.createBufferSource()
  const hp = c.createBiquadFilter()
  const g = c.createGain()
  src.buffer = buf
  hp.type = 'highpass'
  hp.frequency.value = 6000
  g.gain.setValueAtTime(vol, t)
  g.gain.exponentialRampToValueAtTime(0.001, t + dur)
  src.connect(hp).connect(g).connect(c.destination)
  src.start(t)
}

// ba-dum-tss
export const rimshot = () => {
  tone({ freq: 220, to: 110, dur: 0.15, vol: 0.4 })
  tone({ freq: 160, to: 80, dur: 0.18, vol: 0.4, delay: 0.16 })
  noise({ dur: 0.7, vol: 0.25, delay: 0.34 })
}

// ---------- confetti ----------
const colors = ['#ff3cac', '#ffd23f', '#3bceac', '#7b2ff7', '#ff6b35', '#00f5d4']

export function burstAt(x, y, opts = {}) {
  confetti({
    particleCount: 60,
    spread: 80,
    startVelocity: 35,
    origin: { x: x / window.innerWidth, y: y / window.innerHeight },
    colors,
    ...opts,
  })
}

export function cannons(duration = 2500) {
  const end = Date.now() + duration
  ;(function frame() {
    confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0, y: 0.8 }, colors })
    confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1, y: 0.8 }, colors })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

export function fireworks(duration = 3000) {
  const end = Date.now() + duration
  const id = setInterval(() => {
    if (Date.now() > end) return clearInterval(id)
    confetti({
      particleCount: 70,
      startVelocity: 30,
      spread: 360,
      ticks: 70,
      origin: { x: Math.random(), y: Math.random() * 0.5 },
      colors,
    })
  }, 250)
}

export function emojiRain(emoji = '🎉') {
  const shape = confetti.shapeFromText({ text: emoji, scalar: 3 })
  confetti({ shapes: [shape], scalar: 3, particleCount: 40, spread: 160, origin: { y: 0 }, startVelocity: 20, gravity: 0.8 })
}

// ---------- DOM emoji particles (cheap, no React re-renders) ----------
const BURST = ['🎉', '🥳', '🎂', '🎈', '✨', '💥', '🤪', '😂', '🍰', '🎁', '🔥', '💖']

export function emojiBurst(x, y, count = 8, set = BURST) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span')
    el.className = 'emoji-particle'
    el.textContent = set[(Math.random() * set.length) | 0]
    const angle = Math.random() * Math.PI * 2
    const dist = 60 + Math.random() * 120
    el.style.left = `${x}px`
    el.style.top = `${y}px`
    el.style.setProperty('--dx', `${Math.cos(angle) * dist}px`)
    el.style.setProperty('--dy', `${Math.sin(angle) * dist}px`)
    el.style.setProperty('--rot', `${(Math.random() - 0.5) * 720}deg`)
    document.body.appendChild(el)
    el.addEventListener('animationend', () => el.remove())
  }
}

export function floatText(x, y, text) {
  const el = document.createElement('span')
  el.className = 'float-text'
  el.textContent = text
  el.style.left = `${x}px`
  el.style.top = `${y}px`
  document.body.appendChild(el)
  el.addEventListener('animationend', () => el.remove())
}

export const rand = (min, max) => min + Math.random() * (max - min)
export const pick = (arr) => arr[(Math.random() * arr.length) | 0]
