import { getSearchItems } from "../../common/api";
import useQuery from "../../common/hook/useQuery";

interface SearchItem {
  sickCd: string;
  sickNm: string;
}

const SearchBar = () => {
  const { data, loading, error } = useQuery<SearchItem[]>(getSearchItems);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      data fetching 완료
      <input type="search" />
    </div>
  );
};

export default SearchBar;
