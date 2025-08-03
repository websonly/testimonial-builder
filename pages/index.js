import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">Testimonial Builder</h1>
      <p className="text-gray-600 max-w-xl mb-8">
        Crea testimonios profesionales de forma automática usando IA. Ideal para portfolios, productos o servicios.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/generador">
          <a className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Generar Testimonio
          </a>
        </Link>
        <Link href="/blog">
          <a className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition">
            Ver Blog
          </a>
        </Link>
      </div>
    </main>
  );
}
