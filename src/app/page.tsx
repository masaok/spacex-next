'use client';

import Link from "next/link";
import { useLanguageStore } from "../store/languageStore";
import { getTranslation } from "../translations/translations";

export default function Home() {
  const { currentLanguage } = useLanguageStore();
  const t = getTranslation(currentLanguage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className="h-screen bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
          }}
        >
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white max-w-4xl mx-auto px-6">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  {t.home.hero.title}
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                {t.home.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/launches"
                  className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <span className="flex items-center justify-center">
                    🚀 {t.home.hero.exploreLaunches}
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/vehicles"
                  className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <span className="flex items-center justify-center">
                    🛸 {t.home.hero.viewFleet}
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Mission Dashboard
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Real-time data and comprehensive insights into SpaceX operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Launches Card */}
            <Link href="/launches" className="group">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-2xl mr-4">
                    🚀
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{t.home.sections.launches.title}</h3>
                    <p className="text-gray-400">{t.home.sections.launches.subtitle}</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {t.home.sections.launches.description}
                </p>
                <div className="flex items-center text-blue-400 group-hover:text-blue-300">
                  <span className="font-semibold">{t.home.sections.launches.cta}</span>
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Vehicles Card */}
            <Link href="/vehicles" className="group">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-2xl mr-4">
                    🛸
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{t.home.sections.vehicles.title}</h3>
                    <p className="text-gray-400">{t.home.sections.vehicles.subtitle}</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {t.home.sections.vehicles.description}
                </p>
                <div className="flex items-center text-purple-400 group-hover:text-purple-300">
                  <span className="font-semibold">{t.home.sections.vehicles.cta}</span>
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">200+</div>
              <div className="text-gray-400">Successful Launches</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">4</div>
              <div className="text-gray-400">Active Vehicles</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">95%</div>
              <div className="text-gray-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">∞</div>
              <div className="text-gray-400">Possibilities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-gray-400 mb-4">
            Data provided by SpaceX API • Built with Next.js & Tailwind CSS
          </div>
          <div className="text-sm text-gray-500">
            Exploring the cosmos, one launch at a time 🌌
          </div>
        </div>
      </footer>
    </div>
  );
}