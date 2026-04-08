/**
 * SM-2 Spaced Repetition Algorithm
 * Grade: 0=Nope, 1=Almost, 2=Got it, 3=Easy
 */
export function sm2(card, grade) {
  let { ease = 2.5, interval = 1, repetitions = 0 } = card

  if (grade >= 1) {
    if (repetitions === 0) {
      interval = 1
    } else if (repetitions === 1) {
      interval = 6
    } else {
      interval = Math.round(interval * ease)
    }
    repetitions += 1
  } else {
    repetitions = 0
    interval = 1
  }

  ease = ease + (0.1 - (3 - grade) * (0.08 + (3 - grade) * 0.02))
  if (ease < 1.3) ease = 1.3

  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + interval)

  return {
    ease: parseFloat(ease.toFixed(4)),
    interval,
    repetitions,
    due_date: dueDate.toISOString(),
    last_reviewed: new Date().toISOString(),
  }
}

export function getDueCards(reviews) {
  const now = new Date()
  return reviews.filter(r => new Date(r.due_date) <= now)
}
