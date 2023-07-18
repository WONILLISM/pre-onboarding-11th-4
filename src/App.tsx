import { createGlobalStyle } from "styled-components";
import { QueryClientProvider } from "./common/context/QueryClientContext";

import Search from "./pages/Search";

function App() {
  return (
    <QueryClientProvider>
      <GlobalStyle />
      <Search />
    </QueryClientProvider>
  );
}

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  a{
    text-decoration: none;
    color: inherit;
  }

  ul, li, ol {
    margin:0;
    padding:0;
    list-style:none;
    list-style-type:none;
  }

  html, body {
    margin: 0;
    padding: 0;

    width: 100%;
    height: 100%;
    
    background-color: #D5E7FB;
  }
`;

export default App;
