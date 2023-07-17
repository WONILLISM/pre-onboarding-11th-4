export interface QueryResponse<T> {
  data: T | null;
  loading: boolean;
  error: any;
}

export type QueryFunction<T> = (params?: any) => Promise<T>;

export type QueryCache = Map<string, QueryResponse<any>>;

export interface QueryContextValue {
  queryCache: QueryCache;
}
