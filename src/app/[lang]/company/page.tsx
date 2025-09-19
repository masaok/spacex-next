'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ModernCard, GlowingButton, AnimatedCounter, FloatingParticles } from '@/components/ui/ModernCard';
import { getTranslation } from '@/translations/translations';
import { SupportedLanguage } from '@/types/language';

interface Headquarters {
  address: string;
  city: string;
  state: string;
}

interface Company {
  name: string;
  founder: string;
  founded: number;
  employees: number;
  vehicles: number;
  launch_sites: number;
  test_sites: number;
  ceo: string;
  cto: string;
  coo: string;
  cto_propulsion: string;
  valuation: number;
  headquarters: Headquarters;
  links: {
    website: string;
    flickr: string;
    twitter: string;
    elon_twitter: string;
  };
  summary: string;
}

export default function CompanyPage({ params }: { params: Promise<{ lang: SupportedLanguage }> }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<SupportedLanguage>('en');
  const t = getTranslation(lang);

  useEffect(() => {
    params.then(({ lang }) => setLang(lang));
  }, [params]);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://api.spacexdata.com/v4/company');
        setCompany(response.data);
      } catch (error) {
        console.error('Failed to fetch company info:', error);
        setError(t.company.error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [t.company.error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="relative">
          <FloatingParticles />
          <ModernCard variant="glass" className="p-8">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xl text-white">{t.common.loading}</span>
            </div>
          </ModernCard>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center">
        <ModernCard variant="glass" className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-300">{error}</p>
          <GlowingButton
            onClick={() => window.location.reload()}
            className="mt-4"
            variant="primary"
          >
            {t.common.retry}
          </GlowingButton>
        </ModernCard>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="relative">
        <FloatingParticles />

        <div className="container mx-auto px-4 relative z-10">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              🏢 {t.company.title}
            </h1>
            <p className="text-2xl text-gray-300 mb-6">
              {t.company.foundedBy} {company.founder} in {company.founded}
            </p>
            <ModernCard variant="glass" className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-300 leading-relaxed">
                {t.company.description}
              </p>
            </ModernCard>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <ModernCard variant="gradient" hover={false}>
              <div className="text-center">
                <AnimatedCounter value={company.employees} className="text-3xl" />
                <p className="text-gray-300 mt-2">{t.company.employees}</p>
              </div>
            </ModernCard>
            <ModernCard variant="neon" hover={false}>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {formatCurrency(company.valuation)}
                </div>
                <p className="text-gray-300 mt-2">{t.company.valuation}</p>
              </div>
            </ModernCard>
            <ModernCard variant="glass" hover={false}>
              <div className="text-center">
                <AnimatedCounter value={company.vehicles} className="text-3xl text-blue-400" />
                <p className="text-gray-300 mt-2">{t.company.vehicles}</p>
              </div>
            </ModernCard>
            <ModernCard variant="default" hover={false}>
              <div className="text-center">
                <AnimatedCounter value={company.launch_sites} className="text-3xl text-purple-400" />
                <p className="text-gray-300 mt-2">{t.company.launchSites}</p>
              </div>
            </ModernCard>
          </div>

          {/* Leadership Team */}
          <ModernCard variant="gradient" className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              🚀 {t.company.leadershipTeam}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                <div className="text-4xl mb-2">👨‍💼</div>
                <h3 className="text-lg font-bold text-purple-400">{t.company.ceo}</h3>
                <p className="text-white">{company.ceo}</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                <div className="text-4xl mb-2">🔧</div>
                <h3 className="text-lg font-bold text-blue-400">{t.company.cto}</h3>
                <p className="text-white">{company.cto}</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                <div className="text-4xl mb-2">📊</div>
                <h3 className="text-lg font-bold text-green-400">{t.company.coo}</h3>
                <p className="text-white">{company.coo}</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                <div className="text-4xl mb-2">🚀</div>
                <h3 className="text-lg font-bold text-orange-400">{t.company.ctoPropulsion}</h3>
                <p className="text-white">{company.cto_propulsion}</p>
              </div>
            </div>
          </ModernCard>

          {/* Headquarters & Facilities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <ModernCard variant="glass">
              <h2 className="text-2xl font-bold text-white mb-6">
                🏢 {t.company.headquarters}
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">{t.company.address}:</span>
                  <span className="text-white">{company.headquarters.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t.company.city}:</span>
                  <span className="text-white">{company.headquarters.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t.company.state}:</span>
                  <span className="text-white">{company.headquarters.state}</span>
                </div>
              </div>
            </ModernCard>

            <ModernCard variant="neon">
              <h2 className="text-2xl font-bold text-white mb-6">
                🚀 {t.company.facilities}
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">{t.company.launchSites}:</span>
                  <span className="text-cyan-400 font-bold text-xl">{company.launch_sites}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">{t.company.testSites}:</span>
                  <span className="text-cyan-400 font-bold text-xl">{company.test_sites}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">{t.company.vehicleTypes}:</span>
                  <span className="text-cyan-400 font-bold text-xl">{company.vehicles}</span>
                </div>
              </div>
            </ModernCard>
          </div>

          {/* Social Links */}
          <ModernCard variant="gradient" className="text-center">
            <h2 className="text-3xl font-bold text-white mb-8">
              🌐 {t.company.connectWithSpacex}
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <GlowingButton
                onClick={() => window.open(company.links.website, '_blank')}
                variant="primary"
              >
                🌐 {t.company.officialWebsite}
              </GlowingButton>
              <GlowingButton
                onClick={() => window.open(company.links.twitter, '_blank')}
                variant="neon"
              >
                🐦 {t.company.spacexTwitter}
              </GlowingButton>
              <GlowingButton
                onClick={() => window.open(company.links.elon_twitter, '_blank')}
                variant="secondary"
              >
                👨‍🚀 {t.company.elonTwitter}
              </GlowingButton>
              <GlowingButton
                onClick={() => window.open(company.links.flickr, '_blank')}
                variant="primary"
              >
                📸 {t.company.photosFlickr}
              </GlowingButton>
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  );
}