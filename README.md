# react-virtual-draggable-grid

react-virtual-draggable-grid is a heavily customizable, virtual, and draggable grid component. RVDG was inspired by the structure of react-motion, though it runs on pure CSS (inline styles) under the hood.

RVDG generally has no issue handling thousands of components. Tens of thousands of components may cause performance issues. Please visit the [Performance](#performance) section for optimization tips.

** Currently in Alpha - please do not hesitate to submit an issue **

- [Demo](https://twils0.github.io/react-virtual-draggable-grid/demo)
- [Getting Started](#getting-started)
- [Dependencies](#dependencies)
- [Installation](#installation)
- [Performance](#performance)
- [Documentation](#documentation)
- [Pipeline](#pipeline)

### Getting Started

[Getting Started Code Sandbox](https://codesandbox.io/s/1yljolm753)

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import VirtualDraggableGrid from 'react-virtual-draggable-grid';

const ItemComponent = props => {
  const { name, styles } = props;

  return (
    <div
      style={{
        userSelect: 'none',
        border: '1px solid black',
        fontFamily: 'sans-serif',
        background: '#91c6a6',
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
        {`Draggable ${name}!`}
      </p>
      <button
        type="button"
        style={{
          cursor: 'pointer',
          boxSizing: 'border-box',
          width: '100%',
          height: '40%',
          boxShadow: 'none',
          borderWidth: '1px 0 0 0',
          borderStyle: 'solid',
          borderColor: 'black',
          background: '#ccc',
          fontSize: 18,
        }}
        onClick={() => console.log('Clicked without initiating drag', name)}
      >
        {`Prevent Button Drag`}
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

    const item = {
      fixedWidth: 200,
      fixedHeight: 100,
      ItemComponent,
      itemProps: {
        styles: {
          width: 'calc(100% - 2px)',
          height: 'calc(100% - 2px)',
        },
      },
    };

    const x = 3;
    const y = 2;
    const items = [];

    for (let iY = 0; iY < y; iY += 1) {
      const row = [];
      items.push(row);
      for (let iX = 0; iX < x; iX += 1) {
        const newItem = { ...item };
        const incriment = iX + iY * x;
        const key = `item-${incriment}`;

        newItem.key = key;
        newItem.itemProps = { ...item.itemProps, name: key };
        newItem.fixedWidth = item.fixedWidth + 20 * incriment;
        newItem.fixedHeight = item.fixedHeight + 20 * incriment;

        row.push(newItem);
      }
    }

    this.state = { items };
  }

  // optional; RVDG works as a controlled
  // or an uncontrolled component
  getItems = items => {
    this.setState({ items });
  };

  render() {
    return (
      <div style={{ width: '100vw', height: '100vh', margin: 20 }}>
        <VirtualDraggableGrid
          items={this.state.items}
          noDragElements={['button']}
          gutterX={10}
          gutterY={10}
          scrollBufferX={300}
          scrollBufferY={300}
          getItems={this.getItems}
        />
      </div>
    );
  }
}
```

### Dependencies

react-virtual-draggable-grid currently has no dependencies, but react-transition-group may be added as a dependency, in the near future. It relies on React 16.3, or higher, and prop-types as peer dependencies.

### Installation

```console
npm i -S react-virtual-draggable-grid
```

Import the react-virtual-draggable-grid module:

```javascript
import VirtualDraggableGrid from 'react-virtual-draggable-grid';

/*--- or ---*/

var VirtualDraggableGrid = require('react-virtual-draggable-grid').default;
```

### Performance

RVDG's performance depends on several factors, including the total number of grid items, the average number of grid items rendered at one time, the complexity of the grid items, and the size of the grid.

Generally, virtual scrolling is not an issue. The dragging and repositioning of grid items may start to lag on grids with tens of thousands of grid items.

To combat performance issues, please consider the following options, in order of effectiveness:

- Mark fixedRows and fixedColumns props as true and set fixedWidthAll and fixedHeightAll props to a number greater than 0 - by far the most effective performance boost available;

- Use the production build of React;

- Reduce the average number of grid items rendered at one time, using leeway, scrollBufferX, and/or scrollBufferY - use getVisibleItems callback to check the number of grid items rendered at any given time;

- Mark fixedRows and fixedColumns props as true;

- Set fixedWidthAll and fixedHeightAll props;

- Reduce the average number of grid updates when dragging grid items, using mouseUpdateTime, mouseUpdateX, and mouseUpdateY;

- Increase the delay before grid items change positions, using transitionDelay;

- Use RVDG as an uncontrolled component, with regard to the items 1D or 2D array; the getItems callback is used to track position changes in the items array, but it is not necessary to pass back the updated items array on each update (in a controlled component fashion);

- Avoid unnecessary callbacks, by using getVisibleItems callback sparingly;

## Documentation

- items: (1D or 2D array of objects) each item object represents a grid item and should include only the required and optional props listed below; if an item object is missing any required props, it will be ignored;

  - key: (required; string) a unique key must be provided for each grid item;
  - fixedWidth: (required; number) set a fixed width for ItemComponent;
  - fixedHeight: (required; number) set a fixed height for ItemComponent;
  - ItemComponent: (required; React function or class component) this component will be rendered as a grid item;
  - itemProps: (object) this object will be passed as props to ItemComponent;

- gutterX (number; default: 0): add a space between the right and left of each grid items; a space is not added between grid items and the edge of the grid;

- gutterY: (number; default: 0) add a space between the bottom and top of each grid item; a space is not added between grid items and the edge of the grid;

- fixedRows: (boolean; default: false) row height will be determined by the grid item with the greatest height in each row; grid items will no longer gravitate toward the top of the screen;

- fixedColumns: (boolean; default: false) column width will be determined by the grid item with the greatest width in each column;

- fixedWidthAll: (number) set a fixed width for all grid items;

- fixedHeightAll: (number) set a fixed height for all grid items;

- onlyDragElements: (array of strings) an array of HTML element names; only elements listed in this array will be allows to initiate drag events; in other words, these elements will act as drag handles for all grid items

- onlyDragIds: (array of strings) an array of ids; only components with an id prop listed in this array will be allowed to initiate drag events; in other words, these components will act as drag handles for all grid items

- noDragElements: (array of strings) an array of HTML element names; elements listed in this array will not be allows to initiate drag events; this prop helps prevent unwanted drag events, accidentally initiated when the user clicks a button on a grid item, for instance;

- noDragIds: (array of strings) an array of HTML element names; elements listed in this array will not be allows to initiate drag events; this prop helps prevent unwanted drag events, accidentally initiated when the user clicks a button on a grid item, for instance;

- mouseUpdateTime: (number; default: 100) set a minimum, millisecond time interval for how often mouse or touch drag events can update the grid;

- mouseUpdateX: (number; default: 50) set a minimum, x-axis distance in pixels for how far mouse or touch events must drag a grid item before the grid updates;

- mouseUpdateY: (number; default: 50) set a minimum, y-axis distance in pixels for how far mouse or touch events must drag a grid item before the grid updates;

- leeway: (number; default: 0.1) expand the boundary of the virtual area within which the grid will render grid items, using a multiple of the container width and height; for instance, 0.1 will expand the boundary by 20% of the container width, 10% on the left, 10% on the right, and 20% of the container height, 10% on the top, 10% on the bottom;

- scrollBufferX: (number; default: 100) expand the boundary of the virtual area within which the grid will render grid items, using a fixed value; for instance, 100 will expand the container width by 200px, 100px on the left, 100px on the right;

- scrollBufferY: (number; default: 100) expand the boundary of the virtual area within which the grid will render grid items, using a fixed value; for instance, 100 will expand the container height by 200px, 100px on the top, 100px on the bottom;

- scrollUpdateX: (number; default: 100) set a minimum, x-axis distance in pixels for how far a container must scroll before the grid updates;

- scrollUpdateY: (number; default: 100) set a minimum, y-axis distance in pixels for how far a container must scroll before the grid updates;

- transitionDuration: (string; default: '0.3s') set the number of seconds transitions will take; this value is used across all CSS transitions for dragging, resizing, box-shadow, etc.

- transitionTimingFunction: (string; default: 'ease') set the timing function used for transitions; this value is used across all CSS transitions for dragging, resizing, box-shadow, etc.

- transitionDelay: (string; default: '0.2s') set the number of seconds before a transition will begin; this value is used across all CSS transitions for dragging, resizing, box-shadow, etc.

- shadowMultiple: (number; default: 16) set the multiple used to calculate the box-shadow for all grid items; all shadow-related ratios below will be multipled by this value; for instance, the box-shadow h-offset property of all grid components defaults to 16 (shadowMultiple) \* 1 (shadowHRatio), or 16px;

- shadowHRatio: (number; default: 1) set the ratio, which will be multipled by the shadowMultiple prop, to determine the box-shadow h-offset property for all grid items;

- shadowVRatio: (number; default: 1) set the ratio, which will be multipled by the shadowMultiple prop, to determine the box-shadow v-offset property for all grid items;

- shadowBlur: (number) set the box-shadow blur property directly, in pixels, for all grid items; this props will take precedence over shadowBlurRatio;

- shadowBlurRatio: (number; default: 1.2) set the ratio, which will be multipled by the shadowMultiple prop, to determine the box-shadow blur property for all grid items;

- shadowSpread: (number) set the box-shadow spread property directly, in pixels, for all grid items; this props will take precedence over shadowSpreadRatio;

- shadowSpreadRatio: (number; default: 0) set the ratio, which will be multipled by the shadowMultiple prop, to determine the box-shadow spread property for all grid items;

- shadowColor: (string; default: 'rgba(0, 0, 0, 0.2)') set the box-shadow color property for all grid items;

- WrapperStyles: (object) set custom styles for the div wrapping the grid;

- GridStyles: (object) set custom styles for the grid;

- GridItemStyles: (object) set custom styles for each grid item;

- getItems: (function) callback returning a new items array, each time the

- getVisibleItems: (function) callback returning visible grid items, each time the grid updates;

### Pipeline

- add enter and exit transitions for grid items, using react-transition-group

### License

This project is licensed under the Apache 2.0 License. Please see the [LICENSE](LICENSE) file.
