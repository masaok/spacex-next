'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ModernCard, GlowingButton, AnimatedCounter, StatusBadge, FloatingParticles } from '@/components/ui/ModernCard';
import { OptimizedImage } from '@/components/OptimizedImage';
import { getTranslation } from '@/translations/translations';
import { SupportedLanguage } from '@/types/language';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  active: boolean;
  stages: number;
  boosters: number;
  cost_per_launch: number;
  success_rate_pct: number;
  first_flight: string;
  country: string;
  company: string;
  wikipedia: string;
  description: string;
  flickr_images: string[];
  height: {
    meters: number;
    feet: number;
  };
  diameter: {
    meters: number;
    feet: number;
  };
  mass: {
    kg: number;
    lb: number;
  };
  payload_weights: Array<{
    id: string;
    name: string;
    kg: number;
    lb: number;
  }>;
  engines: {
    number: number;
    type: string;
    version: string;
    layout: string;
    thrust_sea_level: {
      kN: number;
      lbf: number;
    };
    thrust_vacuum: {
      kN: number;
      lbf: number;
    };
  };
}

export default function VehiclesPage({ params }: { params: Promise<{ lang: SupportedLanguage }> }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [imageIndices, setImageIndices] = useState<Record<string, number>>({});
  const [lang, setLang] = useState<SupportedLanguage>('en');
  const t = getTranslation(lang);

  useEffect(() => {
    params.then(({ lang }) => setLang(lang));
  }, [params]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://api.spacexdata.com/v4/rockets');
        setVehicles(response.data);

        // Initialize image indices for all vehicles
        const indices: Record<string, number> = {};
        response.data.forEach((v: Vehicle) => {
          indices[v.id] = 0;
        });
        setImageIndices(indices);
      } catch (error) {
        console.error('Failed to fetch vehicles:', error);
        setError('Failed to load vehicles data');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const nextImage = (vehicleId: string, totalImages: number) => {
    setImageIndices(prev => ({
      ...prev,
      [vehicleId]: (prev[vehicleId] + 1) % totalImages
    }));
  };

  const prevImage = (vehicleId: string, totalImages: number) => {
    setImageIndices(prev => ({
      ...prev,
      [vehicleId]: prev[vehicleId] === 0 ? totalImages - 1 : prev[vehicleId] - 1
    }));
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

  const totalPayloadCapacity = vehicles.reduce((acc, v) =>
    acc + (v.payload_weights?.[0]?.kg || 0), 0
  );
  const activeVehicles = vehicles.filter(v => v.active).length;
  const averageSuccessRate = vehicles.reduce((acc, v) => acc + v.success_rate_pct, 0) / vehicles.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="relative">
        <FloatingParticles />

        <div className="container mx-auto px-4 relative z-10">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              🚀 {t.vehicles.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t.vehicles.subtitle}
            </p>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <ModernCard variant="gradient" hover={false}>
              <div className="text-center">
                <AnimatedCounter value={vehicles.length} className="text-3xl" />
                <p className="text-gray-300 mt-2">{t.vehicles.totalVehicles}</p>
              </div>
            </ModernCard>
            <ModernCard variant="neon" hover={false}>
              <div className="text-center">
                <AnimatedCounter value={activeVehicles} className="text-3xl text-green-400" />
                <p className="text-gray-300 mt-2">{t.vehicles.activeRockets}</p>
              </div>
            </ModernCard>
            <ModernCard variant="glass" hover={false}>
              <div className="text-center">
                <AnimatedCounter value={Math.round(averageSuccessRate)} suffix="%" className="text-3xl text-purple-400" />
                <p className="text-gray-300 mt-2">{t.vehicles.avgSuccessRate}</p>
              </div>
            </ModernCard>
            <ModernCard variant="default" hover={false}>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  {Math.round(totalPayloadCapacity / 1000)}t
                </div>
                <p className="text-gray-300 mt-2">{t.vehicles.totalPayload}</p>
              </div>
            </ModernCard>
          </div>

          {/* Vehicle Cards */}
          <div className="space-y-12">
            {vehicles.map((vehicle) => {
              const isExpanded = selectedVehicle === vehicle.id;
              const currentImageIndex = imageIndices[vehicle.id] || 0;

              return (
                <ModernCard
                  key={vehicle.id}
                  variant={vehicle.active ? 'gradient' : 'glass'}
                  className="overflow-hidden"
                >
                  {/* Image Carousel */}
                  {vehicle.flickr_images.length > 0 && (
                    <div className="relative h-96 lg:h-[500px] overflow-hidden rounded-t-2xl">
                      <OptimizedImage
                        src={vehicle.flickr_images[currentImageIndex]}
                        alt={`${vehicle.name} rocket - Image ${currentImageIndex + 1}`}
                        width={1200}
                        height={500}
                        className="w-full h-full object-cover"
                        priority={currentImageIndex === 0}
                      />

                      {vehicle.flickr_images.length > 1 && (
                        <>
                          <button
                            onClick={() => prevImage(vehicle.id, vehicle.flickr_images.length)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                          >
                            ⬅️
                          </button>
                          <button
                            onClick={() => nextImage(vehicle.id, vehicle.flickr_images.length)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                          >
                            ➡️
                          </button>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {vehicle.flickr_images.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => setImageIndices(prev => ({ ...prev, [vehicle.id]: idx }))}
                                className={`w-2 h-2 rounded-full transition-all ${
                                  idx === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <div className="p-8">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
                      <div>
                        <h2 className="text-4xl font-bold text-white mb-2">
                          {vehicle.name}
                        </h2>
                        <p className="text-gray-400 text-lg">{vehicle.type} • {t.vehicles.firstFlight}: {new Date(vehicle.first_flight).getFullYear()}</p>
                      </div>
                      <div className="flex gap-3 mt-4 lg:mt-0">
                        <StatusBadge status={vehicle.active ? 'active' : 'inactive'} />
                        <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full">
                          <span className="text-green-400 font-bold">{vehicle.success_rate_pct}% {t.vehicles.success}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-lg leading-relaxed mb-8">
                      {(t.vehicles.descriptions as Record<string, string>)?.[vehicle.id] || vehicle.description}
                    </p>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-xs text-gray-400 mb-1">{t.vehicles.height}</p>
                        <p className="text-xl font-bold text-cyan-400">{vehicle.height.meters}m</p>
                        <p className="text-xs text-gray-500">{vehicle.height.feet}ft</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-xs text-gray-400 mb-1">{t.vehicles.diameter}</p>
                        <p className="text-xl font-bold text-purple-400">{vehicle.diameter.meters}m</p>
                        <p className="text-xs text-gray-500">{vehicle.diameter.feet}ft</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-xs text-gray-400 mb-1">{t.vehicles.mass}</p>
                        <p className="text-xl font-bold text-green-400">{(vehicle.mass.kg / 1000).toFixed(0)}t</p>
                        <p className="text-xs text-gray-500">{vehicle.mass.kg.toLocaleString()}kg</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-xs text-gray-400 mb-1">{t.vehicles.costPerLaunch}</p>
                        <p className="text-xl font-bold text-yellow-400">
                          ${(vehicle.cost_per_launch / 1000000).toFixed(0)}M
                        </p>
                        <p className="text-xs text-gray-500">${vehicle.cost_per_launch.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Engine Info */}
                    {vehicle.engines && (
                      <ModernCard variant="glass" className="mb-8">
                        <h3 className="text-xl font-bold text-white mb-4">🔥 {t.vehicles.engineConfiguration}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-gray-400 text-sm">{t.vehicles.type}</p>
                            <p className="text-white font-bold">{vehicle.engines.type}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">{t.vehicles.count}</p>
                            <p className="text-cyan-400 font-bold text-xl">{vehicle.engines.number}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">{t.vehicles.seaLevelThrust}</p>
                            <p className="text-orange-400 font-bold">{vehicle.engines.thrust_sea_level.kN} kN</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">{t.vehicles.vacuumThrust}</p>
                            <p className="text-red-400 font-bold">{vehicle.engines.thrust_vacuum.kN} kN</p>
                          </div>
                        </div>
                      </ModernCard>
                    )}

                    {/* Payload Capacities */}
                    {vehicle.payload_weights.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-white mb-4">📦 {t.vehicles.payloadCapacity}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {vehicle.payload_weights.map((payload) => (
                            <div key={payload.id} className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-3">
                              <p className="text-gray-400 text-sm">{payload.name}</p>
                              <p className="text-blue-400 font-bold text-lg">
                                {(payload.kg / 1000).toFixed(1)}t
                              </p>
                              <p className="text-gray-500 text-xs">{payload.kg.toLocaleString()}kg</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <GlowingButton
                        onClick={() => setSelectedVehicle(isExpanded ? null : vehicle.id)}
                        variant="primary"
                      >
                        {isExpanded ? `➖ ${t.vehicles.showLess}` : `➕ ${t.vehicles.technicalDetails}`}
                      </GlowingButton>
                      {vehicle.wikipedia && (
                        <GlowingButton
                          onClick={() => window.open(vehicle.wikipedia, '_blank')}
                          variant="secondary"
                        >
                          📖 {t.vehicles.wikipedia}
                        </GlowingButton>
                      )}
                    </div>

                    {/* Expanded Technical Details */}
                    {isExpanded && (
                      <ModernCard variant="glass" className="mt-8">
                        <h3 className="text-2xl font-bold text-white mb-6">📊 {t.vehicles.technicalSpecifications}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-lg font-bold text-purple-400 mb-3">{t.vehicles.structure}</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">{t.vehicles.stages}:</span>
                                <span className="text-white font-medium">{vehicle.stages}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">{t.vehicles.boosters}:</span>
                                <span className="text-white font-medium">{vehicle.boosters || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">{t.vehicles.country}:</span>
                                <span className="text-white font-medium">{vehicle.country}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">{t.vehicles.company}:</span>
                                <span className="text-white font-medium">{vehicle.company}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-cyan-400 mb-3">{t.vehicles.performance}</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">{t.vehicles.successRate}:</span>
                                <span className="text-green-400 font-bold">{vehicle.success_rate_pct}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">{t.vehicles.status}:</span>
                                <span className={`font-medium ${vehicle.active ? 'text-green-400' : 'text-gray-400'}`}>
                                  {vehicle.active ? `✅ ${t.vehicles.active}` : `⏸️ ${t.vehicles.retired}`}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">{t.vehicles.firstFlight}:</span>
                                <span className="text-white font-medium">
                                  {new Date(vehicle.first_flight).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </ModernCard>
                    )}
                  </div>
                </ModernCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}