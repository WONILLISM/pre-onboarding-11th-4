import { useState, useEffect } from "react";
import { QueryFunction, QueryResponse } from "../interface/queryClient";
import { useQueryClientContext } from "../context/QueryClientContext";

interface Options {
  enabled: boolean;
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

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        // loading 상태를 확인하기 위함
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const response = await queryFn();
        if (isMounted) {
          setData(response);
          setLoading(false);
          queryCache.set(queryKey, {
            data: response,
            loading: false,
            error: null,
          });
          console.info(`calling api ${queryKey}`);
        }
      } catch (error) {
        if (isMounted) {
          setError(error);
          setLoading(false);
          queryCache.set(queryKey, { data: null, loading: false, error });
        }
      }
    };

    // enabled가 false면 fetch 함수 실행하지 않음

    if (options?.enabled === false) {
      setLoading(false);
      return;
    }

    if (queryCache.has(queryKey)) {
      const cachedData = queryCache.get(queryKey);

      if (cachedData) {
        setData(cachedData.data);
        setLoading(cachedData.loading);
        setError(cachedData.error);
        return;
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [queryCache, queryKey, queryFn, options?.enabled]);

  return { data, loading, error };
};

export default useQuery;
