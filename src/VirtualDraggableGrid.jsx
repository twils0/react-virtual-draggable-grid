import React from 'react';
import PropTypes from 'prop-types';
import { deepEqual } from 'fast-equals';

import List from './List';

const getOrder = (items) => {
  const order = [];
  const keys = [];

  items.forEach((itemY, indexY) => {
    console.log(keys);
    if (itemY && typeof itemY === 'object' && itemY.constructor === Array) {
      const row = [];

      itemY.forEach((itemX, indexX) => {
        console.log(keys);
        if (
          itemX
          && typeof itemX === 'object'
          && (itemX.key !== null || itemX.key !== undefined)
          && keys.indexOf(itemX.key) === -1
        ) {
          keys.push(itemX.key);
          row.push(`${indexX},${indexY}`);
        }
      });

      order.push(row);
    } else if (
      itemY
      && typeof itemY === 'object'
      && (itemY.key !== null || itemY.key !== undefined)
      && keys.indexOf(itemY.key) === -1
    ) {
      keys.push(itemY.key);
      order.push([`0,${indexY}`]);
    }
  });

  console.log('getOrder', order);

  return order;
};

class VirtualDraggableGrid extends React.Component {
  constructor(props) {
    super(props);

    const { items } = this.props;

    if (items && typeof items === 'object' && items.constructor === Array && items.length > 0) {
      const order = getOrder(items);
      const copyItems = [...items];

      this.state = {
        items: copyItems,
        order,
      };
    } else {
      this.state = {};
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { items } = props;

    if (
      items
      && typeof items === 'object'
      && items.constructor === Array
      && !deepEqual(state.items, items)
    ) {
      const order = getOrder(items);
      const copyItems = JSON.parse(JSON.stringify(items));

      console.log('get derived', state.items, copyItems);

      return { items: copyItems, order };
    }

    return null;
  }

  updateOrder = (order) => {
    this.setState({ order });
  };

  updateItems = () => {
    const { items, order } = this.state;
    const newItems = [];

    console.log('items', items, order);

    order.forEach((orderRow, orderIndexY) => {
      orderRow.forEach((coordinate, orderIndexX) => {
        const [itemIndexX, itemIndexY] = coordinate.split(',');
        const row = items[itemIndexY];
        const orderRowLen = orderRow.length;
        let item = null;

        console.log(itemIndexX, itemIndexY, row, orderRow, orderRowLen);

        if (typeof row === 'object' && row.constructor === Array) {
          item = row[itemIndexX];
        } else {
          item = row;
        }

        if (orderRowLen === 1) {
          newItems[orderIndexY] = item;
        } else if (!newItems[orderIndexY]) {
          newItems[orderIndexY] = [];
          newItems[orderIndexY][orderIndexX] = item;
        } else {
          newItems[orderIndexY][orderIndexX] = item;
        }
      });
    });

    console.log('updateItems 2', newItems);

    this.props.getItems(newItems);
  };

  render() {
    const {
      maxColCount,
      maxRowCount,
      ListWrapperStyles,
      ListStyles,
      ListItemStyles,
      springSettings,
    } = this.props;
    const { items, order } = this.state;
    const rowWidth = 100;
    const rowHeight = 100;

    if (items && typeof items === 'object' && items.constructor === Array && items.length > 0) {
      return (
        <div
          className="rvdl-list-wrapper"
          style={{
            display: 'block',
            position: 'relative',
            boxSizing: 'border-box',
            height: '100%',
            width: '100%',
            ...ListWrapperStyles,
          }}
        >
          <List
            items={items}
            order={order}
            maxColCount={maxColCount}
            maxRowCount={maxRowCount}
            rowWidth={rowWidth}
            rowHeight={rowHeight}
            ListStyles={ListStyles}
            listItem={ListItemStyles}
            springSettings={springSettings}
            renderListItemChildren={this.renderListItemChildren}
            updateOrder={this.updateOrder}
            updateItems={this.updateItems}
          />
        </div>
      );
    }
    return null;
  }
}

VirtualDraggableGrid.propTypes = {
  items: PropTypes.array,
  maxColCount: PropTypes.number,
  maxRowCount: PropTypes.number,
  ListWrapperStyles: PropTypes.object,
  ListStyles: PropTypes.object,
  ListItemStyles: PropTypes.object,
  springSettings: PropTypes.shape({ stiffness: PropTypes.number, damping: PropTypes.number }),
  getItems: PropTypes.func,
};

VirtualDraggableGrid.defaultProps = {
  items: [],
  maxColCount: 0,
  maxRowCount: 0,
  ListWrapperStyles: {},
  ListStyles: {},
  ListItemStyles: {},
  springSettings: { stiffness: 300, damping: 50 },
  getItems: () => {},
};

export default VirtualDraggableGrid;
