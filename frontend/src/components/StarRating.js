import React from 'react';

const StarRating = ({ value, onChange, size = 28, readOnly = false }) => {
  const [hover, setHover] = React.useState(0);
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          style={{
            fontSize: size, cursor: readOnly ? 'default' : 'pointer',
            color: star <= (hover || value) ? '#FFBE55' : '#DDD',
            transition: 'color .15s, transform .15s',
            transform: !readOnly && hover >= star ? 'scale(1.2)' : 'scale(1)',
            lineHeight: 1,
          }}
        >★</span>
      ))}
    </div>
  );
};

export default StarRating;
