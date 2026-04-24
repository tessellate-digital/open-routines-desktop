import { useState } from 'react';
import classNames from 'classnames';
import { api } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import { SectionLabel } from '../../components/SectionLabel';

function ThemeToggle({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between py-[10px]">
      <span className="text-body-sm font-medium">{label}</span>
      <div className="pills gap-1">
        {options.map((o) => (
          <button
            key={o.id}
            className={classNames('pill text-xs py-1 px-3', { active: value === o.id })}
            onClick={() => onChange(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PreferencesSettings() {
  const navigate = useNavigate();
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  const [theme, setThemeState] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'gradient'
  );
  const [density, setDensityState] = useState(
    () => document.documentElement.getAttribute('data-density') || 'comfy'
  );
  const [statusStyle, setStatusStyleState] = useState(
    () => document.documentElement.getAttribute('data-status-style') || 'dot'
  );

  const applyAttr = (attr: string, value: string, storageKey: string) => {
    document.documentElement.setAttribute(attr, value);
    localStorage.setItem(storageKey, value);
  };

  const setTheme = (v: string) => {
    setThemeState(v);
    applyAttr('data-theme', v, 'oc-theme');
  };
  const setDensity = (v: string) => {
    setDensityState(v);
    applyAttr('data-density', v, 'oc-density');
  };
  const setStatusStyle = (v: string) => {
    setStatusStyleState(v);
    applyAttr('data-status-style', v, 'oc-status-style');
  };

  const handleReset = async () => {
    setResetting(true);
    try {
      await api.resetData();
      navigate('/');
    } finally {
      setResetting(false);
      setConfirmReset(false);
    }
  };

  return (
    <>
      {/* Appearance */}
      <div className="mb-9">
        <div className="mb-4">
          <div className="text-section font-semibold mb-[3px]">Appearance</div>
          <div className="hint">Customise the look and feel of the interface.</div>
        </div>
        <div className="card py-2 px-5">
          <ThemeToggle
            label="Theme"
            options={[
              { id: 'gradient', label: 'Gradient' },
              { id: 'light', label: 'Light' },
              { id: 'dark', label: 'Dark' },
            ]}
            value={theme}
            onChange={setTheme}
          />
          <div className="divider" />
          <ThemeToggle
            label="Density"
            options={[
              { id: 'comfy', label: 'Comfy' },
              { id: 'compact', label: 'Compact' },
            ]}
            value={density}
            onChange={setDensity}
          />
          <div className="divider" />
          <ThemeToggle
            label="Status style"
            options={[
              { id: 'dot', label: 'Dot' },
              { id: 'pill', label: 'Pill' },
            ]}
            value={statusStyle}
            onChange={setStatusStyle}
          />
        </div>
      </div>

      {/* Reset data */}
      <div className="mb-2">
        <SectionLabel className="mb-4">Danger zone</SectionLabel>
      </div>
      <div>
        <div className="mb-4">
          <div className="text-section font-semibold mb-[3px]">Reset data</div>
          <div className="hint">
            Permanently delete all routines, runs and settings. The app will quit.
          </div>
        </div>
        <div className="card py-4 px-5">
          {!confirmReset ? (
            <button onClick={() => setConfirmReset(true)} className="btn delete-rt">
              Reset all data…
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-body-sm text-destructive">This cannot be undone.</span>
              <button onClick={handleReset} disabled={resetting} className="btn delete-rt">
                {resetting ? 'Deleting…' : 'Confirm reset'}
              </button>
              <button onClick={() => setConfirmReset(false)} className="btn">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
