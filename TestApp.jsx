import React from 'react';
import PropTypes from 'prop-types';

import VirtualDraggableGrid from './src/VirtualDraggableGrid';

const TestComp = (props) => {
  const { styles, name } = props;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignText: 'center',
        userSelect: 'none',
        width: '50px',
        height: '50px',
        backgroundColor: 'lightblue',
        border: '1px solid black',
        ...styles,
      }}
    >
      <a id="test-test" href="http://localhost:8080">{`Test Link ${name}`}</a>
      <button
        type="button"
        style={{
          alignSelf: 'center',
          width: '60%',
          height: '50%',
          boxSizing: 'border-box',
        }}
        onClick={() => console.log('test click', name)}
      >
        {`Test Button
        ${name}`}
      </button>
    </div>
  );
};

TestComp.propTypes = {
  styles: PropTypes.object,
  name: PropTypes.string.isRequired,
};

TestComp.defaultProps = {
  styles: {},
};

class TestApp extends React.Component {
  constructor(props) {
    super(props);
    const x = 100;
    const y = 100;

    const items = [];
    let count = 0;

    for (let iY = 0; iY <= y; iY += 1) {
      const row = [];
      items.push(row);
      for (let iX = 0; iX <= x; iX += 1) {
        const width = iX % 2 ? 200 : 100;
        const height = iY % 2 ? 200 : 100;
        row.push({
          key: `start-${count}`,
          ItemComponent: TestComp,
          fixedWidth: width,
          fixedHeight: height + 10,
          itemProps: {
            name: `start-${count}`,
            styles: {
              userSelect: 'none',
              width,
              height,
            },
          },
        });

        count += 1;
      }
    }

    this.clicked = 0;
    this.state = { items };
  }

  getItems = (newItems) => {
    this.setState({ items: newItems });
  };

  getVisibleItems = (items) => {
    console.log(items.length);
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
                styles: {
                  width: `${50 + 5 * this.clicked}px`,
                  height: `${50 + 5 * this.clicked}px`,
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
          fixedRows
          // fixedColumns
          // fixedWidthAll={100}
          fixedHeightAll={100}
          // gutterX={15}
          gutterY={25}
          noDragElements={['button', 'a']}
          WrapperStyles={{ margin: 20 }}
          getItems={this.getItems}
          // getVisibleItems={this.getVisibleItems}
        />
      </div>
    );
  }
}

export default TestApp;
