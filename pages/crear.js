// pages/crear.js

import { useState } from 'react';

export default function CrearPost() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [contenido, setContenido] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMensaje('');
    if (password !== process.env.NEXT_PUBLIC_CREATOR_PASSWORD) {
      setMensaje('Contraseña incorrecta.');
      return;
    }

    if (!titulo || !contenido) {
      setMensaje('Faltan campos obligatorios.');
      return;
    }

    setLoading(true);

    const res = await fetch('/api/generar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, descripcion, contenido }),
    });

    const data = await res.json();
    if (res.ok) {
      setMensaje(`✅ Post generado como ${data.slug}.md`);
      setTitulo('');
      setDescripcion('');
      setContenido('');
    } else {
      setMensaje(`❌ Error: ${data.error}`);
    }

    setLoading(false);
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Crear nuevo post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full border px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Título"
          className="w-full border px-3 py-2"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Descripción (opcional)"
          className="w-full border px-3 py-2"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <textarea
          placeholder="Contenido Markdown"
          className="w-full border px-3 py-2 h-40"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Generando...' : 'Generar post'}
        </button>
      </form>
      {mensaje && <p className="mt-4">{mensaje}</p>}
    </main>
  );
}
