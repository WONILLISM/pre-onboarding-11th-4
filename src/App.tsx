import { QueryClientProvider } from "./common/context/QueryClientContext";
import SearchBar from "./components/SearchBar";

function App() {
  return (
    <>
      <QueryClientProvider>
        <SearchBar />
      </QueryClientProvider>
    </>
  );
}

export default App;
