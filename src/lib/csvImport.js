/**
 * Parse CSV file with columns: front, back, tags (optional)
 * Returns array of card objects
 */
export function parseCSV(text) {
  const lines = text.trim().split('\n')
  if (lines.length < 2) throw new Error('CSV must have a header row and at least one card.')

  const header = parseCSVRow(lines[0]).map(h => h.toLowerCase().trim())
  const frontIdx = header.indexOf('front')
  const backIdx = header.indexOf('back')
  const tagsIdx = header.indexOf('tags')

  if (frontIdx === -1 || backIdx === -1) {
    throw new Error('CSV must have "front" and "back" columns.')
  }

  const cards = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    const cols = parseCSVRow(line)
    const front = (cols[frontIdx] || '').trim()
    const back = (cols[backIdx] || '').trim()
    if (!front || !back) continue

    const tags = tagsIdx !== -1 && cols[tagsIdx]
      ? cols[tagsIdx].split(';').map(t => t.trim()).filter(Boolean)
      : []

    cards.push({ front, back, tags })
  }

  return cards
}

function parseCSVRow(text) {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  return result
}

export function generateCSVTemplate() {
  return `front,back,tags
"What is spaced repetition?","A learning technique that increases intervals of review over time","memory;learning"
"What does SRS stand for?","Spaced Repetition System","memory;acronym"
`
}
