import { useState, useEffect } from 'react';
import { ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';

type UpdateState = 'idle' | 'available' | 'downloading' | 'ready';

export function UpdateBanner() {
  const [state, setState] = useState<UpdateState>('idle');
  const [version, setVersion] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const api = window.electronAPI;
    if (!api) {
      return;
    }

    api.onUpdateAvailable((info) => {
      setVersion(info.version);
      setState('available');
    });

    api.onUpdateDownloadProgress((p) => {
      setProgress(Math.round(p.percent));
    });

    api.onUpdateDownloaded(() => {
      setState('ready');
    });
  }, []);

  if (state === 'idle' || dismissed) {
    return null;
  }

  const handleDownload = async () => {
    setState('downloading');
    await window.electronAPI?.downloadUpdate();
  };

  const handleInstall = () => {
    window.electronAPI?.installUpdate();
  };

  return (
    <div className="bg-indigo-600 text-white pr-4 py-2 pl-24 flex items-center justify-between text-sm app-drag">
      <div className="flex items-center gap-3">
        <ArrowDownTrayIcon className="w-4 h-4" />
        {state === 'available' && <span>Version {version} is available</span>}
        {state === 'downloading' && <span>Downloading update... {progress}%</span>}
        {state === 'ready' && <span>Update ready to install</span>}
      </div>
      <div className="flex items-center gap-2">
        {state === 'available' && (
          <button
            onClick={handleDownload}
            className="bg-white text-indigo-600 px-3 py-1 rounded font-medium hover:bg-indigo-50 transition-colors"
          >
            Download
          </button>
        )}
        {state === 'ready' && (
          <button
            onClick={handleInstall}
            className="bg-white text-indigo-600 px-3 py-1 rounded font-medium hover:bg-indigo-50 transition-colors"
          >
            Restart & Install
          </button>
        )}
        {state !== 'downloading' && (
          <button onClick={() => setDismissed(true)} className="p-1 hover:bg-indigo-500 rounded">
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
