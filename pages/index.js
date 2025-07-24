import { useState } from 'react'

export default function Home() {
  const [review, setReview] = useState('')
  const [product, setProduct] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review, product })
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-purple-600 underline">
            Generador de Testimonios con IA
          </h1>
          <p className="text-gray-600 mt-2">
            Transforma reseñas en textos profesionales, emocionales y optimizados.
          </p>
        </header>

        <div className="space-y-4 mb-6">
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Nombre del producto o servicio"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          />
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            rows={5}
            placeholder="Escribe la reseña original del cliente"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          <button
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Generando...' : 'Crear Testimonios'}
          </button>
        </div>

        {result && (
          <section className="space-y-6">
            {['profesional', 'emocional', 'seo'].map((type) => (
              <div key={type} className="border border-gray-200 p-5 rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold capitalize text-gray-800">
                    {type}
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(result[type])}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Copiar
                  </button>
                </div>
                <p className="text-gray-700 text-sm whitespace-pre-line">{result[type]}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  )
}
