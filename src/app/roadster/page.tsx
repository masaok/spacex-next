'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ModernCard, GlowingButton, AnimatedCounter, FloatingParticles } from '@/components/ui/ModernCard';
import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/translations/translations';

interface Roadster {
  name: string;
  launch_date_utc: string;
  launch_date_unix: number;
  launch_mass_kg: number;
  launch_mass_lbs: number;
  norad_id: number;
  epoch_jd: number;
  orbit_type: string;
  apoapsis_au: number;
  periapsis_au: number;
  semi_major_axis_au: number;
  eccentricity: number;
  inclination: number;
  longitude: number;
  periapsis_arg: number;
  period_days: number;
  speed_kph: number;
  speed_mph: number;
  earth_distance_km: number;
  earth_distance_mi: number;
  mars_distance_km: number;
  mars_distance_mi: number;
  flickr_images: string[];
  wikipedia: string;
  video: string;
  details: string;
}

export default function RoadsterPage() {
  const [roadster, setRoadster] = useState<Roadster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { currentLanguage } = useLanguageStore();
  const t = getTranslation(currentLanguage);

  useEffect(() => {
    const fetchRoadster = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://api.spacexdata.com/v4/roadster');
        setRoadster(response.data);
      } catch (error) {
        console.error('Failed to fetch roadster:', error);
        setError('Failed to load roadster data');
      } finally {
        setLoading(false);
      }
    };

    fetchRoadster();
  }, []);

  useEffect(() => {
    if (roadster?.flickr_images?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % roadster.flickr_images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [roadster?.flickr_images]);

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

  if (error || !roadster) {
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

  const daysSinceLaunch = Math.floor((Date.now() - roadster.launch_date_unix * 1000) / (1000 * 60 * 60 * 24));
  const formatLargeNumber = (num: number) => new Intl.NumberFormat('en-US').format(Math.round(num));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 overflow-hidden">
      <div className="relative">
        <FloatingParticles />

        <div className="container mx-auto px-4 relative z-10">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent mb-4">
              🚗 {roadster.name}
            </h1>
            <p className="text-2xl text-gray-300 mb-6">
              Starman's Epic Journey Through Space
            </p>
            <ModernCard variant="neon" className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-300 leading-relaxed">
                {roadster.details}
              </p>
            </ModernCard>
          </div>

          {/* Hero Image */}
          {roadster.flickr_images && roadster.flickr_images.length > 0 && (
            <ModernCard variant="glass" className="mb-12 overflow-hidden">
              <div className="relative h-96 lg:h-[500px]">
                <img
                  src={roadster.flickr_images[currentImageIndex]}
                  alt={`Tesla Roadster in space - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                {roadster.flickr_images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {roadster.flickr_images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </ModernCard>
          )}

          {/* Live Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <ModernCard variant="gradient" hover={false} className="text-center">
              <AnimatedCounter value={daysSinceLaunch} className="text-3xl text-yellow-400" />
              <p className="text-gray-300 mt-2">Days in Space</p>
            </ModernCard>
            <ModernCard variant="neon" hover={false} className="text-center">
              <div className="text-3xl font-bold text-cyan-400">
                {formatLargeNumber(roadster.speed_kph)} km/h
              </div>
              <p className="text-gray-300 mt-2">Current Speed</p>
            </ModernCard>
            <ModernCard variant="glass" hover={false} className="text-center">
              <div className="text-3xl font-bold text-blue-400">
                {formatLargeNumber(roadster.earth_distance_km)} km
              </div>
              <p className="text-gray-300 mt-2">Distance from Earth</p>
            </ModernCard>
            <ModernCard variant="default" hover={false} className="text-center">
              <div className="text-3xl font-bold text-red-400">
                {formatLargeNumber(roadster.mars_distance_km)} km
              </div>
              <p className="text-gray-300 mt-2">Distance from Mars</p>
            </ModernCard>
          </div>

          {/* Orbital Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <ModernCard variant="gradient">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                🛰️ Orbital Mechanics
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Orbit Type:</span>
                  <span className="text-white font-medium">{roadster.orbit_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Apoapsis:</span>
                  <span className="text-purple-400 font-bold">{roadster.apoapsis_au.toFixed(3)} AU</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Periapsis:</span>
                  <span className="text-blue-400 font-bold">{roadster.periapsis_au.toFixed(3)} AU</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Orbital Period:</span>
                  <span className="text-green-400 font-bold">{roadster.period_days.toFixed(1)} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Eccentricity:</span>
                  <span className="text-yellow-400 font-bold">{roadster.eccentricity.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Inclination:</span>
                  <span className="text-orange-400 font-bold">{roadster.inclination.toFixed(2)}°</span>
                </div>
              </div>
            </ModernCard>

            <ModernCard variant="glass">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                🚀 Launch Information
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Launch Date:</span>
                  <span className="text-white font-medium">
                    {new Date(roadster.launch_date_utc).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Launch Mass:</span>
                  <span className="text-purple-400 font-bold">
                    {formatLargeNumber(roadster.launch_mass_kg)} kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">NORAD ID:</span>
                  <span className="text-cyan-400 font-bold">{roadster.norad_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Semi-Major Axis:</span>
                  <span className="text-green-400 font-bold">{roadster.semi_major_axis_au.toFixed(3)} AU</span>
                </div>
              </div>
            </ModernCard>
          </div>

          {/* Fun Facts */}
          <ModernCard variant="neon" className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              🌟 Mind-Blowing Facts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                <div className="text-4xl mb-2">🎵</div>
                <h3 className="text-lg font-bold text-cyan-400 mb-2">Space Oddity</h3>
                <p className="text-gray-300 text-sm">
                  The roadster plays "Space Oddity" by David Bowie on loop
                </p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                <div className="text-4xl mb-2">👨‍🚀</div>
                <h3 className="text-lg font-bold text-purple-400 mb-2">Starman</h3>
                <p className="text-gray-300 text-sm">
                  A mannequin in a SpaceX suit sits in the driver's seat
                </p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                <div className="text-4xl mb-2">📚</div>
                <h3 className="text-lg font-bold text-green-400 mb-2">Hitchhiker's Guide</h3>
                <p className="text-gray-300 text-sm">
                  "DON'T PANIC!" is displayed on the dashboard screen
                </p>
              </div>
            </div>
          </ModernCard>

          {/* Links */}
          <ModernCard variant="gradient" className="text-center">
            <h2 className="text-3xl font-bold text-white mb-8">
              🔗 Learn More
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <GlowingButton
                onClick={() => window.open(roadster.wikipedia, '_blank')}
                variant="primary"
              >
                📖 Wikipedia
              </GlowingButton>
              <GlowingButton
                onClick={() => window.open(roadster.video, '_blank')}
                variant="neon"
              >
                📹 Launch Video
              </GlowingButton>
              <GlowingButton
                onClick={() => window.open('https://www.whereisroadster.com/', '_blank')}
                variant="secondary"
              >
                🗺️ Live Tracker
              </GlowingButton>
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  );
}