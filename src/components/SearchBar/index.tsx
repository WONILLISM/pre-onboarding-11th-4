import { useEffect, useState } from "react";
import { getSearchItems } from "../../common/api";
import { AxiosRequestConfig } from "axios";

interface SearchItem {
  sickCd: string;
  sickNm: string;
}

const SearchBar = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [data, setData] = useState<SearchItem[]>([]);

  const fetchData = async () => {
    try {
      const searchResponse = await getSearchItems();

      setData(searchResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <input type="search" />
    </div>
  );
};

export default SearchBar;
