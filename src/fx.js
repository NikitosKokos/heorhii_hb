import confetti from 'canvas-confetti'

// ---------- sound effects (synthesized, no files needed) ----------
let ctx
const getCtx = () => (ctx ??= new (window.AudioContext || window.webkitAudioContext)())

export const sfx = { muted: false }

function tone({ freq = 440, to, dur = 0.15, type = 'sine', vol = 0.2, delay = 0 }) {
  if (sfx.muted) return
  const c = getCtx()
  if (c.state === 'suspended') c.resume()
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

export const punch = () => {
  tone({ freq: 200, to: 45, dur: 0.12, type: 'square', vol: 0.12 })
  noise({ dur: 0.06, vol: 0.12 })
}

// ZA WARUDO: everything winds down… and back up
export const timeStop = () => {
  tone({ freq: 700, to: 30, dur: 1.5, type: 'sawtooth', vol: 0.1 })
  tone({ freq: 320, to: 20, dur: 1.8, vol: 0.35 })
}
export const timeResume = () => {
  tone({ freq: 30, to: 700, dur: 1.1, type: 'sawtooth', vol: 0.08 })
  tone({ freq: 20, to: 320, dur: 1.1, vol: 0.3 })
}

// ---------- looping mic clip ----------
// Played through Web Audio rather than <audio>: MediaRecorder files often have no duration
// metadata, which makes <audio loop> stutter or not loop at all. An AudioBuffer loops gaplessly.
export async function decodeClip(blob) {
  return getCtx().decodeAudioData(await blob.arrayBuffer())
}

export function playLoop(buffer, volume = 1.6) {
  const c = getCtx()
  c.resume()
  const src = c.createBufferSource()
  const g = c.createGain()
  src.buffer = buffer
  src.loop = true
  g.gain.value = sfx.muted ? 0 : volume
  src.connect(g).connect(c.destination)
  src.start()
  return {
    stop: () => src.stop(),
    setMuted: (m) => (g.gain.value = m ? 0 : volume),
  }
}

// ---------- confetti ----------
const colors = ['#ff3cac', '#ffd23f', '#3bceac', '#7b2ff7', '#ff6b35', '#00f5d4']

// One shared canvas rendered in a web worker, so confetti stays smooth while the main thread
// is busy (chaos mode, popups, React work). Falls back to the main thread where unsupported.
let instance
function fire(opts) {
  if (!instance) {
    const canvas = document.createElement('canvas')
    canvas.className = 'confetti-canvas'
    document.body.appendChild(canvas)
    instance = confetti.create(canvas, { resize: true, useWorker: true })
  }
  return instance(opts)
}

// rasterizing an emoji is expensive — do it once per emoji
const emojiShapes = new Map()
function emojiShape(text) {
  if (!emojiShapes.has(text)) emojiShapes.set(text, confetti.shapeFromText({ text, scalar: 3 }))
  return emojiShapes.get(text)
}

export function burstAt(x, y, opts = {}) {
  fire({
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
    fire({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0, y: 0.8 }, colors })
    fire({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1, y: 0.8 }, colors })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

export function fireworks(duration = 3000) {
  const end = Date.now() + duration
  const id = setInterval(() => {
    if (Date.now() > end) return clearInterval(id)
    fire({
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
  fire({
    shapes: [emojiShape(emoji)],
    scalar: 3,
    particleCount: 18,
    spread: 160,
    origin: { y: 0 },
    startVelocity: 20,
    gravity: 0.8,
    ticks: 160,
  })
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
