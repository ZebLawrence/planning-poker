import React from 'react';
import './flipCard.scss';

const flipCard = props => {
  const { name, points, flipped, image, backgroundColor } = props;
  const bgImage = image ? { backgroundImage: `url(${image})` } : undefined;
  const bgColor = backgroundColor ? { backgroundColor: backgroundColor } : undefined;

  return (
    <div className={`flip-card ${flipped ? 'flipped' : ''}`}>
      <div className="flip-card-inner">
        <div className="flip-card-front" style={{...bgImage, ...bgColor}}>
          {name}
          {points && <div className="points-set">✔</div>}
        </div>
        <div className="flip-card-back">
          {flipped ? points : '...'}
        </div>
      </div>
    </div>
  );
};

export default flipCard;
