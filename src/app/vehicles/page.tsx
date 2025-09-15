'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLanguageStore } from '../../store/languageStore';
import { getTranslation } from '../../translations/translations';

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
}

export default function VehiclesPage() {
  const { currentLanguage } = useLanguageStore();
  const t = getTranslation(currentLanguage);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('https://api.spacexdata.com/v4/rockets');

        if (!response.ok) throw new Error('Failed to fetch vehicles');

        const data = await response.json();
        setVehicles(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : t.common.error);
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl">{t.vehicles.loading}</div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl text-red-500">{t.vehicles.error}: {error}</div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">SpaceX Vehicles</h1>

      <div className="grid gap-8">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="border rounded-lg p-6 shadow-lg">
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-3xl font-semibold">{vehicle.name}</h2>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded text-sm font-medium ${
                    vehicle.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {vehicle.active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="px-3 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800">
                    {vehicle.success_rate_pct}% Success Rate
                  </span>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{vehicle.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-6">
                <div>
                  <strong>Type:</strong> {vehicle.type}
                </div>
                <div>
                  <strong>Stages:</strong> {vehicle.stages}
                </div>
                <div>
                  <strong>First Flight:</strong> {new Date(vehicle.first_flight).getFullYear()}
                </div>
                <div>
                  <strong>Country:</strong> {vehicle.country}
                </div>
                <div>
                  <strong>Height:</strong> {vehicle.height.meters}m ({vehicle.height.feet}ft)
                </div>
                <div>
                  <strong>Diameter:</strong> {vehicle.diameter.meters}m ({vehicle.diameter.feet}ft)
                </div>
                <div>
                  <strong>Mass:</strong> {vehicle.mass.kg.toLocaleString()}kg
                </div>
                <div>
                  <strong>Cost per Launch:</strong> ${vehicle.cost_per_launch.toLocaleString()}
                </div>
              </div>

              {vehicle.payload_weights.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Payload Capacity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {vehicle.payload_weights.map((payload) => (
                      <div key={payload.id} className="bg-gray-50 p-2 rounded">
                        <strong>{payload.name}:</strong> {payload.kg.toLocaleString()}kg ({payload.lb.toLocaleString()}lbs)
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 mb-6">
                {vehicle.wikipedia && (
                  <a
                    href={vehicle.wikipedia}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Wikipedia
                  </a>
                )}
              </div>
            </div>

            {vehicle.flickr_images.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Images ({vehicle.flickr_images.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vehicle.flickr_images.map((image, index) => (
                    <div key={index} className="aspect-video overflow-hidden rounded-lg">
                      <Image
                        src={image}
                        alt={`${vehicle.name} image ${index + 1}`}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}