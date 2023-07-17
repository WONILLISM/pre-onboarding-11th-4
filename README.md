# react-caching
TanStack [react-query](https://tanstack.com/query/v3/)의 useQuery와 최대한 비슷하게 구현해보고자 한다.

## 구현과정
우선은 데이터 feching에 과정을 useQuery hook으로 구현하고, loading, error 상태를 반환할 수 있도록 useQuery를 구현했다.  

### useQuery  

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

- `useState`와 `useEffect`를 이용하여 `fechData` 함수가 실행될때 `useEffect`가 동작하도록 의존성에 주입해주었다
- `isMounted` 변수를 사용한 이유는 컴포넌트가 마운트되어있는지 추적하기 위함입니다
  - `useEffect` 내부에서 비동기 작업을 수행하는 경우, 컴포넌트가 언마운트된 후에 비동기 작업의 결과를 처리하면 문제가 발생할 수 있기 때문입니다
  - 따라서 컴포넌트가 마운트되어있는 동안에만 비동기 작업을 처리하고, 컴포넌트가 언마운트 될 때 `isMouted = false` 처리하여 언마운트 된 후에 비동기 작업의 결과를 무시하도록 하였습니다

 ### ReactQueryClientProvider  
`react-query`의 `useQuery`는 `key` 값에따라 데이터를 캐싱 처리를 한다.
`Map` 자료구조를 값으로 가지는 `Context API`를 이용하여 최상단 컴포넌트에 `Provider`로 감싼 후 `useQuery` 훅을 호출할때 `key` 값을 인자로 넘겨 받아 해당 `key`의 `value`에 `query function`으로 호출받은 데이터를 저장시켜 준다.  


`QueryClientContext.tsx`
```javascript
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


```
- `const [queryCache] = useState<QueryCache>(new Map());`를 이용해 `key`값에 따른 데이터를 저장하기 위한 상태 선언


`useQuery.ts`
```javascript

...

const useQuery = <T>(
  queryKey: string,
  queryFn: QueryFunction<T>
): QueryResponse<T> => {
  const { queryCache } = useQueryContext();

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    ...

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
  }, [queryCache, queryKey, queryFn]);

  return { data, loading, error };
};

export default useQuery;

```

- 앞서 구현한 `QueryClientContext`에서 만든 `useQueryClientHook`을 이용해 `Context API` 안에서 관리되고 있는 상태를 불러 온다.
- `useEffect` 안에 if문을 추가해서, `fetchData()`함수가 호출되기 전에 `key`값을 찾아 저장된적이 있으면 저장되어있는 데이터를 불러온다.



