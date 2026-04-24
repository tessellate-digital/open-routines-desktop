import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import RoutinesList from './pages/RoutinesList';
import RoutineDetail from './pages/RoutineDetail';
import RoutineForm from './pages/RoutineForm';
import RunsList from './pages/RunsList';
import RunDetail from './pages/run-detail/RunDetail';
import RoutineRuns from './pages/RoutineRuns';
import Settings, { SettingsIndex } from './pages/Settings';
import ModelsSettings from './pages/settings/ModelsSettings';
import ConnectedAppsSettings from './pages/settings/ConnectedAppsSettings';
import PreferencesSettings from './pages/settings/PreferencesSettings';
import DevPage from './pages/DevPage';
import { HostMountsProvider } from './contexts/HostMountsContext';
import { PageProvider } from './contexts/PageContext';

export default function App() {
  return (
    <HostMountsProvider>
      <HashRouter>
        <PageProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/routines" element={<RoutinesList />} />
              <Route path="/routines/new" element={<RoutineForm />} />
              <Route path="/routines/:id" element={<RoutineDetail />} />
              <Route path="/routines/:id/edit" element={<RoutineForm />} />
              <Route path="/routines/:id/runs" element={<RoutineRuns />} />
              <Route path="/runs" element={<RunsList />} />
              <Route path="/runs/:id" element={<RunDetail />} />
              <Route path="/settings" element={<Settings />}>
                <Route index element={<SettingsIndex />} />
                <Route path="models" element={<ModelsSettings />} />
                <Route path="connected-apps" element={<ConnectedAppsSettings />} />
                <Route path="preferences" element={<PreferencesSettings />} />
              </Route>
              {import.meta.env.VITE_DEV === 'true' && <Route path="/dev" element={<DevPage />} />}
            </Route>
          </Routes>
        </PageProvider>
      </HashRouter>
    </HostMountsProvider>
  );
}
