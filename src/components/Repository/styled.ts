import styled from "styled-components";

export const RepositoryContainer = styled.div`
  background-color: #f0f0f0;
  padding: 10px;
  display: flex;
  align-items: center;
  color: #000000;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  transition: 0.3s;
  align-items: center;
  overflow: hidden;

  &:hover {
    background-color: #e0e0e0;
  }

  label {
    cursor: pointer;
  }
`;
