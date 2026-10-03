// Snapshots top jokes from shortiki.com into public/jokes.json.
// shortiki sends no CORS headers, so the browser can't call it directly —
// instead this runs before each deploy (see .github/workflows/deploy.yml).
import { writeFile } from 'node:fs/promises'

const API = 'https://shortiki.com/export/api.php?format=json&type=top&amount=100'

const res = await fetch(API)
if (!res.ok) throw new Error(`shortiki responded ${res.status}`)
const jokes = (await res.json()).map(({ content }) => ({ content })).filter((j) => j.content)
if (!jokes.length) throw new Error('shortiki returned no jokes')

await writeFile(new URL('../public/jokes.json', import.meta.url), JSON.stringify(jokes, null, 1) + '\n')
console.log(`saved ${jokes.length} jokes`)
