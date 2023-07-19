import { useState, useEffect } from "react";
import { QueryFunction, QueryResponse } from "../interface/queryClient";
import { useQueryClientContext } from "../context/QueryClientContext";

interface Options {
  enabled?: boolean;
  cacheTime?: number;
}

const useQuery = <T>(
  queryKey: string,
  queryFn: QueryFunction<T>,
  options?: Options
): QueryResponse<T> => {
  const { queryCache } = useQueryClientContext();

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await queryFn();

      setData(response);
      setError(null);

      queryCache.set(queryKey, {
        data: response,
        loading: false,
        error: null,
        cachedTime: Date.now(),
      });
    } catch (error) {
      setError(error);

      queryCache.set(queryKey, {
        data: null,
        loading: false,
        error,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!options?.enabled) {
      return;
    }

    if (queryCache.has(queryKey)) {
      const cachedData = queryCache.get(queryKey);

      if (cachedData) {
        if (options?.cacheTime && cachedData.cachedTime) {
          const remainTime = Date.now() - cachedData.cachedTime;
          if (options.cacheTime >= remainTime) {
            setData(cachedData.data);
            setLoading(cachedData.loading);
            setError(cachedData.error);
            console.info(`cache hit: ${queryKey}`);
            return;
          } else {
            // fetchData();
            queryCache.delete(queryKey);
            console.info(`cache expired: ${queryKey}`);
            return;
          }
        }
      }
    }

    fetchData();
    console.info("calling api");
    console.info(`current data key: [${queryKey}]`);
    console.info(`current query cache: `, queryCache);
  }, [queryCache, queryKey, queryFn, options?.enabled, options?.cacheTime]);

  return { data, loading, error };
};

export default useQuery;
