import React from 'react';
import PropTypes from 'prop-types';

import VirtualDraggableGrid from './src/VirtualDraggableGrid';

const TestComp = props => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignText: 'center',
      userSelect: 'none',
      width: '50px',
      height: '50px',
      backgroundColor: 'lightblue',
      border: '1px solid black',
      ...props.style,
    }}
  >
    {`Test ${props.name}`}
  </div>
);

TestComp.propTypes = {
  style: PropTypes.object,
  name: PropTypes.string.isRequired,
};

TestComp.defaultProps = {
  style: {},
};

class TestApp extends React.Component {
  constructor(props) {
    super(props);
    const x = 5;
    const y = 4;

    const items = [];

    for (let iY = 0; iY <= y; iY += 1) {
      const row = [];
      items.push(row);
      for (let iX = 0; iX <= x; iX += 1) {
        row.push({
          key: `start-${iX}${iY}`,
          ItemComponent: TestComp,
          itemProps: {
            name: `start-${iX}${iY}`,
            style: { userSelect: 'none', width: 100 + iX * 10, height: 200 + iY * 10 },
          },
        });
      }
    }

    this.clicked = 0;
    this.state = { items };
  }

  getItems = (newItems) => {
    this.setState({ items: newItems });
  };

  render() {
    return (
      <div style={{ width: '75%', height: '75%' }}>
        <button
          type="button"
          style={{ width: 100, height: 100 }}
          onClick={() => {
            this.clicked += 1;
            const { items } = this.state;
            const arr = [...items[0]];
            items[0] = arr;

            arr.push({
              key: `new-${this.clicked}`,
              ItemComponent: TestComp,
              itemProps: {
                name: `new-item-${this.clicked}`,
                style: {
                  width: `${50 + 2 * this.clicked}px`,
                  height: `${50 + 2 * this.clicked}px`,
                },
              },
            });

            this.setState({ items });
          }}
        >
          Add
        </button>
        <button
          type="button"
          style={{ width: 100, height: 100 }}
          onClick={() => {
            const { items } = this.state;
            const arr = [...items[0]];
            items[0] = arr;

            arr.pop();

            this.setState({ items });
          }}
        >
          Delete
        </button>
        <VirtualDraggableGrid
          items={this.state.items}
          ListWrapperStyles={{ margin: 50 }}
          getItems={this.getItems}
        />
      </div>
    );
  }
}

export default TestApp;
