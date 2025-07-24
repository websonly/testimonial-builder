import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { review, product, length, styles } = req.body

  const longitudes = {
    breve: 'de forma muy breve, en 1 o 2 frases como máximo',
    media: 'de forma estándar, entre 3 y 5 frases',
    larga: 'de forma extensa, en un párrafo o más'
  }

  const estiloTexto = styles
    .map((style, idx) => `${idx + 1}. Estilo "${style}".`)
    .join('\n')

  const prompt = `
Rescribe la siguiente reseña sobre el producto o servicio "${product}" en los siguientes estilos, redactados ${longitudes[length] || longitudes['media']}:

${estiloTexto}

Reseña original: """${review}"""

Devuélvelo en JSON, con claves que coincidan exactamente con los estilos solicitados.
`.trim()

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }]
  })

  const json = completion.choices[0].message?.content

  try {
    const parsed = JSON.parse(json)
    res.status(200).json(parsed)
  } catch {
    res.status(500).json({ error: 'Error al procesar la respuesta' })
  }
}
