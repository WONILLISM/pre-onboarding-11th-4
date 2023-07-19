import { ReactElement, ReactNode } from "react";
import { styled } from "styled-components";

interface SearchBarProps {
  icon?: ReactNode;
  children?: ReactElement;
  searchButton?: ReactNode;
}

const SearchBar = ({ icon, children, searchButton }: SearchBarProps) => {
  return (
    <SearchBarStyle>
      <IconArea>{icon}</IconArea>
      {children}
      <ButtonArea>{searchButton}</ButtonArea>
    </SearchBarStyle>
  );
};

const SearchBarStyle = styled.section`
  padding: 16px;
  background-color: #ffffff;
  border-radius: 16px;

  display: flex;
  align-items: center;
  gap: 8px;
`;
const IconArea = styled.div``;
const ButtonArea = styled.div``;

export default SearchBar;
