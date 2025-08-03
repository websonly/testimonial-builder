import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [review, setReview] = useState('')
  const [product, setProduct] = useState('')
  const [length, setLength] = useState('media')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const [selectedStyles, setSelectedStyles] = useState(['profesional', 'emocional', 'seo'])
  const [customTags, setCustomTags] = useState([])
  const [customInput, setCustomInput] = useState('')
  const [onlyCustom, setOnlyCustom] = useState(false)

  const [downloadFormat, setDownloadFormat] = useState('json')

  const [history, setHistory] = useState([])
  const [historyDownloadFormat, setHistoryDownloadFormat] = useState('json')

  const handleSubmit = async () => {
    setLoading(true)

    let styles = []
    if (onlyCustom) {
      styles = [...customTags]
    } else {
      styles = [...selectedStyles]
      if (customTags.length > 0) styles = [...styles, ...customTags]
    }

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review, product, length, styles })
    })

    const data = await res.json()
    setResult(data)

    setHistory(prev => ([
      {
        id: Date.now(),
        product,
        review,
        styles,
        length,
        result: data,
        timestamp: new Date().toISOString()
      },
      ...prev
    ]))

    setLoading(false)
  }
    
  const handleDownload = () => {
    if (!result) return

    let content = ''
    let mimeType = 'application/json'

    switch (downloadFormat) {
      case 'json':
        content = JSON.stringify(result, null, 2)
        mimeType = 'application/json'
        break
      case 'html':
        content = Object.entries(result)
          .map(([style, text]) => `<h2>${style}</h2><p>${text}</p>`)
          .join('<hr>')
        mimeType = 'text/html'
        break
      case 'markdown':
        content = Object.entries(result)
          .map(([style, text]) => `## ${style}\n\n${text}`)
          .join('\n\n---\n\n')
        mimeType = 'text/markdown'
        break
      case 'txt':
        content = Object.entries(result)
          .map(([style, text]) => `${style.toUpperCase()}:\n${text}`)
          .join('\n\n----------------------\n\n')
        mimeType = 'text/plain'
        break
      default:
        return
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `testimonio-${(product || 'producto').replace(/\s+/g, '-').toLowerCase()}.${downloadFormat}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleDownloadHistory = () => {
    if (!history.length) return

    let content = ''
    let mimeType = 'application/json'

    switch (historyDownloadFormat) {
      case 'json':
        content = JSON.stringify(history, null, 2)
        mimeType = 'application/json'
        break
      case 'html':
        content = history
          .map(entry =>
            `<h2>${entry.product}</h2><small>${entry.timestamp}</small>` +
            Object.entries(entry.result)
              .map(([style, text]) => `<h3>${style}</h3><p>${text}</p>`)
              .join('')
          )
          .join('<hr>')
        mimeType = 'text/html'
        break
      case 'markdown':
        content = history
          .map(entry =>
            `## ${entry.product} (${entry.timestamp})\n\n` +
            Object.entries(entry.result)
              .map(([style, text]) => `### ${style}\n\n${text}`)
              .join('\n\n')
          )
          .join('\n\n---\n\n')
        mimeType = 'text/markdown'
        break
      case 'txt':
        content = history
          .map(entry =>
            `PRODUCTO: ${entry.product} (${entry.timestamp})\n` +
            Object.entries(entry.result)
              .map(([style, text]) => `\n${style.toUpperCase()}:\n${text}`)
              .join('\n')
          )
          .join('\n\n----------------------\n\n')
        mimeType = 'text/plain'
        break
      default:
        return
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `historial-testimonios.${historyDownloadFormat}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow">
        <h1 className="text-4xl font-bold text-purple-600 underline mb-6">
          Generador de Testimonios con IA
        </h1>

        {/* Estilos */}
        <div className="mb-4">
          <h2 className="font-semibold mb-2">Estilos a generar:</h2>
          {['profesional', 'emocional', 'seo'].map((style) => (
          <label key={style} className="block text-sm mb-1">
            <input
              type="checkbox"
              checked={selectedStyles.includes(style)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedStyles([...selectedStyles, style])
                } else {
                  setSelectedStyles(selectedStyles.filter((s) => s !== style))
                }
              }}
              className="mr-2"
            />
            {style}
          </label>
          ))}

          <label className="block text-sm mt-3 mb-1">
            <input
              type="checkbox"
              checked={onlyCustom}
              onChange={(e) => setOnlyCustom(e.target.checked)}
              className="mr-2"
            />
            Usar solo estilos personalizados
          </label>

          {/* Tags personalizados */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Estilos personalizados:</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {customTags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full flex items-center space-x-1"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => setCustomTags(customTags.filter((_, i) => i !== index))}
                    className="text-purple-500 hover:text-purple-700"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Escribe un estilo y pulsa Añadir"
                className="flex-1 border px-2 py-1 rounded"
              />
              <button
                type="button"
                onClick={() => {
                  const trimmed = customInput.trim()
                  if (trimmed && !customTags.includes(trimmed)) {
                    setCustomTags([...customTags, trimmed])
                    setCustomInput('')
                  }
                }}
                className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
              >
                Añadir
              </button>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <input
          className="w-full p-2 border mb-2 rounded"
          placeholder="Nombre del producto o servicio"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        />
        <textarea
          className="w-full p-2 border mb-2 rounded"
          rows={5}
          placeholder="Escribe la reseña original del cliente"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        <select
          className="w-full p-2 border mb-4 rounded text-sm text-gray-700"
          value={length}
          onChange={(e) => setLength(e.target.value)}
        >
          <option value="breve">Breve (1-2 frases)</option>
          <option value="media">Media (3-5 frases)</option>
          <option value="larga">Larga (1 párrafo o más)</option>
        </select>

        {/* Botón generar */}
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-full disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={loading || (!onlyCustom && selectedStyles.length === 0 && customTags.length === 0)}
        >
          {loading ? 'Generando...' : 'Crear Testimonios'}
        </button>

        {/* Descarga último resultado */}
        {result && (
          <div className="mt-6">
            <label className="block text-sm font-medium mb-1">Formato de descarga:</label>
            <select
              value={downloadFormat}
              onChange={(e) => setDownloadFormat(e.target.value)}
              className="w-full p-2 border rounded mb-2 text-sm"
            >
              <option value="json">JSON</option>
              <option value="html">HTML</option>
              <option value="markdown">Markdown</option>
              <option value="txt">Texto plano</option>
            </select>

            <button
              onClick={handleDownload}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
            >
              Descargar testimonio
            </button>
          </div>
        )}

        {/* Resultados en grid con scroll interno */}
        {result && (
          <div className="mt-8 max-h-[480px] overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(result).map(([style, text]) => (
                <div key={style} className="border p-4 rounded bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold capitalize">{style}</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(text)}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        Copiar texto
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(`<blockquote><p>${text}</p></blockquote>`)}
                        className="text-sm text-green-500 hover:underline"
                      >
                        Copiar HTML
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(JSON.stringify({ [style]: text }, null, 2))}
                        className="text-sm text-purple-500 hover:underline"
                      >
                        Copiar JSON
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(`> ${text.replace(/\n/g, '\n> ')}\n> — ${style}`)}
                        className="text-sm text-yellow-600 hover:underline"
                      >
                        Copiar Markdown
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 whitespace-pre-line">{text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historial */}
        {history.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-2">Historial de testimonios</h2>

            <div className="max-h-[400px] overflow-y-auto space-y-4">
              {history.map(entry => (
                <div key={entry.id} className="border rounded p-4 bg-gray-50">
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>{entry.product}</strong> — {new Date(entry.timestamp).toLocaleString()}
                  </div>
                  {Object.entries(entry.result).map(([style, text]) => (
                    <div key={style} className="mb-2">
                      <p className="font-medium text-purple-600 capitalize">{style}</p>
                      <p className="text-sm text-gray-800 whitespace-pre-line">{text}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Descargar historial como:</label>
              <select
                value={historyDownloadFormat}
                onChange={(e) => setHistoryDownloadFormat(e.target.value)}
                className="w-full p-2 border rounded mb-2 text-sm"
              >
                <option value="json">JSON</option>
                <option value="html">HTML</option>
                <option value="markdown">Markdown</option>
                <option value="txt">Texto plano</option>
              </select>

              <button
                onClick={handleDownloadHistory}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
              >
                Descargar historial
              </button>
            </div>
          </div>
        )}
      </div>

     <Link href="/blog">
      <a className="text-blue-500 hover:underline block mt-4 text-center">
        Leer el blog →
      </a>
    </Link>
    
    </div>
  )
}

