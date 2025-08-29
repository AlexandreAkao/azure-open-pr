import styled from "styled-components";

export const CollapseContainer = styled.div`
  border: 1px solid #ccc;
  margin: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;

  h2 {
    background-color: #f1f1f1;
    color: #333;
    font-size: 16px;
    margin: 0;
    padding: 10px;
    border-bottom: 1px solid #ccc;
    cursor: pointer;

    &:hover {
      background-color: #e0e0e0;
    }
  }
`;
