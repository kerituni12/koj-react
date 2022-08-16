import KojLayout from '@/components/layout.component';
import { css } from '@emotion/css';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { Row, Col } from 'antd';

const FeautureItem = styled.div`
  background: ${(props) =>
    `linear-gradient(111deg, ${props.color || '#2E3192'} 0%, ${
      props.color2 || '#1BFFFF'
    } 100%)`};
  color: #fff;
  width: 250px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
`;

export default function HomePage() {
  return (
    <KojLayout>
      <Row justify="center">
        <Col span={20}>
          <div className={sologan}>
            <span>Practice and make</span>
            <span> more profit</span>
          </div>
          <div className={featureStyle}>
            <FeautureItem color="" color2="">
              Alogrithm Practice
            </FeautureItem>
            <FeautureItem color="#D4145A" color2="#FBB03B">
              Contest
            </FeautureItem>
            <FeautureItem color="#009245" color2="#FCEE21">
              Course
            </FeautureItem>
            <FeautureItem color="#662D8C" color2="#ED1E79">
              Interview
            </FeautureItem>
          </div>
        </Col>
      </Row>
    </KojLayout>
  );
}

const featureStyle = css`
  display: flex;
  justify-content: space-between;
  margin-bottom: 50px;
  flex-wrap: wrap;
`;
const bounce = keyframes`
to{
    background-position: 100%; 
  }
`;

const sologan = css`
  font-size: 54px;
  padding: 50px 0;
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
