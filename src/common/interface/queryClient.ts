export interface QueryProps<T> {
  data: T | null;
  loading: boolean;
  error: any;
  cachedTime?: number;
}

export interface QueryResponse<T> {
  data: T | null;
  loading: boolean;
  error: any;
}

export type QueryFunction<T> = (params?: any) => Promise<T>;

export type QueryCache = Map<string, QueryProps<any>>;

export interface QueryContextValue {
  queryCache: QueryCache;
}
