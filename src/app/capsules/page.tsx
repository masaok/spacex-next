'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ModernCard, GlowingButton, AnimatedCounter, StatusBadge, FloatingParticles } from '@/components/ui/ModernCard';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/translations/translations';

interface Capsule {
  id: string;
  serial: string;
  status: 'active' | 'destroyed' | 'retired' | 'inactive' | 'unknown';
  type: string;
  dragon: string;
  reuse_count: number;
  water_landings: number;
  land_landings: number;
  last_update: string | null;
  launches: string[];
}

export default function CapsulesPage() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { currentLanguage } = useLanguageStore();
  const t = getTranslation(currentLanguage);

  useEffect(() => {
    const fetchCapsules = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://api.spacexdata.com/v4/capsules');
        setCapsules(response.data);
      } catch (error) {
        console.error('Failed to fetch capsules:', error);
        setError('Failed to load capsules data');
      } finally {
        setLoading(false);
      }
    };

    fetchCapsules();
  }, []);

  const filteredCapsules = capsules.filter(capsule => {
    const matchesSearch = capsule.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         capsule.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || capsule.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = capsules.reduce((acc, capsule) => {
    acc[capsule.status] = (acc[capsule.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalLandings = capsules.reduce((acc, capsule) => acc + capsule.water_landings + capsule.land_landings, 0);
  const totalReuses = capsules.reduce((acc, capsule) => acc + capsule.reuse_count, 0);

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
              🚀 {t.capsules.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t.capsules.subtitle}
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <ModernCard variant="gradient" hover={false}>
              <div className="text-center">
                <AnimatedCounter value={capsules.length} className="text-3xl" />
                <p className="text-gray-300 mt-2">{t.capsules.totalCapsules}</p>
              </div>
            </ModernCard>
            <ModernCard variant="neon" hover={false}>
              <div className="text-center">
                <AnimatedCounter value={statusCounts.active || 0} className="text-3xl text-green-400" />
                <p className="text-gray-300 mt-2">{t.capsules.activeCapsules}</p>
              </div>
            </ModernCard>
            <ModernCard variant="glass" hover={false}>
              <div className="text-center">
                <AnimatedCounter value={totalLandings} className="text-3xl text-blue-400" />
                <p className="text-gray-300 mt-2">{t.capsules.totalLandings}</p>
              </div>
            </ModernCard>
            <ModernCard variant="default" hover={false}>
              <div className="text-center">
                <AnimatedCounter value={totalReuses} className="text-3xl text-purple-400" />
                <p className="text-gray-300 mt-2">{t.capsules.totalReuses}</p>
              </div>
            </ModernCard>
          </div>

          {/* Filters */}
          <ModernCard variant="glass" className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={t.capsules.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {['all', 'active', 'destroyed', 'retired', 'inactive'].map(status => (
                  <GlowingButton
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    variant={statusFilter === status ? 'primary' : 'secondary'}
                    className="px-4 py-2 text-sm"
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                    {status !== 'all' && statusCounts[status] && (
                      <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">
                        {statusCounts[status]}
                      </span>
                    )}
                  </GlowingButton>
                ))}
              </div>
            </div>
          </ModernCard>

          {/* Capsules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCapsules.map((capsule) => (
              <ModernCard key={capsule.id} variant="gradient" className="overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white">{capsule.serial}</h3>
                    <StatusBadge status={
                      capsule.status === 'active' ? 'active' :
                      capsule.status === 'inactive' ? 'inactive' :
                      capsule.status === 'destroyed' ? 'failure' :
                      capsule.status === 'retired' ? 'inactive' :
                      'inactive'
                    } />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{t.capsules.type}:</span>
                      <span className="text-white font-medium">{capsule.type}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{t.capsules.dragonId}:</span>
                      <span className="text-white font-medium">{capsule.dragon || 'Unknown'}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{t.capsules.reuseCount}:</span>
                      <span className="text-purple-400 font-bold">{capsule.reuse_count}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-600">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-400">{capsule.water_landings}</div>
                        <div className="text-xs text-gray-400">{t.capsules.waterLandings}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400">{capsule.land_landings}</div>
                        <div className="text-xs text-gray-400">{t.capsules.landLandings}</div>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm mt-4">
                      <span className="text-gray-400">{t.capsules.missions}:</span>
                      <span className="text-yellow-400 font-bold">{capsule.launches.length}</span>
                    </div>

                    {capsule.last_update && (
                      <div className="mt-4 pt-4 border-t border-gray-600">
                        <p className="text-xs text-gray-400 italic">
                          {capsule.last_update}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>

          {filteredCapsules.length === 0 && (
            <ModernCard variant="glass" className="text-center py-12">
              <h3 className="text-2xl font-bold text-gray-400 mb-4">{t.capsules.noCapsulesFound}</h3>
              <p className="text-gray-500">{t.capsules.adjustFilters}</p>
            </ModernCard>
          )}
        </div>
      </div>
    </div>
  );
}