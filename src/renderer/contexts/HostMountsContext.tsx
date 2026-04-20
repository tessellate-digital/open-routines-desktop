import { createContext, useContext, type ReactNode } from 'react';

interface HostMountsContextValue {
  resolveHostPath: (containerPath: string) => string;
  resolveHostName: (containerPath: string) => string;
}

// In desktop mode, paths are already host paths — no translation needed.
const HostMountsContext = createContext<HostMountsContextValue>({
  resolveHostPath: (p) => p,
  resolveHostName: (p) => p.split('/').pop() ?? p,
});

export function HostMountsProvider({ children }: { children: ReactNode }) {
  return (
    <HostMountsContext.Provider
      value={{
        resolveHostPath: (p) => p,
        resolveHostName: (p) => p.split('/').pop() ?? p,
      }}
    >
      {children}
    </HostMountsContext.Provider>
  );
}

export function useHostMounts() {
  return useContext(HostMountsContext);
}
