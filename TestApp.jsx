import React from 'react';

import VirtualDraggableGrid from './src/VirtualDraggableGrid';

class TestApp extends React.Component {
  constructor(props) {
    super(props);
    let items = window.sessionStorage.getItem('items');

    if (!items) {
      items = [[{ key: 0, name: 'AAA' }, { key: 1, name: 'BBB' }], { key: 2, name: 'CCC' }];
    } else {
      items = JSON.parse(items);
    }

    this.state = { items };
  }

  getItems = (newItems) => {
    this.setState({ items: [...newItems] });
    window.sessionStorage.setItem('items', JSON.stringify(newItems));
  };

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <button
          type="button"
          style={{ width: 100, height: 100 }}
          onClick={() => {
            const { items } = this.state;

            items.push({ key: items.length + 100, name: `new-item-${items.length + 100}` });

            this.setState({ items });
          }}
        >
          TEST1
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
