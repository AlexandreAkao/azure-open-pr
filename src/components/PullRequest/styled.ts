import styled from "styled-components";

export const PullRequestContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #e1e4e8;
  padding: 12px 8px;
  justify-content: space-between;
  gap: 16px;
  border-radius: 8px;
  margin-bottom: 8px;

  > a,
  img {
    object-fit: cover;
    width: 44px;
    height: 44px;
    border-radius: 50%;
  }

  .user-image {
    border: 2px solid #fafafa;
  }
`;

export const PullRequestInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 4px;
  justify-content: flex-start;

  span:first-child {
    font-weight: bold;
    color: #fafafa;
  }

  span:last-child {
    font-size: 0.8rem;
    color: #afafafff;
  }
`;

export const PullRequestReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  a {
    position: relative;

    img {
      object-fit: cover;
    }

    svg {
      background-color: white;
      border: 2px solid black;
      border-radius: 50%;
      position: absolute;
      right: -4px;
      bottom: 4px;
    }
  }

  img {
    border-radius: 50%;
    width: 30px;
    height: 30px;
  }
`;

export const GoToPr = styled.a`
  cursor: pointer;
`;
