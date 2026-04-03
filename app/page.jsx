import Link from 'next/link';

export default function GlobalHome() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
      {/* Hero Section */}
      <div className="max-w-2xl">
        <h1 className="text-5xl font-black font-headline text-primary mb-6 tracking-tight">
          The Ethereal Academic
        </h1>
        <p className="text-xl text-on-surface-variant font-body mb-10 leading-relaxed">
          A high-performance administrative management suite for modern educational institutions.
          Secure, scalable, and built for the future.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="px-10 py-4 bg-primary text-on-primary rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-10 py-4 bg-white dark:bg-slate-900 text-primary border-2 border-primary/10 rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Feature Pills */}
      <div className="mt-20 flex flex-wrap justify-center gap-8 opacity-50">
        {['Next.js 15', 'Tailwind v4', 'PostgreSQL', 'Prisma'].map((tech) => (
          <span key={tech} className="px-4 py-2 bg-surface-container-high rounded-full text-xs font-black uppercase tracking-tighter">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}