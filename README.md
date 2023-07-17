# react-caching
TanStack [react-query](https://tanstack.com/query/v3/)의 useQuery와 최대한 비슷하게 구현해보고자 합니다.

## 구현과정
우선은 데이터 feching에 과정을 useQuery hook으로 구현하고, loading, error 상태를 반환할 수 있도록 useQuery를 구현했습니다.  

```javascript
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
```

- `useState`와 `useEffect`를 이용하여 `fechData` 함수가 실행될때 `useEffect`가 동작하도록 의존성에 주입해주었습니다
- `isMounted` 변수를 사용한 이유는 컴포넌트가 마운트되어있는지 추적하기 위함입니다
  - `useEffect` 내부에서 비동기 작업을 수행하는 경우, 컴포넌트가 언마운트된 후에 비동기 작업의 결과를 처리하면 문제가 발생할 수 있기 때문입니다
  - 따라서 컴포넌트가 마운트되어있는 동안에만 비동기 작업을 처리하고, 컴포넌트가 언마운트 될 때 `isMouted = false` 처리하여 언마운트 된 후에 비동기 작업의 결과를 무시하도록 하였습니다
 
