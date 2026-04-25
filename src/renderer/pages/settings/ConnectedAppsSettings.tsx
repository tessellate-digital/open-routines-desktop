import { useEffect, useState, useRef } from 'react';
import { api } from '../../lib/api';

function GmailIntegration() {
  const [phase, setPhase] = useState<'loading' | 'idle' | 'authorizing' | 'connected'>('loading');
  const [connectedEmail, setConnectedEmail] = useState<string | null>(null);
  const [error, setError] = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  useEffect(() => () => stopPolling(), []);

  useEffect(() => {
    api
      .gmailStatus()
      .then((res) => {
        if (res.connected) {
          setPhase('connected');
          setConnectedEmail(res.email || null);
        } else {
          setPhase('idle');
        }
      })
      .catch(() => setPhase('idle'));
  }, []);

  const handleConnect = async () => {
    setError('');
    try {
      const { url } = await api.gmailAuthorize();
      window.electronAPI?.openExternal(url);
      setPhase('authorizing');

      pollRef.current = setInterval(async () => {
        try {
          const status = await api.gmailStatus();
          if (status.connected) {
            stopPolling();
            setPhase('connected');
            setConnectedEmail(status.email || null);
          }
        } catch {
          /* keep polling */
        }
      }, 2000);

      setTimeout(stopPolling, 5 * 60 * 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start authorization');
      setPhase('idle');
    }
  };

  const handleDisconnect = async () => {
    if (!(await window.electronAPI?.confirm('Disconnect Gmail?'))) {
      return;
    }
    try {
      await api.gmailDisconnect();
      setPhase('idle');
      setConnectedEmail(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect');
    }
  };

  if (phase === 'loading') {
    return null;
  }

  if (phase === 'connected') {
    return (
      <div className="border border-border rounded-md bg-surface-hi overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex-1">
            <div className="font-semibold text-label">Gmail</div>
            <div className="font-mono text-code text-fg-dim mt-[2px]">
              {connectedEmail || 'Connected'}
            </div>
          </div>
          <span className="status success">
            <span className="dot" />
            Connected
          </span>
          <button onClick={handleDisconnect} className="btn sm delete-rt">
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-md bg-surface-hi p-4">
      <div className="mb-4">
        <div>
          <p className="font-semibold text-label">Gmail</p>
          <p className="text-caption text-muted-foreground mt-[2px]">
            Connect your Gmail account to let routines read your emails.
          </p>
        </div>
      </div>

      {phase === 'authorizing' ? (
        <div>
          <div className="flex items-center gap-2 text-body-sm text-muted-foreground mb-3">
            <span className="inline-block w-3 h-3 rounded-full border-2 border-accent border-t-transparent animate-[pulse_1s_linear_infinite]" />
            Waiting for authorization in your browser...
          </div>
          <button
            onClick={() => {
              stopPolling();
              setPhase('idle');
            }}
            className="btn"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div>
          {error && <p className="text-body-sm text-destructive mb-3">{error}</p>}
          <button onClick={handleConnect} className="btn primary">
            Connect Gmail
          </button>
        </div>
      )}
    </div>
  );
}

function NotionIntegration() {
  const [phase, setPhase] = useState<'loading' | 'idle' | 'authorizing' | 'connected'>('loading');
  const [error, setError] = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  useEffect(() => () => stopPolling(), []);

  useEffect(() => {
    api
      .notionStatus()
      .then((res) => {
        if (res.status === 'connected') {
          setPhase('connected');
        } else {
          setPhase('idle');
        }
      })
      .catch(() => setPhase('idle'));
  }, []);

  const handleConnect = async () => {
    setError('');
    try {
      await api.notionAuthenticate();
      setPhase('authorizing');

      pollRef.current = setInterval(async () => {
        try {
          const status = await api.notionStatus();
          if (status.status === 'connected') {
            stopPolling();
            setPhase('connected');
          }
        } catch {
          /* keep polling */
        }
      }, 2000);

      setTimeout(stopPolling, 5 * 60 * 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start authorization');
      setPhase('idle');
    }
  };

  const handleDisconnect = async () => {
    if (!(await window.electronAPI?.confirm('Disconnect Notion?'))) {
      return;
    }
    try {
      await api.notionDisconnect();
      setPhase('idle');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect');
    }
  };

  if (phase === 'loading') {
    return null;
  }

  if (phase === 'connected') {
    return (
      <div className="border border-border rounded-md bg-surface-hi overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex-1">
            <div className="font-semibold text-label">Notion</div>
            <div className="font-mono text-code text-fg-dim mt-[2px]">Connected</div>
          </div>
          <span className="status success">
            <span className="dot" />
            Connected
          </span>
          <button onClick={handleDisconnect} className="btn sm delete-rt">
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-md bg-surface-hi p-4">
      <div className="mb-4">
        <div>
          <p className="font-semibold text-label">Notion</p>
          <p className="text-caption text-muted-foreground mt-[2px]">
            Connect your Notion workspace to let routines read and write pages.
          </p>
        </div>
      </div>

      {phase === 'authorizing' ? (
        <div>
          <div className="flex items-center gap-2 text-body-sm text-muted-foreground mb-3">
            <span className="inline-block w-3 h-3 rounded-full border-2 border-accent border-t-transparent animate-[pulse_1s_linear_infinite]" />
            Waiting for authorization in your browser...
          </div>
          <button
            onClick={() => {
              stopPolling();
              setPhase('idle');
            }}
            className="btn"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div>
          {error && <p className="text-body-sm text-destructive mb-3">{error}</p>}
          <button onClick={handleConnect} className="btn primary">
            Connect Notion
          </button>
        </div>
      )}
    </div>
  );
}

export default function ConnectedAppsSettings() {
  return (
    <>
      <div className="mb-4">
        <div className="hint">Connect external services to enhance your routines.</div>
      </div>
      <div className="grid gap-2">
        <GmailIntegration />
        <NotionIntegration />
      </div>
    </>
  );
}
