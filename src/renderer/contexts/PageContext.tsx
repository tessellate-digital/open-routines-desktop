import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface PageContextValue {
  pageTitle: string | null;
  setPageTitle: (title: string | null) => void;
}

const PageContext = createContext<PageContextValue>({
  pageTitle: null,
  setPageTitle: () => {},
});

export function PageProvider({ children }: { children: ReactNode }) {
  const [pageTitle, setPageTitle] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    setPageTitle(null);
  }, [location.pathname]);

  return (
    <PageContext.Provider value={{ pageTitle, setPageTitle }}>
      {children}
    </PageContext.Provider>
  );
}

export function usePageContext() {
  return useContext(PageContext);
}
