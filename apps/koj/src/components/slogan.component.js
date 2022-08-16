import { keyframes } from '@emotion/css';
import styled from '@emotion/styled';

const bounce = keyframes`
to{
    background-position: 100%;
  }
`;

export const Slogan = styled.div`
  font-family: Ubuntu;
  font-size: ${(props) => props.size || 54}px;
  padding: ${(props) => props.padding || 50}px 0;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  background-image: linear-gradient(
    to right,
    #00f260,
    #f79d00,
    #0575e6,
    #64f38c
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  background-size: 300%;
  background-position: -100%;

  animation: ${bounce} 5s infinite alternate-reverse;
  & span {
    display: block;
  }
`;
