import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Users, Zap, Database } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            SaaS Starter Kit
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
          Build multi-tenant SaaS products faster
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
          Production-ready authentication, roles, permissions & tenant isolation
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/register">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Everything you need to get started
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900">
              <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Multi-Tenant Architecture</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Built-in tenant isolation and management for scalable SaaS applications
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900">
              <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Role & Permission System</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Flexible role-based access control with granular permissions
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900">
              <Zap className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Secure JWT Auth</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Industry-standard authentication with access and refresh tokens
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Scalable Backend</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Built with NestJS, PostgreSQL, Redis, and Prisma for production
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="container mx-auto px-4 py-24">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Built with modern technologies
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-8 text-gray-600 dark:text-gray-400">
          <div className="text-lg font-semibold">NestJS</div>
          <div className="text-lg font-semibold">PostgreSQL</div>
          <div className="text-lg font-semibold">Redis</div>
          <div className="text-lg font-semibold">Prisma</div>
          <div className="text-lg font-semibold">Next.js</div>
          <div className="text-lg font-semibold">TypeScript</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 SaaS Starter Kit. MIT License.
            </div>
            <div className="flex gap-6 text-sm">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                GitHub
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                Documentation
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
