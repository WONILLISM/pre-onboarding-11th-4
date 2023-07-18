import { useState } from "react";
import { SearchItem } from "../../common/interface/searchItem";
import { getSearchItems } from "../../common/api";
import useQuery from "../../common/hook/useQuery";
import TextField from "./TextField";
import { styled } from "styled-components";

const SearchBar = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [isFocus, setIsFocus] = useState<boolean>(false);

  const queryKey = `search ${searchText}`;

  const { data, loading, error } = useQuery<SearchItem[]>(
    queryKey,
    () => getSearchItems({ q: searchText }),
    { enabled: !!searchText, cacheTime: 6000 }
  );

  if (error) {
    return <div>error</div>;
  }

  return (
    <>
      <SearchBarStyle>
        <TextField
          placeholder="질환명을 입력해 주세요."
          value={searchText}
          onFocus={() => {
            setIsFocus(true);
          }}
          onBlur={() => {
            setIsFocus(false);
          }}
          onChange={(e) => {
            const { value } = e.target;

            setSearchText(value);
          }}
        />
      </SearchBarStyle>
      {isFocus && (
        <RelatedSearchArea>
          <RelatedSearchTitle>추천 검색어</RelatedSearchTitle>
          <RelatedSearchBox>
            {!!!searchText ? (
              <div>검색어 없음</div>
            ) : loading ? (
              <div>Loading...</div>
            ) : data && data.length > 0 ? (
              data.map((item) => (
                <RelatedSearchItem>🔍 {item.sickNm}</RelatedSearchItem>
              ))
            ) : (
              <div>검색 결과 없음</div>
            )}
          </RelatedSearchBox>
        </RelatedSearchArea>
      )}
    </>
  );
};

const SearchBarStyle = styled.section`
  padding: 16px;
  background-color: #ffffff;
  border-radius: 16px;
`;

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

const RelatedSearchItem = styled.div`
  padding: 4px 0px;
`;

export default SearchBar;
