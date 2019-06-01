import styled from 'styled-components';

export const Filters = styled.div`
  display: flex;
  justify-content: center;
  max-width: 500px;
  margin: 0 auto;
  width: 96vw;
  margin-top: 16px;

  .react-select {
    width: 50%;
    z-index: 2;
  }

  .react-select:not(:last-child) {
    margin-right: 8px;
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 500px;
  margin: 16px auto;
  width: 96vw;

  > * {
    margin-bottom: 8px;

    &:not(:last-child) {
      margin-right: 8px;
    }
  }
`;