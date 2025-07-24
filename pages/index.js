import { useState } from 'react'

export default function Home() {
  const [review, setReview] = useState('')
  const [product, setProduct] = useState('')
  const [length, setLength] = useState('media') // <- Nuevo estado
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)


  const [selectedStyles, setSelectedStyles] = useState({
  profesional: true,
  emocional: true,
  seo: true
})


  
  const handleSubmit = async () => {
    setLoading(true)
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review, product, selectedStyles })
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow">
        <h1 className="text-4xl font-bold text-purple-600 underline mb-6">
          Generador de Testimonios con IA
        </h1>

        <input
          className="w-full p-2 border mb-2 rounded"
          placeholder="Nombre del producto o servicio"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        />
        <textarea
            
  <div className="mb-4">
  <h2 className="font-semibold mb-2">Estilos a generar:</h2>
  {['profesional', 'emocional', 'seo'].map((style) => (
    <label key={style} className="block text-sm">
      <input
        type="checkbox"
        checked={selectedStyles[style]}
        onChange={() =>
          setSelectedStyles(prev => ({ ...prev, [style]: !prev[style] }))
        }
        className="mr-2"
      />
      {style.charAt(0).toUpperCase() + style.slice(1)}
    </label>
  ))}
</div>

          className="w-full p-2 border mb-2 rounded"
          rows={5}
          placeholder="Escribe la reseña original del cliente"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        {/* Nuevo selector de longitud */}
        <select
          className="w-full p-2 border mb-4 rounded text-sm text-gray-700"
          value={length}
          onChange={(e) => setLength(e.target.value)}
        >
          <option value="breve">Breve (1-2 frases)</option>
          <option value="media">Media (3-5 frases)</option>
          <option value="larga">Larga (1 párrafo o más)</option>
        </select>

        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Generando...' : 'Crear Testimonios'}
        </button>

        {result && (
          <div className="mt-6 space-y-4">
            {['profesional', 'emocional', 'seo'].map((type) => (
              <div key={type} className="border p-4 rounded bg-gray-50">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold capitalize">{type}</h2>
                  <button
                    onClick={() => navigator.clipboard.writeText(result[type])}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Copiar
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-800">{result[type]}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
