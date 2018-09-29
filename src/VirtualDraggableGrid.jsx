import React from 'react';
import PropTypes from 'prop-types';
import { deepEqual } from 'fast-equals';

import List from './List';

import handleOrder from './OrderFunctions/handleOrder';
import updatePositions from './OrderFunctions/updatePositions';
import copyArray2d from './Utilities/copyArray2d';
import preventDrag from './Utilities/preventDrag';

class VirtualDraggableGrid extends React.Component {
  constructor(props) {
    super(props);

    const { items } = this.props;

    if (items && Array.isArray(items) && items.length > 0) {
      const itemsCopy = copyArray2d(items, 0, true);
      const order = handleOrder({ items: itemsCopy });

      this.state = {
        items: itemsCopy,
        order,
      };
    } else {
      this.state = {};
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { items } = props;

    if (items && Array.isArray(items) && !deepEqual(state.items, items)) {
      const { order } = state;
      const itemsCopy = copyArray2d(items, 0, true);

      const newOrder = handleOrder({
        items: itemsCopy,
        order,
      });

      return { items: itemsCopy, order: newOrder };
    }

    return null;
  }

  updateOrder = (order) => {
    this.setState({ order });
  };

  updateSize = ({
    orderIndexX, orderIndexY, width, height,
  }) => {
    this.setState((prevState) => {
      const { order } = prevState;
      const orderRow = order[orderIndexY];

      if (orderRow) {
        const orderObject = orderRow[orderIndexX];

        if (orderObject) {
          const newOrder = copyArray2d(order, orderIndexY, false);
          newOrder[orderIndexY][orderIndexX] = { ...orderObject, width, height };

          const updatedOrder = updatePositions({
            order: newOrder,
            orderIndexX,
            orderIndexY,
          });

          const newState = { ...prevState, order: updatedOrder };

          return newState;
        }
      }

      return null;
    });
  };

  updateItems = () => {
    const { items, order } = this.state;
    const newItems = [];

    order.forEach((orderRow, orderIndexY) => {
      orderRow.forEach((orderObject, orderIndexX) => {
        const { itemIndexX, itemIndexY } = orderObject;
        const row = items[itemIndexY];
        const orderRowLen = orderRow.length;
        let item = null;

        if (row && Array.isArray(row)) {
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

    this.props.getItems(newItems);
  };

  render() {
    const {
      ListWrapperStyles, ListStyles, ListItemStyles, springSettings,
    } = this.props;
    const { items, order } = this.state;

    if (items && Array.isArray(items) && items.length > 0) {
      return (
        <div
          className="rvdl-list-wrapper"
          style={{
            position: 'relative',
            display: 'block',
            userSelect: 'none',
            MozUserSelect: 'none',
            boxSizing: 'border-box',
            height: '100%',
            width: '100%',
            ...ListWrapperStyles,
          }}
          onDragStart={preventDrag}
        >
          <List
            items={items}
            order={order}
            ListStyles={ListStyles}
            listItem={ListItemStyles}
            springSettings={springSettings}
            renderListItemChildren={this.renderListItemChildren}
            updateSize={this.updateSize}
            updateOrder={this.updateOrder}
            updateItems={this.updateItems}
            onDragStart={preventDrag}
          />
        </div>
      );
    }
    return null;
  }
}

VirtualDraggableGrid.propTypes = {
  items: PropTypes.array,
  ListWrapperStyles: PropTypes.object,
  ListStyles: PropTypes.object,
  ListItemStyles: PropTypes.object,
  springSettings: PropTypes.shape({ stiffness: PropTypes.number, damping: PropTypes.number }),
  getItems: PropTypes.func,
};

VirtualDraggableGrid.defaultProps = {
  items: [],
  ListWrapperStyles: {},
  ListStyles: {},
  ListItemStyles: {},
  springSettings: { stiffness: 300, damping: 50 },
  getItems: () => {},
};

export default VirtualDraggableGrid;
