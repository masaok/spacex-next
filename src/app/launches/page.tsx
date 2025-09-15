'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ModernCard, GlowingButton, AnimatedCounter, StatusBadge, FloatingParticles } from '@/components/ui/ModernCard';
import { OptimizedImage } from '@/components/OptimizedImage';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/translations/translations';
import { DateTime } from 'luxon';

interface Launch {
  id: string;
  flight_number: number;
  name: string;
  date_utc: string;
  date_unix: number;
  date_local: string;
  success: boolean | null;
  failures: Array<{
    time: number;
    altitude: number;
    reason: string;
  }>;
  upcoming: boolean;
  details: string | null;
  rocket: string;
  launchpad: string;
  payloads: string[];
  links: {
    patch: {
      small: string | null;
      large: string | null;
    };
    reddit: {
      campaign: string | null;
      launch: string | null;
      media: string | null;
      recovery: string | null;
    };
    flickr: {
      small: string[];
      original: string[];
    };
    presskit: string | null;
    webcast: string | null;
    youtube_id: string | null;
    article: string | null;
    wikipedia: string | null;
  };
}

export default function LaunchesPage() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'past' | 'upcoming'>('all');
  const [successFilter, setSuccessFilter] = useState<'all' | 'success' | 'failure'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const { currentLanguage } = useLanguageStore();
  const t = getTranslation(currentLanguage);

  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://api.spacexdata.com/v5/launches');
        const sortedLaunches = response.data.sort((a: Launch, b: Launch) =>
          sortOrder === 'desc' ? b.date_unix - a.date_unix : a.date_unix - b.date_unix
        );
        setLaunches(sortedLaunches);
      } catch (error) {
        console.error('Failed to fetch launches:', error);
        setError('Failed to load launches data');
      } finally {
        setLoading(false);
      }
    };

    fetchLaunches();
  }, [sortOrder]);

  const filteredLaunches = launches.filter(launch => {
    const matchesSearch = launch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         launch.flight_number.toString().includes(searchTerm);
    const matchesType = filterType === 'all' ||
                       (filterType === 'upcoming' && launch.upcoming) ||
                       (filterType === 'past' && !launch.upcoming);
    const matchesSuccess = successFilter === 'all' ||
                          (successFilter === 'success' && launch.success === true) ||
                          (successFilter === 'failure' && launch.success === false);
    return matchesSearch && matchesType && matchesSuccess;
  });

  const stats = {
    total: launches.length,
    successful: launches.filter(l => l.success === true).length,
    failed: launches.filter(l => l.success === false).length,
    upcoming: launches.filter(l => l.upcoming).length,
    successRate: launches.filter(l => !l.upcoming).length > 0
      ? Math.round((launches.filter(l => l.success === true).length / launches.filter(l => !l.upcoming).length) * 100)
      : 0
  };

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
              🚀 {t.launches.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t.launches.subtitle}
            </p>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
            <ModernCard variant="gradient" hover={false}>
              <div className="text-center">
                <AnimatedCounter value={stats.total} className="text-3xl" />
                <p className="text-gray-300 mt-2">{t.launches.totalLaunches}</p>
              </div>
            </ModernCard>
            <ModernCard variant="neon" hover={false}>
              <div className="text-center">
                <AnimatedCounter value={stats.successful} className="text-3xl text-green-400" />
                <p className="text-gray-300 mt-2">{t.launches.successful}</p>
              </div>
            </ModernCard>
            <ModernCard variant="glass" hover={false}>
              <div className="text-center">
                <AnimatedCounter value={stats.failed} className="text-3xl text-red-400" />
                <p className="text-gray-300 mt-2">{t.launches.failed}</p>
              </div>
            </ModernCard>
            <ModernCard variant="default" hover={false}>
              <div className="text-center">
                <AnimatedCounter value={stats.upcoming} className="text-3xl text-yellow-400" />
                <p className="text-gray-300 mt-2">{t.launches.upcoming}</p>
              </div>
            </ModernCard>
            <ModernCard variant="gradient" hover={false}>
              <div className="text-center">
                <AnimatedCounter value={stats.successRate} suffix="%" className="text-3xl text-purple-400" />
                <p className="text-gray-300 mt-2">{t.launches.successRate}</p>
              </div>
            </ModernCard>
          </div>

          {/* Filters and Controls */}
          <ModernCard variant="glass" className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={t.launches.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="flex gap-2">
                  {(['all', 'past', 'upcoming'] as const).map(type => (
                    <GlowingButton
                      key={type}
                      onClick={() => setFilterType(type)}
                      variant={filterType === type ? 'primary' : 'secondary'}
                      className="px-4 py-2 text-sm"
                    >
                      {type === 'all' ? `🌍 ${t.launches.all}` : type === 'past' ? `📅 ${t.launches.past}` : `🎯 ${t.launches.upcoming}`}
                    </GlowingButton>
                  ))}
                </div>

                <div className="flex gap-2">
                  {(['all', 'success', 'failure'] as const).map(status => (
                    <GlowingButton
                      key={status}
                      onClick={() => setSuccessFilter(status)}
                      variant={successFilter === status ? 'neon' : 'secondary'}
                      className="px-4 py-2 text-sm"
                    >
                      {status === 'all' ? t.launches.any : status === 'success' ? `✅ ${t.launches.success}` : `❌ ${t.launches.failure}`}
                    </GlowingButton>
                  ))}
                </div>

                <GlowingButton
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  variant="secondary"
                  className="px-4 py-2 text-sm"
                >
                  {sortOrder === 'desc' ? '⬇️ Newest' : '⬆️ Oldest'}
                </GlowingButton>
              </div>
            </div>
          </ModernCard>

          {/* Launches Timeline */}
          <div className="space-y-6">
            {filteredLaunches.map((launch) => {
              const launchDate = DateTime.fromISO(launch.date_utc);
              const isUpcoming = launch.upcoming;
              const variant = isUpcoming ? 'neon' : launch.success ? 'gradient' : 'glass';

              return (
                <ModernCard key={launch.id} variant={variant} className="overflow-hidden group">
                  <div className="flex flex-col lg:flex-row gap-6 p-6">
                    {/* Mission Patch */}
                    <div className="flex-shrink-0">
                      {launch.links.patch.small ? (
                        <OptimizedImage
                          src={launch.links.patch.small}
                          alt={`${launch.name} mission patch`}
                          width={120}
                          height={120}
                          className="rounded-lg shadow-2xl group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-[120px] h-[120px] bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-4xl">🚀</span>
                        </div>
                      )}
                    </div>

                    {/* Launch Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                            {launch.name}
                          </h3>
                          <p className="text-gray-400 mt-1">
                            Flight #{launch.flight_number} • {launchDate.toFormat('MMMM dd, yyyy')} at {launchDate.toFormat('HH:mm')} UTC
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {isUpcoming ? (
                            <StatusBadge status="pending" />
                          ) : launch.success === true ? (
                            <StatusBadge status="success" />
                          ) : launch.success === false ? (
                            <StatusBadge status="failure" />
                          ) : (
                            <StatusBadge status="inactive" />
                          )}
                        </div>
                      </div>

                      {launch.details && (
                        <p className="text-gray-300 line-clamp-2 hover:line-clamp-none transition-all">
                          {launch.details}
                        </p>
                      )}

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-xs text-gray-400">Rocket ID</p>
                          <p className="text-sm font-bold text-cyan-400">{launch.rocket.slice(-6)}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-xs text-gray-400">Launchpad</p>
                          <p className="text-sm font-bold text-purple-400">{launch.launchpad.slice(-6)}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-xs text-gray-400">Payloads</p>
                          <p className="text-sm font-bold text-green-400">{launch.payloads.length}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-xs text-gray-400">Time Since</p>
                          <p className="text-sm font-bold text-yellow-400">
                            {isUpcoming ? 'T-' : ''}{Math.abs(launchDate.diffNow('days').days).toFixed(0)} days
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {launch.links.webcast && (
                          <GlowingButton
                            onClick={() => window.open(launch.links.webcast!, '_blank')}
                            variant="primary"
                            className="text-sm px-3 py-1"
                          >
                            📺 Watch
                          </GlowingButton>
                        )}
                        {launch.links.article && (
                          <GlowingButton
                            onClick={() => window.open(launch.links.article!, '_blank')}
                            variant="secondary"
                            className="text-sm px-3 py-1"
                          >
                            📰 Article
                          </GlowingButton>
                        )}
                        {launch.links.wikipedia && (
                          <GlowingButton
                            onClick={() => window.open(launch.links.wikipedia!, '_blank')}
                            variant="secondary"
                            className="text-sm px-3 py-1"
                          >
                            📖 Wiki
                          </GlowingButton>
                        )}
                        {launch.links.reddit.launch && (
                          <GlowingButton
                            onClick={() => window.open(launch.links.reddit.launch!, '_blank')}
                            variant="secondary"
                            className="text-sm px-3 py-1"
                          >
                            💬 Reddit
                          </GlowingButton>
                        )}
                      </div>
                    </div>
                  </div>
                </ModernCard>
              );
            })}
          </div>

          {filteredLaunches.length === 0 && (
            <ModernCard variant="glass" className="text-center py-12">
              <h3 className="text-2xl font-bold text-gray-400 mb-4">No Launches Found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </ModernCard>
          )}
        </div>
      </div>
    </div>
  );
}