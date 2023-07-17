import { ReactNode, createContext, useContext, useState } from "react";
import { QueryCache, QueryContextValue } from "../interface/queryClient";

export const QueryContext = createContext<QueryContextValue | null>(null);

interface QueryClientProviderProps {
  children: ReactNode;
}

export const QueryClientProvider = ({ children }: QueryClientProviderProps) => {
  const [queryCache] = useState<QueryCache>(new Map());

  return (
    <QueryContext.Provider value={{ queryCache }}>
      {children}
    </QueryContext.Provider>
  );
};

export const useQueryContext = () => {
  const context = useContext(QueryContext);
  if (!context) {
    throw new Error("useQueryContext 에러");
  }
  return context;
};
