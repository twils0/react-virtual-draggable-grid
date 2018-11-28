import React from 'react';
import PropTypes from 'prop-types';

import Order from './Order/Order';
import Grid from './Grid';

import testItemsUpdate from './Functions/testItemsUpdate';
import preventDrag from './Utilities/preventDrag';

// entry component, handles the items 1D or 2D array;
// produces and manages state for the order RBT
// and hashTable
class VirtualDraggableGrid extends React.Component {
  constructor(props) {
    super(props);

    const {
      items, leeway, scrollBufferX, scrollBufferY,
    } = this.props;

    if (items && Array.isArray(items) && items.length > 0) {
      const { fixedRows, gutterX, gutterY } = this.props;

      // order not placed in state to allow for mutation
      this.order = new Order();

      this.order.fixedRows = fixedRows;
      this.order.gutterX = gutterX;
      this.order.gutterY = gutterY;

      // updates order's rbt and hashTable
      this.order.items = items;
    }

    this.state = {
      itemsBool: true,
      leeway, // eslint-disable-line react/no-unused-state
      scrollBufferX, // eslint-disable-line react/no-unused-state
      scrollBufferY, // eslint-disable-line react/no-unused-state
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { leeway, scrollBufferX, scrollBufferY } = props;
    const update = {};

    if (leeway !== state.leeway) {
      update.leeway = leeway;
    }
    if (scrollBufferX !== state.scrollBufferX) {
      update.scrollBufferX = scrollBufferX;
    }
    if (scrollBufferY !== state.scrollBufferY) {
      update.scrollBufferY = scrollBufferY;
    }

    if (Object.keys(update).length > 0) {
      return update;
    }

    return null;
  }

  componentDidUpdate() {
    const {
      items, fixedRows, gutterX, gutterY,
    } = this.props;

    if (!this.count) {
      this.count = 1;
    }

    if (
      this.count < 101
      && (this.order.fixedRows !== fixedRows
        || this.order.gutterX !== gutterX
        || this.order.gutterY !== gutterY
        || (items
          && Array.isArray(items)
          && items.length > 0
          && testItemsUpdate({
            items,
            order: this.order,
          })))
    ) {
      this.count += 1;

      this.order.fixedRows = fixedRows;
      this.order.gutterX = gutterX;
      this.order.gutterY = gutterY;

      // updates order's rbt and hashTable as well
      this.order.setItems(items);

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ itemsBool: true });
    }
  }

  handleItemsBool = () => {
    this.setState({ itemsBool: false });
  };

  // callback to return a 1D or 2D array of reordered items;
  // some items may have been ignored when initially processed
  // by handleOrder above, and these items will not be included below
  updateItems = () => {
    const { getItems } = this.props;

    if (typeof getItems === 'function') {
      const { newItems } = this.order;

      getItems(newItems);
    }
  };

  render() {
    const { items } = this.props;

    if (items && Array.isArray(items) && items.length > 0) {
      const {
        WrapperStyles,
        fixedRows,
        onlyDragElements,
        onlyDragIds,
        noDragElements,
        noDragIds,
        gutterX,
        gutterY,
        mouseUpdateTime,
        mouseUpdateX,
        mouseUpdateY,
        leeway,
        scrollBufferX,
        scrollBufferY,
        scrollUpdateX,
        scrollUpdateY,
        transitionDuration,
        transitionTimingFunction,
        transitionDelay,
        shadowMultiple,
        shadowHRatio,
        shadowVRatio,
        shadowBlur,
        shadowBlurRatio,
        shadowSpread,
        shadowSpreadRatio,
        shadowColor,
        GridStyles,
        GridItemStyles,
        getVisibleItems,
      } = this.props;
      const { itemsBool } = this.state;
      const { order } = this;

      return (
        <div
          className="rvdl-wrapper"
          style={{
            height: '100%',
            width: '100%',
            margin: 0,
            padding: 0,
            ...WrapperStyles,
            display: 'block',
            position: 'relative',
            userSelect: 'none',
            MozUserSelect: 'none',
            boxSizing: 'border-box',
          }}
          onDragStart={preventDrag}
        >
          <Grid
            items={items}
            order={order}
            itemsBool={itemsBool}
            fixedRows={fixedRows}
            onlyDragElements={onlyDragElements}
            onlyDragIds={onlyDragIds}
            noDragElements={noDragElements}
            noDragIds={noDragIds}
            gutterX={gutterX}
            gutterY={gutterY}
            mouseUpdateTime={mouseUpdateTime}
            mouseUpdateX={mouseUpdateX}
            mouseUpdateY={mouseUpdateY}
            leeway={leeway}
            scrollBufferX={scrollBufferX}
            scrollBufferY={scrollBufferY}
            scrollUpdateX={scrollUpdateX}
            scrollUpdateY={scrollUpdateY}
            transitionDuration={transitionDuration}
            transitionTimingFunction={transitionTimingFunction}
            transitionDelay={transitionDelay}
            shadowMultiple={shadowMultiple}
            shadowHRatio={shadowHRatio}
            shadowVRatio={shadowVRatio}
            shadowBlur={shadowBlur}
            shadowBlurRatio={shadowBlurRatio}
            shadowSpread={shadowSpread}
            shadowSpreadRatio={shadowSpreadRatio}
            shadowColor={shadowColor}
            GridStyles={GridStyles}
            GridItemStyles={GridItemStyles}
            handleItemsBool={this.handleItemsBool}
            updateOrder={this.updateOrder}
            updateItems={this.updateItems}
            getVisibleItems={getVisibleItems}
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
  gutterX: PropTypes.number,
  gutterY: PropTypes.number,
  fixedRows: PropTypes.bool,
  onlyDragElements: PropTypes.array,
  onlyDragIds: PropTypes.array,
  noDragElements: PropTypes.array,
  noDragIds: PropTypes.array,
  mouseUpdateTime: PropTypes.number,
  mouseUpdateX: PropTypes.number,
  mouseUpdateY: PropTypes.number,
  leeway: PropTypes.number,
  scrollBufferX: PropTypes.number,
  scrollBufferY: PropTypes.number,
  scrollUpdateX: PropTypes.number,
  scrollUpdateY: PropTypes.number,
  transitionDuration: PropTypes.string,
  transitionTimingFunction: PropTypes.string,
  transitionDelay: PropTypes.string,
  shadowMultiple: PropTypes.number,
  shadowHRatio: PropTypes.number,
  shadowVRatio: PropTypes.number,
  shadowBlur: PropTypes.number,
  shadowBlurRatio: PropTypes.number,
  shadowSpread: PropTypes.number,
  shadowSpreadRatio: PropTypes.number,
  shadowColor: PropTypes.string,
  WrapperStyles: PropTypes.object,
  GridStyles: PropTypes.object,
  GridItemStyles: PropTypes.object,
  getItems: PropTypes.func,
  getVisibleItems: PropTypes.func,
};

VirtualDraggableGrid.defaultProps = {
  items: [],
  fixedRows: false,
  onlyDragElements: [],
  onlyDragIds: [],
  noDragElements: [],
  noDragIds: [],
  gutterX: 0,
  gutterY: 0,
  mouseUpdateTime: 100,
  mouseUpdateX: 50,
  mouseUpdateY: 50,
  leeway: 0.1,
  scrollBufferX: 100,
  scrollBufferY: 100,
  scrollUpdateX: 100,
  scrollUpdateY: 100,
  transitionDuration: '0.3s',
  transitionTimingFunction: 'ease',
  transitionDelay: '0.2s',
  shadowMultiple: 16,
  shadowHRatio: 1,
  shadowVRatio: 1,
  shadowBlur: null,
  shadowBlurRatio: 1.2,
  shadowSpread: null,
  shadowSpreadRatio: 0,
  shadowColor: 'rgba(0, 0, 0, 0.2)',
  WrapperStyles: {},
  GridStyles: {},
  GridItemStyles: {},
  getItems: null,
  getVisibleItems: null,
};

export default VirtualDraggableGrid;
