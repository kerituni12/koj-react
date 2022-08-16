import { Row, Col } from 'antd';
import { css } from '@emotion/css';
import styled from '@emotion/styled';

import KojLayout from '@/components/layout.component';
import { Slogan } from '@/components/slogan.component';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <Row justify="center">
      <Col span={20}>
        <Slogan>
          <span>Practice and make</span>
          <span> more profit</span>
        </Slogan>
        {/* <div className={featureStyle}> */}
        <Row justify="center" align="center" gutter={16}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <FeautureItem
              className={feautureItemStyle}
              onClick={() => navigate('challenge')}
            >
              Alogrithm Practice
            </FeautureItem>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <FeautureItem
              className={feautureItemStyle}
              color="#D4145A"
              color2="#FBB03B"
            >
              Contest
            </FeautureItem>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <FeautureItem
              className={feautureItemStyle}
              color="#009245"
              color2="#FCEE21"
            >
              Course
            </FeautureItem>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <FeautureItem
              className={feautureItemStyle}
              color="#662D8C"
              color2="#ED1E79"
            >
              Interview
            </FeautureItem>
          </Col>
        </Row>
        {/* </div> */}
      </Col>
    </Row>
  );
}

const FeautureItem = styled.div`
  background: ${(props) =>
    `linear-gradient(111deg, ${props.color || '#2E3192'} 0%, ${
      props.color2 || '#1BFFFF'
    } 100%)`};
`;

const feautureItemStyle = css`
  color: #fff;
  width: 100%;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 2px;
  margin-bottom: 10px;
`;

const featureStyle = css`
  display: flex;
  justify-content: space-between;
  margin-bottom: 50px;
  flex-wrap: wrap;
`;
