import React from 'react';
import PropTypes from 'prop-types';

import List from './List';

import handleOrder from './Functions/handleOrder';
import updatePositions from './Functions/updatePositions';
import testItemsUpdate from './Functions/testItemsUpdate';
import preventDrag from './Utilities/preventDrag';

class VirtualDraggableGrid extends React.Component {
  constructor(props) {
    super(props);

    const { items } = this.props;

    if (items && Array.isArray(items) && items.length > 0) {
      const { order, keys } = handleOrder({ items });

      this.state = {
        order,
        keys,
      };
    } else {
      this.state = {};
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { items } = props;
    const { order, keys } = state;

    if (
      items
      && Array.isArray(items)
      && items.length > 0
      && testItemsUpdate({ items, order, keys })
    ) {
      const orderKeysObject = handleOrder({
        items,
        order,
        keys,
      });

      return orderKeysObject;
    }

    return null;
  }

  updateOrderKeys = ({ order, keys }) => {
    this.setState({ order, keys });
  };

  updateSize = ({ key, width, height }) => {
    this.setState((prevState) => {
      const { order, keys } = prevState;
      const indexObject = keys[key];

      if (indexObject) {
        const { x, y } = indexObject;
        const orderRow = order[y];

        if (orderRow) {
          const orderObject = orderRow[x];

          if (orderObject) {
            order[y][x] = { ...orderObject, width, height };

            const updatedOrder = updatePositions({
              order,
              orderIndexX: x,
              orderIndexY: y,
            });

            const newState = { ...prevState, order: updatedOrder };

            return newState;
          }
        }
      } else {
        console.log('no size update', key);
      }

      return null;
    });
  };

  updateItems = () => {
    const { items } = this.props;
    const { order } = this.state;
    const newItems = [];

    order.forEach((orderRow, orderIndexY) => {
      const orderRowLen = orderRow.length;

      orderRow.forEach((orderObject, orderIndexX) => {
        const { itemIndexX, itemIndexY } = orderObject;
        const itemRow = items[itemIndexY];
        let item = null;

        if (itemRow && Array.isArray(itemRow)) {
          item = itemRow[itemIndexX];
        } else {
          item = itemRow;
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
      items, ListWrapperStyles, ListStyles, ListItemStyles, springSettings,
    } = this.props;
    const { order, keys } = this.state;

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
            keys={keys}
            ListStyles={ListStyles}
            listItem={ListItemStyles}
            springSettings={springSettings}
            renderListItemChildren={this.renderListItemChildren}
            updateSize={this.updateSize}
            updateOrderKeys={this.updateOrderKeys}
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
