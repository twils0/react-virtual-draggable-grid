import React from 'react';
import PropTypes from 'prop-types';

const Input = (props) => {
  const {
    id, label, value, onChange,
  } = props;
  const height = 30;
  const buffer = 5;

  return (
    <div
      style={{
        display: 'flex',
        margin: `${buffer}px 0 0 0`,
        flexDirection: 'column',
        fontFamily: ['Titillium Web', 'sans-serif'],
        fontSize: 16,
      }}
    >
      {label}
      <input
        style={{
          height,
          margin: `${buffer}px 0 0 0`,
          padding: `0 0 0 ${buffer}px`,
          boxShadow: 'none',
          border: '1px solid #ccc',
          borderRadius: 0,
        }}
        id={id}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Input;
