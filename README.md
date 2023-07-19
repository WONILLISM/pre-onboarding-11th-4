# 원티드 프리온보딩 인턴십 11차 4주차 과제
# 목차
1. [시작하기](#시작하기)  
  1.1. [사용 방법](#사용-방법)  
  1.2. [기술 스택](#기술-스택)  
3. [과제](#과제)  
4. [구현](#구현)  
  4.1. [구현 전략](#구현-전략)  
  4.2. [API 호출별로 캐싱 구현](#구현-전략)  
  4.3. [expire time 구현](#expire-time-구현)  
  4.4. [입력마다 API 호출하지 않도록 API 호출 횟수를 줄이는 전략 수립 및 실행](#입력마다-API-호출하지-않도록-API-호출-횟수를-줄이는-전략-수립-및-실행)  
  4.5. [키보드만으로 추천 검색어들로 이동 가능하도록 구현](#키보드만으로-추천-검색어들로-이동-가능하도록-구현)  
5. [아쉬운점](#아쉬운점)

# 시작하기  
![demo](https://github.com/WONILLISM/pre-onboarding-11th-4/assets/47653005/446e467f-9870-424f-8cbf-0d8299e05a58)
![demo2](https://github.com/WONILLISM/pre-onboarding-11th-4/assets/47653005/34f152ee-fcc2-405d-b833-dee783645c7a)


## 사용 방법  
구성된 백엔드 레포지토리  
[backend-repo](https://github.com/walking-sunset/assignment-api)  

```
> git clone https://github.com/WONILLISM/pre-onboarding-11th-4.git
> cd pre-onboarding-11th-4
> npm install
> npm start
```


## 기술 스택
<div>
<img src="https://img.shields.io/badge/VisualStudioCode-007ACC?style=flat&logo=visualstudiocode&logoColor=white" /> <img src="https://img.shields.io/badge/Git-F05032?style=flat&logo=Git&logoColor=white" /> <img src="https://img.shields.io/badge/GitHub-181717?style=flat&logo=GitHub&logoColor=white" />
</div>
<div>
<img src="https://img.shields.io/badge/Node.js-v18.16.1-339933?style=flat&logo=Node.js&logoColor=white" /> <img src="https://img.shields.io/badge/Javascript-F7DF1E?style=flat&logo=Javascript&logoColor=white" /> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=TypeScript&logoColor=white" /> <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=React&logoColor=white" /> <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=Vite&logoColor=white" />    
</div>  

# 과제
## 과제 설명
- 아래 사이트의 검생영역 클론하기
- [한국 임상 정보](https://clinicaltrialskorea.com/)
- 질환명 검색시 API 호출을 통해서 검색어 추천기능 구현
## 과제 task
- [x] API 호출별로 로컬 캐싱 구현
  - 캐싱 기능을 제공하는 라이브러리 사용 금지(React-Query 등)
  - 캐싱을 어떻게 기술했는지에 대한 내용 README에 기술
- [x] expire time을 구현할 경우 가산점
- [x] 입력마다 API 호출하지 않도록 API 호출 횟수를 줄이는 전략 수립 및 실행
- [x] API를 호출할 때 마다 `console.info("calling api")` 출력을 통해 콘솔창에서 API 호출 횟수 확인이 가능하도록 설정
- [x] 키보드만으로 추천 검색어들로 이동 가능하도록 구현


# 구현  
## 구현 전략
- 캐싱 기능을 TanStack [react-query](https://tanstack.com/query/v3/)의 `useQuery`와 최대한 비슷하게 구현해보고자 한다.

## API 호출별로 캐싱 구현 <br /> & API를 호출할 때 마다 `console.info("calling api")` 출력을 통해 콘솔창에서 API 호출 횟수 확인이 가능하도록 설정  

API호출별로 캐싱 구현, 즉 검색어 마다 API에 호출하여 해당 데이터를 저장함을 의미한다.  

`react-query`는 `queryClient`를 제공함으로써 `queryKey`에 맞는 데이터를 `queryClient`에서 관리하며 `Provider`로 컴포넌트에 제공한다.  
`useQuery` hook은 `queryKey`를 유일한 값으로 지정하여 그 key에 맞게 api에서 불러온 데이터를 저장한다.  

### 구현과정  
- `QueryCache`를 `Context`를 사용하여 저장, 이후 `useQuery` Hook에서 data 요청을 하기위한 `Provider`를 만들기 위함
- `key`와 `value` 형태인 자료구조 `Map`을 사용하여 `queryCache` 선언
- api 호출마다 console.log(\`calling api\`)를 통해 확인가능

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

export const useQueryClientContext = () => {
  const context = useContext(QueryClientContext);
  if (!context) {
    throw new Error("useQueryContext 에러");
  }
  return context;
};
```

- `queryKey`와 그 쿼리의 요청 함수인 `queryFn`을 매개변수로 받음
- `key`가 없으면 `fetchData` 함수를 통해 `queryFn`을 호출
- `key`가 있으면 `queryCache`에 저장된 데이터를 사용

  
`useQuery`  
```javascript
// ... (생략)
const useQuery = <T>(
  queryKey: string,
  queryFn: QueryFunction<T>,
  options?: Options
): QueryResponse<T> => {
  const { queryCache } = useQueryClientContext();

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

  useEffect(()=>{
  
    // ... (생략)

    if (queryCache.has(queryKey)) {
      const cachedData = queryCache.get(queryKey);

      // ... (생략)
      
      setData(cachedData.data);
      setLoading(cachedData.loading);
      setError(cachedData.error);
      
      return;
    }
      // ... (생략)  

    fetchData();
    console.info("calling api"); // api 호출시 console.info
  
    // ... (생략)
  }[queryCache, queryKey, queryFn ... ]);

};

export default useQuery;

```

## expire time 구현  
react-query의 data는 아래와 같은 상태로 관리된다.  
- fetching : 요청중인 쿼리
- fresh : 만료되지 않은 쿼리, 컴포넌트가 마운트, 업데이트되어도 데이터를 다시 요청하지 않는다.
- stale : 만료된 쿼리, 컴포넌트가 마운트, 업데이트되면 데이터를 다시 요청한다.
- inactive : 사용하지 않는 쿼리, 일정 시간이 지나면 가비지 컬렉터가 캐시에서 제거한다.
- delete - 가비지 컬렉터에 의해 캐시에서 제거된 쿼리

저 상태를 모두 구현하기엔 힘들어보이고 cacheTime 옵션에 의해 fresh -> delete 상태처럼 구현했다.  

### 구현과정

- `queryKey`가 있는지 확인
- 있다면 저장된 데이터(`cachedData`)가 있는지 확인
- `option`으로받은 `cacheTime`이 있고, 최초 저장된 시점인 `cachedTime`이 있다면, 남은 시간을 계산
- 남은 시간보다 `cacheTime`이 크거나 같다면 저장된 데이터를 사용
- 그렇지 않다면 `queryCache`에서 해당 데이터를 삭제

`useQuery.ts`
```javascript
// ...(생략)
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
            queryCache.delete(queryKey);
            console.info(`cache expired: ${queryKey}`);
            return;
          }
        }
      }
    }

    fetchData();
    console.info("calling api");

  // ...(생략)

}

// ...(생략)
```


## 입력마다 API 호출하지 않도록 API 호출 횟수를 줄이는 전략 수립 및 실행  
debouce란, 전자공학용어로 버튼으로부터 신호를 받았다면, 마이크로칩은 물리적으로 다시 버튼을 누르는 것이 불가능한, 약 몇 마이크로초 동안 버튼으로부터 온 신호를 처리하지 않도록하는 기술이다.  
검색어를 구현할때에도 매 입력마다 요청을 해버리면 서버에 부담이 갈뿐만아니라, 의도하지 않은 검색어도 검색하는 경우가 생길 수 있다.  

### 구현과정  
- 관심사 분리를 위해 `custom hook`으로 분리
- debounce 처리를 해줄 `value`와 `delay` 값을 인자로 받음
- 일정시간(`delay`)이 지나면 콜백함수를 호출하는 `setTimeout` 함수를 이용하여 입력시간을 기다림
  - 입력받는 `value`값이 계속해서 입력되면(의존성에 의해 `useEffect`가 계속해서 실행됨), `delay`동안 기다리던 `setTimeout`의 콜백함수는 취소되고, 새로운 `setTimeout`함수가 호출되는 기술을 이용
- `delay`시간동안 입력이 없으면 `setTimeout`의 콜백함수를 실행시켜 `debounceValue`를 현재 입력값으로 지정해주고, `debouncing` 상태를 `false`로 변환한다.
- `debouncing` 상태는 `ui`에 `검색중`을 표시하기 위함

`useDebounce.ts`
```javascript
import { useEffect, useState } from "react";

interface UseDebounceProps {
  value: string;
  delay: number;
}
const useDebounce = ({ value, delay }: UseDebounceProps) => {
  const [debounceValue, setDebounceValue] = useState<string>(value);
  const [debouncing, setDebouncing] = useState<boolean>(false);

  useEffect(() => {
    setDebouncing(true);
    const timer = setTimeout(() => {
      setDebounceValue(value);
      setDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value]);
  return { debounceValue, debouncing };
};

export default useDebounce;
```

## 키보드만으로 추천 검색어들로 이동 가능하도록 구현  
`useRef`를 이용하여 `Dom`요소에 직접 접근하여 구현  

### 구현과정  

- API 호출을 통한 `data`의 크기를 통해 빈 배열을 초기값으로 가지는 변수 선언
- `<RelatedSearchItem>` 컴포넌트의 `ref`값을 통해 빈 배열에 `ref` 값을 넣어줌
- 상위 컴포넌트인 Search.tsx에서 선언한 `focusIdx`와, `handleKeyDown` 함수에서 `focusIdx` 동작
- `<RelatedSearchItem>` 에서 `tabIdx`속성으로 html 요소에 접근 시키고, `focus`속성으로 현재 포커스하고 있는 엘리먼트를 찾아줌

`Search.tsx`  

```javascript
// ...(생략)

const [focusIdx, setFocusIdx] = useState<number>(-2);

// ...(생략)

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    e.preventDefault();
    setFocusIdx((prevIdx) => {
      const maxIdx = data ? Math.max(data.length - 1, 0) : 0;
      if (e.key === "ArrowUp") {
        return Math.max(prevIdx - 1, -1);
      } else {
        return Math.min(prevIdx + 1, maxIdx);
      }
    });
  }
};
// ...(생략)

```
`RelatedSearch.tsx`
```javascript
const RelatedSearch = ({
  data,
  loading,
  error,
  focusIdx,
  searchText,
  handleKeyDown,
}: RelatedSearchProps) => {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (data) {
      itemRefs.current = data.map(() => null);
    }
  }, [data]);

  // ...(생략)

  return (
    // ... 생략
            {data.map((item, idx) => (
              <RelatedSearchItem
                key={item.sickCd}
                ref={(el) => (itemRefs.current[idx] = el)}
                focus={idx === focusIdx}
                tabIndex={idx === focusIdx ? 0 : -1}
              >
                🔍 {item.sickNm}
              </RelatedSearchItem>
            ))}
          // ... 생략
  );
};

// ... 스타일 코드 생략
const RelatedSearchItem = styled.div<{ focus: boolean }>`
  padding: 4px 8px;
  border-radius: 8px;

  ${(props) => props.focus && "background-color: #eeeeee"}
`;
export default RelatedSearch;

```

## 아쉬운점  
- 현재 키보드이벤트가 일어날때 `Search.tsx` 컴포넌트의 `focusIdx`가 변경되면서 `useQuery` 훅이 계속 호출 된다. 캐싱 처리해두었기 때문에 빈번한 api 호출은 일어나지 않겠지만 의도하지 않는 현상이다.
- `QueryClientProvider`를 `react-query` 처럼 `queryClient` 클래스를 만들어서 해보고싶다.
