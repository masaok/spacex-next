'use client';

import { useQuery, gql } from '@apollo/client';

const LAUNCHES_QUERY = gql`
  query GetLaunches($limit: Int!) {
    launches(limit: $limit, sort: "launch_date_utc", order: "desc") {
      id
      mission_name
      launch_date_utc
      launch_success
      details
      links {
        video_link
        article_link
        wikipedia
      }
      rocket {
        rocket_name
        rocket_type
      }
      launch_site {
        site_name_long
      }
    }
  }
`;

interface Launch {
  id: string;
  mission_name: string;
  launch_date_utc: string;
  launch_success: boolean | null;
  details: string | null;
  links: {
    video_link: string | null;
    article_link: string | null;
    wikipedia: string | null;
  };
  rocket: {
    rocket_name: string;
    rocket_type: string;
  };
  launch_site: {
    site_name_long: string;
  };
}

export default function LaunchesPage() {
  const { loading, error, data } = useQuery<{ launches: Launch[] }>(LAUNCHES_QUERY, {
    variables: { limit: 20 },
  });

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl">Loading launches...</div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl text-red-500">Error: {error.message}</div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">SpaceX Latest Launches</h1>

      <div className="grid gap-6">
        {data?.launches.map((launch) => (
          <div key={launch.id} className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold">{launch.mission_name}</h2>
              <span className={`px-3 py-1 rounded text-sm font-medium ${
                launch.launch_success === true
                  ? 'bg-green-100 text-green-800'
                  : launch.launch_success === false
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {launch.launch_success === true ? 'Success' : launch.launch_success === false ? 'Failed' : 'Unknown'}
              </span>
            </div>

            <div className="space-y-2 text-gray-600">
              <p><strong>Date:</strong> {new Date(launch.launch_date_utc).toLocaleString()}</p>
              <p><strong>Rocket:</strong> {launch.rocket.rocket_name} ({launch.rocket.rocket_type})</p>
              <p><strong>Launch Site:</strong> {launch.launch_site.site_name_long}</p>

              {launch.details && (
                <p className="mt-3 text-gray-700">{launch.details}</p>
              )}

              <div className="flex gap-4 mt-4">
                {launch.links.video_link && (
                  <a
                    href={launch.links.video_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Watch Video
                  </a>
                )}
                {launch.links.article_link && (
                  <a
                    href={launch.links.article_link}
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
        ))}
      </div>
    </div>
  );
}