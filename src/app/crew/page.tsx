'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ModernCard, GlowingButton, AnimatedCounter, StatusBadge, FloatingParticles } from '@/components/ui/ModernCard';
import { OptimizedImage } from '@/components/OptimizedImage';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/translations/translations';

interface CrewMember {
  id: string;
  name: string;
  agency: string;
  image: string;
  wikipedia: string;
  status: 'active' | 'inactive' | 'retired' | 'unknown';
  launches: string[];
}

export default function CrewPage() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [agencyFilter, setAgencyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { currentLanguage } = useLanguageStore();
  const t = getTranslation(currentLanguage);

  useEffect(() => {
    const fetchCrew = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://api.spacexdata.com/v4/crew');
        setCrew(response.data);
      } catch (error) {
        console.error('Failed to fetch crew:', error);
        setError(t.crew.error);
      } finally {
        setLoading(false);
      }
    };

    fetchCrew();
  }, [t.crew.error]);

  const filteredCrew = crew.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.agency.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAgency = agencyFilter === 'all' || member.agency === agencyFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesAgency && matchesStatus;
  });

  const agencyCounts = crew.reduce((acc, member) => {
    acc[member.agency] = (acc[member.agency] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusCounts = crew.reduce((acc, member) => {
    acc[member.status] = (acc[member.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalFlights = crew.reduce((acc, member) => acc + member.launches.length, 0);
  const activeAstronauts = crew.filter(member => member.status === 'active').length;

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
              👨‍🚀 {t.crew.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t.crew.subtitle}
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <ModernCard variant="gradient" hover={false}>
              <div className="text-center">
                <AnimatedCounter value={crew.length} className="text-3xl" />
                <p className="text-gray-300 mt-2">{t.crew.totalCrew}</p>
              </div>
            </ModernCard>
            <ModernCard variant="neon" hover={false}>
              <div className="text-center">
                <AnimatedCounter value={activeAstronauts} className="text-3xl text-green-400" />
                <p className="text-gray-300 mt-2">{t.crew.activeAstronauts}</p>
              </div>
            </ModernCard>
            <ModernCard variant="glass" hover={false}>
              <div className="text-center">
                <AnimatedCounter value={totalFlights} className="text-3xl text-blue-400" />
                <p className="text-gray-300 mt-2">{t.crew.totalFlights}</p>
              </div>
            </ModernCard>
            <ModernCard variant="default" hover={false}>
              <div className="text-center">
                <AnimatedCounter value={Object.keys(agencyCounts).length} className="text-3xl text-purple-400" />
                <p className="text-gray-300 mt-2">{t.crew.spaceAgencies}</p>
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
                    placeholder={t.crew.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-gray-400 font-medium">{t.crew.agency}:</span>
                {['all', ...Object.keys(agencyCounts)].map(agency => (
                  <GlowingButton
                    key={agency}
                    onClick={() => setAgencyFilter(agency)}
                    variant={agencyFilter === agency ? 'primary' : 'secondary'}
                    className="px-3 py-1 text-sm"
                  >
                    {agency === 'all' ? t.crew.all : agency}
                    {agency !== 'all' && agencyCounts[agency] && (
                      <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">
                        {agencyCounts[agency]}
                      </span>
                    )}
                  </GlowingButton>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-gray-400 font-medium">{t.crew.status}:</span>
                {['all', 'active', 'inactive', 'retired'].map(status => (
                  <GlowingButton
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    variant={statusFilter === status ? 'neon' : 'secondary'}
                    className="px-3 py-1 text-sm"
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

          {/* Crew Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCrew.map((member) => (
              <ModernCard key={member.id} variant="gradient" className="overflow-hidden group">
                <div className="relative">
                  {member.image && (
                    <div className="w-full h-64 overflow-hidden rounded-t-2xl">
                      <OptimizedImage
                        src={member.image}
                        alt={`Portrait of ${member.name} - SpaceX Dragon crew member and astronaut`}
                        width={400}
                        height={256}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        quality={90}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-white truncate">{member.name}</h3>
                      <StatusBadge status={
                        member.status === 'active' ? 'active' :
                        member.status === 'inactive' ? 'inactive' :
                        member.status === 'retired' ? 'inactive' :
                        'inactive'
                      } />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{t.crew.agency}:</span>
                        <span className="text-white font-medium">{member.agency}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{t.crew.missions}:</span>
                        <span className="text-purple-400 font-bold">{member.launches.length}</span>
                      </div>

                      <div className="pt-4 flex space-x-2">
                        {member.wikipedia && (
                          <GlowingButton
                            onClick={() => window.open(member.wikipedia, '_blank')}
                            variant="primary"
                            className="flex-1 text-sm py-2"
                          >
                            📖 {t.crew.wikipedia}
                          </GlowingButton>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>

          {filteredCrew.length === 0 && (
            <ModernCard variant="glass" className="text-center py-12">
              <h3 className="text-2xl font-bold text-gray-400 mb-4">{t.crew.noCrewFound}</h3>
              <p className="text-gray-500">{t.crew.adjustFilters}</p>
            </ModernCard>
          )}

          {/* Fun Fact Card */}
          <ModernCard variant="neon" className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">🌟 {t.crew.didYouKnow}</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              {t.crew.funFact}
            </p>
          </ModernCard>
        </div>
      </div>
    </div>
  );
}