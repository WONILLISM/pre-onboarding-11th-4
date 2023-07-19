import { styled } from "styled-components";

import { useEffect, useRef } from "react";
import { SearchItem } from "../../common/interface/searchItem";

interface RelatedSearchProps {
  data: SearchItem[] | null;
  loading: boolean;
  error: any;
  focusIdx: number;
  searchText: string;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

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

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <RelatedSearchArea>
      <RelatedSearchTitle>추천 검색어</RelatedSearchTitle>
      <RelatedSearchBox onKeyDown={handleKeyDown}>
        {!!!searchText ? (
          <RelatedSearchText>검색어 없음</RelatedSearchText>
        ) : loading ? (
          <RelatedSearchText>검색중...</RelatedSearchText>
        ) : data && data.length > 0 ? (
          <RelatedSearchItemWrapper>
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
          </RelatedSearchItemWrapper>
        ) : (
          <RelatedSearchText>검색 결과 없음</RelatedSearchText>
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

const RelatedSearchText = styled.div`
  border-top: 1px solid #dddddd;
  padding: 20px 0px;
  font-size: 14px;
  color: #aaaaaa;
  text-align: center;
`;

const RelatedSearchBox = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
`;

const RelatedSearchItemWrapper = styled.div`
  padding-top: 20px;
  border-top: 1px solid #dddddd;
`;

const RelatedSearchItem = styled.div<{ focus: boolean }>`
  padding: 4px 8px;
  border-radius: 8px;

  ${(props) => props.focus && "background-color: #eeeeee"}
`;

export default RelatedSearch;
