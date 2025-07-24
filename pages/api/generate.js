import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { review, product, length, selectedStyles } = req.body

  const longitudes = {
    breve: "de forma muy breve, en 1 o 2 frases como máximo",
    media: "de forma estándar, entre 3 y 5 frases",
    larga: "de forma extensa, en un párrafo o más"
  }

  const results = {}

  const tipos = {
    profesional: "1. Profesional.",
    emocional: "2. Emocional y cercano.",
    seo: "3. Optimizado para SEO."
  }

  // Generar solo los estilos seleccionados
  for (const tipo in selectedStyles) {
    if (selectedStyles[tipo]) {
      const prompt = `
        Rescribe la siguiente reseña sobre el producto o servicio "${product}" ${longitudes[length] || longitudes['media']} en el siguiente estilo:
        ${tipos[tipo]}
        
        Reseña original: """${review}"""
        
        Devuelve solo el texto reescrito, sin explicaciones ni formato adicional.
      `

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      })

      results[tipo] = completion.choices[0].message?.content?.trim()
    }
  }

  res.status(200).json(results)
}
