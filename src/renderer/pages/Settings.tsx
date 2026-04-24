import { NavLink, Outlet, Navigate } from 'react-router-dom';
import classNames from 'classnames';
import { PageHeader } from '../components/PageHeader';

const TABS = [
  { to: '/settings/models', label: 'Models' },
  { to: '/settings/connected-apps', label: 'Connected Apps' },
  { to: '/settings/preferences', label: 'Preferences' },
] as const;

export default function Settings() {
  return (
    <div className="route-fade max-w-[820px]">
      <PageHeader title="Settings" />

      <nav className="flex gap-1 mb-6 border-b border-border">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              classNames(
                'px-4 py-2 text-body-sm font-medium no-underline transition-colors duration-default -mb-px border-b-2',
                isActive
                  ? 'border-accent text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  );
}

export function SettingsIndex() {
  return <Navigate to="/settings/models" replace />;
}
