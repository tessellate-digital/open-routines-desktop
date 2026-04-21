import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useGlobalSSE } from '../hooks/useSSE';
import { RunsTable } from '../components/RunsTable';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { SectionLabel } from '../components/SectionLabel';
import type { Routine, Run } from '../lib/types';

export default function Dashboard() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [r, ru] = await Promise.all([api.getRoutines(), api.getRuns({ limit: 10 })]);
      setRoutines(r);
      setRuns(ru);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);
  useGlobalSSE(
    useCallback(() => {
      load();
    }, [load])
  );

  if (error) {
    return <p className="text-destructive text-body-sm">Error: {error}</p>;
  }

  const running = runs.filter((r) => r.status === 'running').length;
  const failed = runs.filter((r) => r.status === 'failed').length;
  const success = runs.filter((r) => r.status === 'success').length;

  return (
    <div className="route-fade">
      <PageHeader
        title="Overview"
        subtitle={`${routines.length} routines · ${runs.length} recent runs`}
        actions={
          <Link to="/routines/new" className="btn primary">
            + New Routine
          </Link>
        }
      />

      <div className="grid grid-cols-3 gap-3 mb-[22px]">
        <StatCard label="Routines" value={routines.length} />
        <StatCard label="Running" value={<span className="text-running">{running}</span>} />
        <StatCard
          label="Recent failures"
          value={<span className={failed > 0 ? 'text-destructive' : ''}>{failed}</span>}
          sub={success > 0 ? `${success} success` : undefined}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionLabel className="mb-0">Recent runs</SectionLabel>
          <Link to="/runs" className="font-mono text-xs text-accent no-underline">
            View all →
          </Link>
        </div>
        <RunsTable runs={runs} />
      </div>
    </div>
  );
}
