import { styled } from "styled-components";
import SearchBar from "../components/SearchBar";

const Search = () => {
  return (
    <SearchStyle>
      <SearchArea>
        <SearchBar />
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
