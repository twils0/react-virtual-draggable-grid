/* eslint import/no-unresolved: 0 */
/* eslint no-unused-vars: 0 */

import React from 'react';
import PropTypes from 'prop-types';
import VirtualDraggableGrid from 'react-virtual-draggable-grid';

const ItemComponent = (props) => {
  const { name, styles } = props;

  return (
    <div
      style={{
        userSelect: 'none',
        border: '1px solid black',
        fontFamily: 'sans-serif',
        ...styles,
      }}
    >
      <p
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 0,
          width: '100%',
          height: '60%',
          fontSize: 18,
        }}
      >
        Draggable!
      </p>
      <button
        type="button"
        style={{
          cursor: 'pointer',
          boxSizing: 'border-box',
          width: '100%',
          height: '40%',
          boxShadow: 'none',
          border: 0,
          background: '#6b7782',
          fontSize: 18,
        }}
        onClick={() => console.log('clicked without initiating drag', name)}
      >
        {`Click ${name}`}
      </button>
    </div>
  );
};

ItemComponent.propTypes = {
  name: PropTypes.string.isRequired,
  styles: PropTypes.object,
};

ItemComponent.defaultProps = {
  styles: {},
};

class Grid extends React.Component {
  constructor(props) {
    super(props);

    const items = [
      [
        {
          key: 'item-1',
          fixedWidth: 100,
          fixedHeight: 100,
          ItemComponent,
          itemProps: {
            name: 'Item 1',
            styles: {
              width: '100%',
              height: '100%',
            },
          },
        },
        {
          key: 'item-2',
          fixedWidth: 200,
          fixedHeight: 200,
          ItemComponent,
          itemProps: {
            name: 'Item 2',
          },
        },
      ],
      {
        key: 'item-3',
        ItemComponent,
        fixedWidth: 300,
        fixedHeight: 300,
        itemProps: {
          name: 'Item 3',
          styles: {
            width: 300,
            height: 300,
          },
        },
      },
    ];

    this.state = { items };
  }

  // optional; RVDG works equally well as a controlled
  // or an uncontrolled component
  getItems = (items) => {
    this.setState({ items });
  };

  render() {
    return (
      <VirtualDraggableGrid
        items={this.state.items}
        noDragElements={['button']}
        gutterX={10}
        gutterY={10}
        getItems={this.getItems}
      />
    );
  }
}
