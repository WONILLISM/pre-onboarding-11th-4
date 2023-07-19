import { useState } from "react";
import { styled } from "styled-components";
import SearchBar from "../components/Search/SearchBar";
import RelatedSearch from "../components/Search/RelatedSearch";
import TextField from "../components/TextField";

const Search = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [isFocus, setIsFocus] = useState<boolean>(false);

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
          />
        </SearchBar>
        <RelatedSearch searchText={searchText} />
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
