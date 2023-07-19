import { styled } from "styled-components";

const TextField = styled.input`
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

  /* &:focus {
    box-shadow: inset 0 0 0 2px blue;
  } */
`;

export default TextField;
