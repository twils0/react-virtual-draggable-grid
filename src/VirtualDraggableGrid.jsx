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

    if (items && typeof items === 'object' && items.constructor === Array && items.length > 0) {
      const order = handleOrder(items);
      const itemsCopy = copyArray2d(items, true);

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

    if (
      items
      && typeof items === 'object'
      && items.constructor === Array
      && !deepEqual(state.items, items)
    ) {
      const order = handleOrder(items);
      const itemsCopy = copyArray2d(items, true);

      return { items: itemsCopy, order };
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
      const row = order[orderIndexY];

      if (row) {
        const orderObject = order[orderIndexX];

        if (orderObject) {
          const newOrder = copyArray2d(order, false);

          const updatedOrder = updatePositions({
            order: newOrder,
            width,
            height,
            indexX: orderIndexX,
            indexY: orderIndexY,
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
        const {
          itemIndexX, itemIndexY, width, height,
        } = orderObject;
        const row = items[itemIndexY];
        const orderRowLen = orderRow.length;
        let item = null;
        let newItem = null;

        if (typeof row === 'object' && row.constructor === Array) {
          item = row[itemIndexX];
        } else {
          item = row;
        }

        // update estimatedWidth and estimatedHeight; if items object is passed back,
        // it will have an accurate estimate for width and height
        if (item.estimatedWidth !== width || item.estimatedHeight !== height) {
          newItem = { ...item, estimatedWidth: width, estimatedHeight: height };
        }

        if (orderRowLen === 1) {
          newItems[orderIndexY] = newItem || item;
        } else if (!newItems[orderIndexY]) {
          newItems[orderIndexY] = [];
          newItems[orderIndexY][orderIndexX] = newItem || item;
        } else {
          newItems[orderIndexY][orderIndexX] = newItem || item;
        }
      });
    });

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

    if (items && typeof items === 'object' && items.constructor === Array && items.length > 0) {
      return (
        <div
          className="rvdl-list-wrapper"
          style={{
            position: 'relative',
            display: 'block',
            userSelect: 'none',
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
            maxColCount={maxColCount}
            maxRowCount={maxRowCount}
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
