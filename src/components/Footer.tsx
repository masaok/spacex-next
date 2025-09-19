'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Footer() {
  const [version, setVersion] = useState('');
  const [deploymentId, setDeploymentId] = useState('');

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await axios.get('/api/version');
        setVersion(response.data.version);
        setDeploymentId(response.data.deploymentId);
      } catch (error) {
        console.error('Failed to fetch version:', error);
      }
    };
    fetchVersion();
  }, []);

  return (
    <footer className="bg-black/90 backdrop-blur-md border-t border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-gray-400 text-sm">
          SpaceLaunchDB.com is an independent entity and is not affiliated with, endorsed by, or associated with SpaceX.
        </p>
        {(version || deploymentId) && (
          <p className="text-center text-gray-500 text-xs mt-2">
            {version && <span>{version}</span>}
            {version && deploymentId && <span> · </span>}
            {deploymentId && <span>{deploymentId}</span>}
          </p>
        )}
      </div>
    </footer>
  );
}