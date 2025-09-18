'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ModernCard, GlowingButton, AnimatedCounter, StatusBadge, FloatingParticles } from '@/components/ui/ModernCard';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/translations/translations';

interface Core {
  id: string;
  serial: string;
  block: number | null;
  status: 'active' | 'inactive' | 'unknown' | 'expended' | 'lost' | 'retired';
  reuse_count: number;
  rtls_attempts: number;
  rtls_landings: number;
  asds_attempts: number;
  asds_landings: number;
  last_update: string;
  launches: string[];
}

export default function CoresPage() {
  const [cores, setCores] = useState<Core[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [blockFilter, setBlockFilter] = useState<string>('all');
  const { currentLanguage } = useLanguageStore();
  const t = getTranslation(currentLanguage);

  const translateCoreUpdate = (text: string): string => {
    const translationData = t as Record<string, Record<string, Record<string, string> | string>>;
    const phrases = translationData?.cores?.updatePhrases as Record<string, string> | undefined;
    if (!phrases || !text) return text;
    let result = text;
    for (const [needle, replacement] of Object.entries(phrases)) {
      if (!needle) continue;
      result = result.replaceAll(needle, replacement);
    }
    return result;
  };

  useEffect(() => {
    const fetchCores = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://api.spacexdata.com/v4/cores');
        setCores(response.data);
      } catch (error) {
        console.error('Failed to fetch cores:', error);
        setError(t.cores.error);
      } finally {
        setLoading(false);
      }
    };

    fetchCores();
  }, [t.cores.error]);

  const filteredCores = cores.filter(core => {
    const matchesSearch = core.serial.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || core.status === statusFilter;
    const matchesBlock = blockFilter === 'all' || core.block?.toString() === blockFilter;
    return matchesSearch && matchesStatus && matchesBlock;
  });

  const statusCounts = cores.reduce((acc, core) => {
    acc[core.status] = (acc[core.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const blockCounts = cores.reduce((acc, core) => {
    const block = core.block?.toString() || 'unknown';
    acc[block] = (acc[block] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalLandings = cores.reduce((acc, core) => acc + core.rtls_landings + core.asds_landings, 0);
  const totalAttempts = cores.reduce((acc, core) => acc + core.rtls_attempts + core.asds_attempts, 0);
  const totalReuses = cores.reduce((acc, core) => acc + core.reuse_count, 0);
  const landingSuccessRate = totalAttempts > 0 ? Math.round((totalLandings / totalAttempts) * 100) : 0;

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

  if (error) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="relative">
        <FloatingParticles />

        <div className="container mx-auto px-4 relative z-10">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              🚀 {t.cores.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t.cores.subtitle}
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <ModernCard variant="gradient" hover={false}>
              <div className="text-center">
                <AnimatedCounter value={cores.length} className="text-3xl" />
                <p className="text-gray-300 mt-2">{t.cores.totalCores}</p>
              </div>
            </ModernCard>
            <ModernCard variant="neon" hover={false}>
              <div className="text-center">
                <AnimatedCounter value={landingSuccessRate} suffix="%" className="text-3xl text-green-400" />
                <p className="text-gray-300 mt-2">{t.cores.landingSuccess}</p>
              </div>
            </ModernCard>
            <ModernCard variant="glass" hover={false}>
              <div className="text-center">
                <AnimatedCounter value={totalLandings} className="text-3xl text-blue-400" />
                <p className="text-gray-300 mt-2">{t.cores.successfulLandings}</p>
              </div>
            </ModernCard>
            <ModernCard variant="default" hover={false}>
              <div className="text-center">
                <AnimatedCounter value={totalReuses} className="text-3xl text-purple-400" />
                <p className="text-gray-300 mt-2">{t.cores.totalReuses}</p>
              </div>
            </ModernCard>
          </div>

          {/* Filters */}
          <ModernCard variant="glass" className="mb-8">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder={t.cores.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-gray-400 font-medium">{t.cores.status}:</span>
                {['all', 'active', 'inactive', 'expended', 'lost', 'retired'].map(status => (
                  <GlowingButton
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    variant={statusFilter === status ? 'primary' : 'secondary'}
                    className="px-3 py-1 text-sm"
                  >
                    {(t as Record<string, Record<string, string>>)?.cores?.[status] ?? status.charAt(0).toUpperCase() + status.slice(1)}
                    {status !== 'all' && statusCounts[status] && (
                      <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">
                        {statusCounts[status]}
                      </span>
                    )}
                  </GlowingButton>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-gray-400 font-medium">{t.cores.block}:</span>
                {['all', ...Object.keys(blockCounts).sort()].map(block => (
                  <GlowingButton
                    key={block}
                    onClick={() => setBlockFilter(block)}
                    variant={blockFilter === block ? 'neon' : 'secondary'}
                    className="px-3 py-1 text-sm"
                  >
                    {block === 'all' ? t.cores.all : `${t.cores.block} ${block}`}
                    {block !== 'all' && blockCounts[block] && (
                      <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">
                        {blockCounts[block]}
                      </span>
                    )}
                  </GlowingButton>
                ))}
              </div>
            </div>
          </ModernCard>

          {/* Cores Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCores.map((core) => {
              const totalAttemptsByCore = core.rtls_attempts + core.asds_attempts;
              const totalLandingsByCore = core.rtls_landings + core.asds_landings;
              const coreSuccessRate = totalAttemptsByCore > 0 ? Math.round((totalLandingsByCore / totalAttemptsByCore) * 100) : 0;

              return (
                <ModernCard key={core.id} variant="gradient" className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-white">{core.serial}</h3>
                      <StatusBadge status={
                        core.status === 'active' ? 'active' :
                        core.status === 'inactive' ? 'inactive' :
                        core.status === 'expended' ? 'failure' :
                        core.status === 'lost' ? 'failure' :
                        core.status === 'retired' ? 'inactive' :
                        'inactive'
                      } />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{t.cores.block}:</span>
                        <span className="text-white font-medium">
                          {core.block ? `${t.cores.block} ${core.block}` : 'Unknown'}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{t.cores.reuseCount}:</span>
                        <span className="text-purple-400 font-bold">{core.reuse_count}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{t.cores.successRate}:</span>
                        <span className={`font-bold ${coreSuccessRate >= 80 ? 'text-green-400' : coreSuccessRate >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {totalAttemptsByCore > 0 ? `${coreSuccessRate}%` : 'N/A'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-600">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-400">{core.rtls_landings}/{core.rtls_attempts}</div>
                          <div className="text-xs text-gray-400">{t.cores.rtlsLandings}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">{core.asds_landings}/{core.asds_attempts}</div>
                          <div className="text-xs text-gray-400">{t.cores.asdsLandings}</div>
                        </div>
                      </div>

                      <div className="flex justify-between text-sm mt-4">
                        <span className="text-gray-400">{t.cores.missions}:</span>
                        <span className="text-yellow-400 font-bold">{core.launches.length}</span>
                      </div>

                      {core.last_update && (
                        <div className="mt-4 pt-4 border-t border-gray-600">
                          <p className="text-xs text-gray-400 italic">
                            {translateCoreUpdate(core.last_update)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </ModernCard>
              );
            })}
          </div>

          {filteredCores.length === 0 && (
            <ModernCard variant="glass" className="text-center py-12">
              <h3 className="text-2xl font-bold text-gray-400 mb-4">{t.cores.noCoresFound}</h3>
              <p className="text-gray-500">{t.cores.adjustFilters}</p>
            </ModernCard>
          )}

          {/* Legend */}
          <ModernCard variant="glass" className="mt-12">
            <h3 className="text-xl font-bold text-white mb-4">🎯 {t.cores.landingTypes}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
                <span className="text-gray-300">
                  <strong>RTLS:</strong> {t.cores.rtlsDescription}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                <span className="text-gray-300">
                  <strong>ASDS:</strong> {t.cores.asdsDescription}
                </span>
              </div>
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  );
}
