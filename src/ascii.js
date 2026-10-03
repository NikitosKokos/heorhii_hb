// Jotaro in his cap, staring at you. Pure ASCII so it lines up in any monospace font.
export const JOTARO = String.raw`
         _________
     ___/   (*)   \___
    /_________________\
      |  \       /  |
      |  (O)   (O)  |
      |      L      |
      |    -----    |
       \___________/
`.slice(1)

// flexing kaomoji — gym + JoJo pose in one
export const FLEX = 'ᕦ(ò_óˇ)ᕤ'

let logged = false

// easter egg for a vibe coder who opens DevTools
export function logEasterEgg() {
  if (logged) return
  logged = true
  console.log(`%c${JOTARO}        ゴ ゴ ゴ ゴ`, 'color:#b14cff;font-family:monospace;font-size:13px;font-weight:bold')
  console.log(
    '%cГеоргий, с днём рождения! 🎉 Если ты открыл консоль — ты настоящий вайбкодер 💻💪',
    'color:#ffd23f;background:#1b0b3a;padding:8px 12px;border-radius:8px;font-size:14px;font-weight:bold',
  )
  console.log('%cYare yare daze… — Nikita', 'color:#3bceac;font-style:italic')
}
