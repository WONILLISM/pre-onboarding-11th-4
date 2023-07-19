import { styled } from "styled-components";
import { SearchItem } from "../../common/interface/searchItem";
import { getSearchItems } from "../../common/api";
import useQuery from "../../common/hook/useQuery";
import { useEffect, useRef, useState } from "react";

interface RelatedSearchProps {
  searchText: string;
}

const RelatedSearch = ({ searchText }: RelatedSearchProps) => {
  const queryKey = `search ${searchText}`;

  const { data, loading, error } = useQuery<SearchItem[]>(
    queryKey,
    () => getSearchItems({ q: searchText }),
    { enabled: !!searchText, cacheTime: 6000 }
  );

  if (error) {
    return <div>error</div>;
  }

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [focusIdx, setFocusIdx] = useState<number>(-1);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (data) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusIdx((prevIdx) => Math.max(prevIdx - 1, -1));
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusIdx((prevIdx) => Math.min(prevIdx + 1, data.length - 1));
      }
    }
  };

  useEffect(() => {
    if (data) {
      itemRefs.current = data.map(() => null);
    }
  }, [data]);

  useEffect(() => {
    if (itemRefs.current[focusIdx]) {
      itemRefs.current[focusIdx]?.focus();
    }
  }, [focusIdx]);

  return (
    <RelatedSearchArea>
      <RelatedSearchTitle>추천 검색어</RelatedSearchTitle>
      <RelatedSearchBox onKeyDown={handleKeyDown} tabIndex={0}>
        {!!!searchText ? (
          <div>검색어 없음</div>
        ) : loading ? (
          <div>Loading...</div>
        ) : data && data.length > 0 ? (
          data.map((item, idx) => (
            <RelatedSearchItem
              key={item.sickCd}
              ref={(el) => (itemRefs.current[idx] = el)}
              tabIndex={idx === focusIdx ? 0 : -1}
              focus={idx === focusIdx}
            >
              🔍 {item.sickNm}
            </RelatedSearchItem>
          ))
        ) : (
          <div>검색 결과 없음</div>
        )}
      </RelatedSearchBox>
    </RelatedSearchArea>
  );
};

const RelatedSearchArea = styled.div`
  margin-top: 16px;
  padding: 20px 16px;
  background-color: #ffffff;
  border-radius: 16px;
`;

const RelatedSearchTitle = styled.div`
  font-size: 12px;
  color: #aaaaaa;
`;

const RelatedSearchBox = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
`;

const RelatedSearchItem = styled.div<{ focus: boolean }>`
  padding: 4px 0px;

  ${(props) => props.focus && "box-shadow: inset 0 0 0 2px red;"}
`;

export default RelatedSearch;
