import { useState } from "react";
import { styled } from "styled-components";
import SearchBar from "../components/Search/SearchBar";
import RelatedSearch from "../components/Search/RelatedSearch";
import TextField from "../components/TextField";
import useQuery from "../common/hook/useQuery";
import { SearchItem } from "../common/interface/searchItem";
import { getSearchItems } from "../common/api";
import useDebounce from "../common/hook/useDebounce";

const Search = () => {
  const [searchText, setSearchText] = useState<string>("");

  const { debounceValue, debouncing } = useDebounce({
    value: searchText,
    delay: 300,
  });

  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [focusIdx, setFocusIdx] = useState<number>(-2);

  const queryKey = `search ${debounceValue}`;

  const { data, error } = useQuery<SearchItem[]>(
    queryKey,
    () => getSearchItems({ q: searchText }),
    {
      enabled: !!debounceValue.trim(),
      cacheTime: 1000,
    }
  );

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

  return (
    <SearchStyle>
      <SearchArea>
        <SearchBar
          icon={<div>icon</div>}
          searchButton={<button>search</button>}
        >
          <TextField
            placeholder="질환명을 입력해 주세요."
            onChange={(e) => {
              const { value } = e.target;

              setSearchText(value);
            }}
            onFocus={() => {
              setIsFocus(true);
            }}
            onBlur={() => {
              setIsFocus(false);
            }}
            onKeyDown={handleKeyDown}
          />
        </SearchBar>
        {isFocus && (
          <RelatedSearch
            data={data}
            loading={debouncing}
            error={error}
            focusIdx={focusIdx}
            searchText={searchText}
            handleKeyDown={handleKeyDown}
          />
        )}
      </SearchArea>
    </SearchStyle>
  );
};

const SearchStyle = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SearchArea = styled.section`
  width: 100%;
  max-width: 640px;
  margin-top: 20px;
`;

export default Search;
