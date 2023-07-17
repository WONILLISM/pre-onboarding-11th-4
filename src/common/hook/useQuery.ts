import { useState, useEffect } from "react";

interface QueryResponse<T> {
  data: T | null;
  loading: boolean;
  error: any;
}

type QueryFunction<T> = (params?: any) => Promise<T>;

const useQuery = <T>(queryFn: QueryFunction<T>): QueryResponse<T> => {
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
        }
      } catch (error) {
        if (isMounted) {
          setError(error);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [queryFn]);

  return { data, loading, error };
};

export default useQuery;
