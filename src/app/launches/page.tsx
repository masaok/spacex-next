'use client';

import { useEffect, useState } from 'react';
import { useLanguageStore } from '../../store/languageStore';
import { getTranslation } from '../../translations/translations';
import { LaunchPatchImage } from '../../components/OptimizedImage';
import { Breadcrumbs } from '../../components/Breadcrumbs';

interface Launch {
  id: string;
  name: string;
  date_utc: string;
  success: boolean | null;
  details: string | null;
  links: {
    webcast: string | null;
    article: string | null;
    wikipedia: string | null;
    patch: {
      small: string | null;
      large: string | null;
    };
  };
  rocket: string | RocketInfo;
  launchpad: string | LaunchpadInfo;
}

interface RocketInfo {
  id: string;
  name: string;
  type: string;
}

interface LaunchpadInfo {
  id: string;
  name: string;
  full_name: string;
}

export default function LaunchesPage() {
  const { currentLanguage } = useLanguageStore();
  const t = getTranslation(currentLanguage);
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [rockets, setRockets] = useState<Record<string, RocketInfo>>({});
  const [launchpads, setLaunchpads] = useState<Record<string, LaunchpadInfo>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch launches with sorting
        const launchesResponse = await fetch('https://api.spacexdata.com/v5/launches/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            options: {
              limit: 50,
              sort: { date_utc: 'desc' },
              populate: [
                { path: 'rocket', select: { name: 1, type: 1 } },
                { path: 'launchpad', select: { name: 1, full_name: 1 } }
              ]
            }
          })
        });

        if (!launchesResponse.ok) throw new Error('Failed to fetch launches');
        const launchesData = await launchesResponse.json();

        setLaunches(launchesData.docs);

        // Extract rocket and launchpad info from populated data
        const rocketsMap: Record<string, RocketInfo> = {};
        const launchpadsMap: Record<string, LaunchpadInfo> = {};

        launchesData.docs.forEach((launch: Launch) => {
          if (launch.rocket && typeof launch.rocket === 'object') {
            rocketsMap[launch.rocket.id] = launch.rocket;
          }
          if (launch.launchpad && typeof launch.launchpad === 'object') {
            launchpadsMap[launch.launchpad.id] = launch.launchpad;
          }
        });

        setRockets(rocketsMap);
        setLaunchpads(launchpadsMap);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : t.common.error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl">{t.launches.loading}</div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl text-red-500">{t.launches.error}: {error}</div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: t.launches.title }]} />

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.launches.title}</h1>
        <p className="text-xl text-gray-400">{t.launches.subtitle}</p>
      </div>

      <div className="grid gap-6">
        {launches.map((launch) => {
          const rocket = typeof launch.rocket === 'object'
            ? launch.rocket as unknown as RocketInfo
            : rockets[launch.rocket];
          const launchpad = typeof launch.launchpad === 'object'
            ? launch.launchpad as unknown as LaunchpadInfo
            : launchpads[launch.launchpad];

          return (
            <div key={launch.id} className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  {launch.links.patch.small && (
                    <LaunchPatchImage
                      src={launch.links.patch.small}
                      launchName={launch.name}
                    />
                  )}
                  <h2 className="text-2xl font-semibold">{launch.name}</h2>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  launch.success === true
                    ? 'bg-green-100 text-green-800'
                    : launch.success === false
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {launch.success === true ? 'Success' : launch.success === false ? 'Failed' : 'TBD'}
                </span>
              </div>

              <div className="space-y-2 text-gray-600">
                <p><strong>Date:</strong> {new Date(launch.date_utc).toLocaleString()}</p>
                {rocket && (
                  <p><strong>Rocket:</strong> {rocket.name}</p>
                )}
                {launchpad && (
                  <p><strong>Launch Site:</strong> {launchpad.full_name || launchpad.name}</p>
                )}

                {launch.details && (
                  <p className="mt-3 text-gray-700">{launch.details}</p>
                )}

                <div className="flex gap-4 mt-4">
                  {launch.links.webcast && (
                    <a
                      href={launch.links.webcast}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Watch Video
                    </a>
                  )}
                  {launch.links.article && (
                    <a
                      href={launch.links.article}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Read Article
                    </a>
                  )}
                  {launch.links.wikipedia && (
                    <a
                      href={launch.links.wikipedia}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Wikipedia
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}