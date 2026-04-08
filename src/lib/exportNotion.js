/**
 * Exports deck cards as Notion-importable markdown
 * Uses > toggle syntax for collapsible cards
 */
export function exportToNotion(deck, cards) {
  const date = new Date().toISOString().split('T')[0]
  const lines = []

  lines.push(`# ${deck.emoji ? deck.emoji + ' ' : ''}${deck.name}`)
  lines.push('')
  if (deck.description) {
    lines.push(`> ${deck.description}`)
    lines.push('')
  }
  lines.push(`*Exported from Flipside on ${date}*`)
  lines.push('')
  lines.push('---')
  lines.push('')

  cards.forEach((card, i) => {
    // Notion toggle syntax
    lines.push(`> **${i + 1}. ${card.front}**`)
    lines.push(`> `)
    const backLines = card.back.split('\n')
    backLines.forEach(line => {
      lines.push(`> ${line}`)
    })
    if (card.tags && card.tags.length > 0) {
      lines.push(`> `)
      lines.push(`> *Tags: ${card.tags.join(', ')}*`)
    }
    lines.push('')
  })

  return lines.join('\n')
}

export function downloadMarkdown(content, deckName) {
  const date = new Date().toISOString().split('T')[0]
  const slug = deckName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const filename = `flipside-export-${slug}-${date}.md`

  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
