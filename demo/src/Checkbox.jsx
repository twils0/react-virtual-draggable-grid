import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = (props) => {
  const {
    id, label, checked, onChange,
  } = props;
  const size = 15;
  const buffer = 5;

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'nowrap',
        margin: `${buffer}px 0 0 0`,
        fontFamily: ['Titillium Web', 'sans-serif'],
        fontSize: 16,
      }}
    >
      <label
        style={{
          display: 'block',
          position: 'relative',
          height: size,
          width: size,
          margin: `0.25em ${buffer * 2}px 0 0`,
          padding: '1px 0 0 1px',
          border: '1px solid #ccc',
        }}
        htmlFor={id}
      >
        <input
          id={id}
          style={{
            display: 'block',
            position: 'absolute',
            height: size - 1,
            width: size - 1,
            margin: 0,
            background: checked ? '#ccc' : 'transparent',
            appearance: 'none',
            MozAppearance: 'none',
            WebkitAppearance: 'none',
          }}
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
      </label>
      {label}
    </div>
  );
};

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Checkbox;
