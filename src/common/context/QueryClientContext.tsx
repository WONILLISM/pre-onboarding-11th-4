import { ReactNode, createContext, useContext, useState } from "react";
import { QueryCache, QueryContextValue } from "../interface/queryClient";

export const QueryClientContext = createContext<QueryContextValue | null>(null);

interface QueryClientProviderProps {
  children: ReactNode;
}

export const QueryClientProvider = ({ children }: QueryClientProviderProps) => {
  const [queryCache] = useState<QueryCache>(new Map());

  return (
    <QueryClientContext.Provider value={{ queryCache }}>
      {children}
    </QueryClientContext.Provider>
  );
};

export const useQueryContext = () => {
  const context = useContext(QueryClientContext);
  if (!context) {
    throw new Error("useQueryContext 에러");
  }
  return context;
};
