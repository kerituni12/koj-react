import Slider from 'react-slick';
import styled from '@emotion/styled';

import 'slick-carousel/slick/slick.css';
import '@koj-react/ui/style/slick-theme.css';

const typeList = [
  {
    title: 'Algorithm',
    description: 'hlell',
    color: '#FF416C',
    color2: '#240b36',
  },
  {
    title: 'Algorithm',
    description: 'hlell',
    color: '#134E5E',
    color2: '#71B280',
  },
  {
    title: 'Algorithm',
    description: 'hlell',
    color: '#556270',
    color2: '#FF6B6B',
  },

  {
    title: 'Algorithm',
    description: 'hlell',
    color: '#3494E6',
    color2: '#EC6EAD',
  },
  {
    title: 'Algorithm',
    description: 'hlell',
    color: '#FF416C',
    color2: '#f5af19',
  },
  {
    title: 'Algorithm',
    description: 'hlell',
    color: '#9D50BB',
    color2: '#2C3F88',
  },
  {
    title: 'Algorithm',
    description: 'hlell',
    color: '#1FA2FF',
    color2: '#A6FFCB',
  },
];

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  arrows: false,
  responsive: [
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
  ],
};

export function TypeCarousel() {
  return (
    <div className="koj-slick">
      <Slider {...settings}>
        {typeList.map(({ color, color2, title, description }, index) => (
          <div key={index}>
            <TypeList color={color} color2={color2}>
              <p className="title">{title}</p>
              <span>{description}</span>
            </TypeList>
          </div>
        ))}
      </Slider>
    </div>
  );
}

const TypeList = styled.div`
  background: ${(props) =>
    `linear-gradient(111deg, ${props.color || '#2E3192'} 0%, ${
      props.color2 || '#1BFFFF'
    } 100%)`};
  color: #fff;
  // width: 120px;
  height: 76px;
  padding: 5px;
  margin-bottom: 5px;
  border-radius: 5px;
  margin-right: 5px;
`;
