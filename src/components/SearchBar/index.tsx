import { InputHTMLAttributes, useEffect, useState } from "react";
import { styled } from "styled-components";

import { getSearchItems } from "../../common/api";
import useQuery from "../../common/hook/useQuery";
import { SearchItem } from "../../common/interface/searchItem";

const SearchBar = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [isFocus, setIsFocus] = useState<boolean>(false);

  const { data, loading, error } = useQuery<SearchItem[]>(
    `search ${searchText}`,
    () => getSearchItems({ q: searchText }),
    { enabled: !!searchText }
  );

  useEffect(() => {
    if (!!searchText) {
      getSearchItems({ q: searchText });
    }
  }, [searchText]);

  if (error) {
    return <div>error</div>;
  }

  return (
    <div>
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
      {isFocus && (
        <div>
          <div>추천 검색어</div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div>
              {data?.map((item) => (
                <div>🔍 {item.sickNm}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const TextField = styled.input<TextFieldProps>`
  width: 100%;
  padding: 0 18px;
  font-size: 15px;
  line-height: 48px;
  margin: 0;
  outline: none;
  border: none;
  border-radius: 8px;
  background-color: #ffffff;
  transition: background 0.2s ease, color 0.1s ease, box-shadow 0.2s ease;
  box-shadow: inset 0 0 0 1px #aaaaaa;

  &:focus {
    box-shadow: inset 0 0 0 2px blue;
  }
`;

export default SearchBar;
