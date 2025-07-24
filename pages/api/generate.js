import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { review, product } = req.body

  const prompt = `
Rescribe la siguiente reseña sobre el producto o servicio "${product}" en tres estilos distintos:
1. Profesional.
2. Emocional y cercano.
3. Optimizado para SEO.

Reseña original: """${review}"""

Devuélvelo en JSON con claves "profesional", "emocional" y "seo".
`

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
  })

  const json = completion.choices[0].message?.content

  try {
    const parsed = JSON.parse(json)
    res.status(200).json(parsed)
  } catch {
    res.status(500).json({ error: "Error al procesar la respuesta" })
  }
}
