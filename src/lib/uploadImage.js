/**
 * Convert an image File to a base64 data URL.
 * Images are embedded directly in card content — no Supabase Storage needed.
 * Resizes large images before encoding to keep DB rows reasonable.
 */
export async function uploadCardImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target.result
      // Resize if the raw base64 is very large (>1MB)
      const img = new window.Image()
      img.onload = () => {
        const MAX = 1200 // max px on longest side
        let { width, height } = img
        if (width > MAX || height > MAX) {
          const ratio = Math.min(MAX / width, MAX / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/webp', 0.85))
      }
      img.onerror = reject
      img.src = dataUrl
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
