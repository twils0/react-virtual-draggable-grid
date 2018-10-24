import React from 'react';
import PropTypes from 'prop-types';

import { ClipLoader } from 'halogenium';

class DemoItemComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageLoaded: false,
      imageNumber: this.props.imageNumber,
    };
  }

  handleImageLoaded = () => {
    this.setState({ imageLoaded: true });
  };

  handleImageError = () => {
    this.setState(prevState => ({ imageNumber: prevState.imageNumber - 1 }));
  };

  handleButtonClick = () => console.log('clicked without initiating drag', this.props.name, '.');

  render() {
    const {
      styles, width, height, name, color,
    } = this.props;
    const { imageLoaded, imageNumber } = this.state;
    const loaderSize = 30;
    const buffer = 20;
    const fontSize = 16;
    const imgHeight = height - Math.ceil(fontSize * 2 * 1.5) - buffer * 4;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          alignText: 'center',
          userSelect: 'none',
          cursor: 'move',
          width: 'auto',
          height: 'auto',
          background: 'white',
          ...styles,
        }}
      >
        <img
          src={`https://picsum.photos/${width}/${imgHeight}?image=${imageNumber}`}
          alt=""
          onLoad={this.handleImageLoaded}
          onError={this.handleImageError}
          style={{
            display: imageLoaded ? 'block' : 'none',
            width,
            height: imgHeight,
            background: 'transparent',
          }}
        />
        {!imageLoaded && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width,
              height: imgHeight,
            }}
          >
            <ClipLoader color={color} size={`${loaderSize}px`} />
          </div>
        )}
        <a
          id="test-test"
          href="http://localhost:8080"
          style={{
            justifyContent: 'center',
            textAlign: 'center',
            boxSizing: 'border-box',
            marginTop: buffer,
            marginBottom: buffer,
            color,
            fontFamily: ['Titillium Web', 'sans-serif'],
            fontSize,
          }}
        >
          {`Link: ${name}`}
        </a>
        <button
          type="button"
          style={{
            cursor: 'pointer',
            boxSizing: 'border-box',
            width,
            padding: buffer,
            color: 'white',
            boxShadow: 'none',
            border: 0,
            background: color,
            fontFamily: ['Titillium Web', 'sans-serif'],
            fontSize,
          }}
          onClick={this.handleButtonClick}
        >
          {`Button: ${name}`}
        </button>
      </div>
    );
  }
}

DemoItemComponent.propTypes = {
  styles: PropTypes.object,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  imageNumber: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

DemoItemComponent.defaultProps = {
  styles: {},
};

export default DemoItemComponent;
