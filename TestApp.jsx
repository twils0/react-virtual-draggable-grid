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

    const items = [
      [
        {
          key: 'start-0',
          ItemComponent: TestComp,
          itemProps: { name: 'AAA', style: { width: 50, height: 200 } },
        },
        {
          key: 'start-1',
          ItemComponent: TestComp,
          itemProps: { name: 'BBB', style: { width: 100, height: 120 } },
        },
      ],
      {
        key: 'start-2',
        ItemComponent: TestComp,
        itemProps: { name: 'CCC', style: { width: 50, height: 60 } },
      },
    ];

    this.clicked = 0;
    this.state = { items };
  }

  getItems = (newItems) => {
    this.setState({ items: newItems });
  };

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <button
          type="button"
          style={{ width: 100, height: 100 }}
          onClick={() => {
            this.clicked += 1;
            const { items } = this.state;
            const arr = items[0];

            arr.push({
              key: `new-${this.clicked}`,
              ItemComponent: TestComp,
              itemProps: {
                name: `new-item-${this.clicked}`,
                style: { width: 50 + 2 * this.clicked, height: 50 + 2 * this.clicked },
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
            const arr = items[0];

            arr.pop();

            this.setState({ items });
          }}
        >
          Delete
        </button>
        <VirtualDraggableGrid
          items={this.state.items}
          // maxColCount={10}
          // maxRowCount={10}
          ListItemStyles={{ background: 'green' }}
          getItems={this.getItems}
        />
      </div>
    );
  }
}

export default TestApp;
