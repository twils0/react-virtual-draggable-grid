import React from 'react';
import WebFont from 'webfontloader';

import ItemComponent from './DemoItemComponent';
import Checkbox from './Checkbox';
import Input from './Input';
import VirtualDraggableGrid from '../../src/VirtualDraggableGrid';

const colorArray = [
  '#1b85b8',
  '#559e83',
  '#ae5a41',
  '#7bb3ff',
  '#83adb5',
  '#5e3c58',
  '#2e4045',
  '#aa6f73',
  '#eea990',
  '#295f48',
  '#0c457d',
  '#80bf80',
  '#a3709a',
];

const rand = max => Math.floor(Math.random() * max);

class Demo extends React.Component {
  constructor(props) {
    super(props);

    WebFont.load({
      google: {
        families: ['Titillium Web'],
      },
    });

    this.count = 0;

    const x = 10;
    const y = 10;

    this.state = {
      items: [],
      x,
      y,
      fixedWidthAll: 250,
      fixedHeightAll: 325,
      gutterX: 20,
      gutterY: 20,
      leeway: 0.1,
      scrollBufferX: 500,
      scrollBufferY: 500,
      onlyDragElements: '',
      noDragElements: 'button, a',
      fixedRows: false,
      fixedColumns: false,
      fixedWidthAllBool: false,
      fixedHeightAllBool: false,
    };

    const items = this.generateItems({ x, y });

    this.state.items = items;
  }

  componentDidUpdate(prevProps, prevState) {
    this.updateItems(prevState);
  }

  itemObject = () => {
    const { fixedWidthAll, fixedHeightAll } = this.state;
    this.count += 1;

    const width = this.count % 2 === 0 ? fixedWidthAll : fixedWidthAll + 50;
    const height = this.count % 2 === 0 ? fixedHeightAll : fixedHeightAll + 50;

    return {
      key: `item-${this.count}`,
      ItemComponent,
      itemProps: {
        name: `Item-${this.count}`,
        imageNumber: rand(1000),
        color: colorArray[rand(colorArray.length)],
        width,
        height,
      },
      fixedWidth: width,
      fixedHeight: height,
    };
  };

  generateItems = ({ x, y }) => {
    const items = [];

    if (x > 0 && y > 0) {
      for (let iY = 0; iY < y; iY += 1) {
        const row = [];
        items.push(row);
        for (let iX = 0; iX < x; iX += 1) {
          const newItem = this.itemObject();
          row.push(newItem);
        }
      }
    }

    return items;
  };

  updateItems = (prevState) => {
    const { x, y } = this.state;

    if (x !== prevState.x || y !== prevState.y) {
      this.count = 0;
      const items = this.generateItems({ x, y });

      this.setState({ items });
    }
  };

  addItem = () => {
    const { items } = this.state;
    const newItem = this.itemObject();
    const firstRow = [newItem, ...items[0]];
    items[0] = firstRow;

    this.setState({ items });
  };

  removeItem = () => {
    const { items } = this.state;
    const firstRow = [...items[0]];
    items[0] = firstRow.slice(1);

    this.setState({ items });
  };

  getItems = (newItems) => {
    this.setState({ items: newItems });
  };

  getVisibleItems = (items) => {
    console.log(items.length);
  };

  toggleCheckbox = (event) => {
    if (event && event.target) {
      const { id } = event.target;

      if (id) {
        this.setState(prevState => ({
          [id]: !prevState[id],
        }));
      }
    }
  };

  handleInput = (event) => {
    if (event && event.target) {
      const { id } = event.target;

      if (id) {
        const convertNumbers = [
          'x',
          'y',
          'fixedWidthAll',
          'fixedHeightAll',
          'gutterX',
          'gutterY',
          'leeway',
          'scrollBufferX',
          'scrollBufferY',
        ];

        const { value } = event.target;
        value.replace(/[^A-Za-z0-9.]/g, '');

        if (/\./g.test(value)) {
          this.setState({ [id]: value });
        } else if (convertNumbers.indexOf(id) > -1) {
          const num = Number(value);

          if (!Number.isNaN(num) && (id !== 'x' || num <= 100) && (id !== 'y' || num <= 100)) {
            this.setState({ [id]: num });
          }
        } else {
          this.setState({ [id]: value });
        }
      }
    }
  };

  convertToArray = str => str
    .replace(/\s/g, '')
    .split(',')
    .filter(notEmpty => notEmpty);

  render() {
    const {
      x,
      y,
      fixedWidthAll,
      fixedHeightAll,
      gutterX,
      gutterY,
      leeway,
      scrollBufferX,
      scrollBufferY,
      onlyDragElements,
      noDragElements,
      fixedRows,
      fixedColumns,
      fixedWidthAllBool,
      fixedHeightAllBool,
    } = this.state;
    const width = '100%';
    const height = '100%';
    const buffer = 20;

    return (
      <div
        style={{
          width: `calc(${width} - ${buffer * 2}px`,
          height: `calc(${height} - ${buffer * 2}px`,
          margin: buffer,
          fontFamily: ['Titillium Web', 'sans-serif'],
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: buffer }}>react-virtual-draggable-grid</h1>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ flex: '0 0 auto', marginRight: buffer }}>
            <Input id="x" label="Number of Rows (max: 100)" value={x} onChange={this.handleInput} />
            <Input
              id="y"
              label="Number of Columns (max: 100)"
              value={y}
              onChange={this.handleInput}
            />
          </div>
          <div style={{ flex: '0 0 auto', marginRight: buffer }}>
            <Input
              id="fixedWidthAll"
              label="Fixed Width All"
              value={fixedWidthAll}
              onChange={this.handleInput}
            />
            <Input
              id="fixedHeightAll"
              label="Fixed Height All"
              value={fixedHeightAll}
              onChange={this.handleInput}
            />
          </div>
          <div style={{ flex: '0 0 auto', marginRight: buffer }}>
            <Input id="gutterX" label="Gutter X" value={gutterX} onChange={this.handleInput} />
            <Input id="gutterY" label="Gutter Y" value={gutterY} onChange={this.handleInput} />
          </div>
          <div style={{ flex: '0 0 auto', marginRight: buffer }}>
            <Input id="leeway" label="Leeway" value={leeway} onChange={this.handleInput} />
            <Input
              id="scrollBufferX"
              label="Scroll Buffer X"
              value={scrollBufferX}
              onChange={this.handleInput}
            />
            <Input
              id="scrollBufferY"
              label="Scroll Buffer Y"
              value={scrollBufferY}
              onChange={this.handleInput}
            />
          </div>
          <div style={{ flex: '0 0 auto', marginRight: buffer }}>
            <Input
              id="onlyDragElements"
              label="Only Drag Elements"
              value={onlyDragElements}
              onChange={this.handleInput}
            />
            <Input
              id="noDragElements"
              label="No Drag Elements"
              value={noDragElements}
              onChange={this.handleInput}
            />
          </div>
        </div>
        <div>
          <div style={{ flex: '0 0 auto', marginRight: buffer }}>
            <Checkbox
              id="fixedRows"
              label="Fixed Rows"
              checked={fixedRows}
              onChange={this.toggleCheckbox}
            />
            <Checkbox
              id="fixedColumns"
              label="Fixed Columns"
              checked={fixedColumns}
              onChange={this.toggleCheckbox}
            />
          </div>
          <div style={{ flex: '0 0 auto', marginRight: buffer }}>
            <Checkbox
              id="fixedWidthAllBool"
              label="Fixed Width All"
              checked={fixedWidthAllBool}
              onChange={this.toggleCheckbox}
            />
            <Checkbox
              id="fixedHeightAllBool"
              label="Fixed Height All"
              checked={fixedHeightAllBool}
              onChange={this.toggleCheckbox}
            />
          </div>
        </div>
        <div>
          <button
            type="button"
            style={{
              curser: 'pointer',
              width: 100,
              height: 50,
              margin: buffer,
              marginLeft: 0,
              boxShadow: 'none',
              border: 0,
              background: '#ccc',
              fontFamily: ['Titillium Web', 'sans-serif'],
              fontSize: 16,
            }}
            onClick={this.addItem}
          >
            Add
          </button>
          <button
            type="button"
            style={{
              curser: 'pointer',
              width: 100,
              height: 50,
              margin: buffer,
              marginLeft: 0,
              boxShadow: 'none',
              border: 0,
              background: '#ccc',
              fontFamily: ['Titillium Web', 'sans-serif'],
              fontSize: 16,
            }}
            onClick={this.removeItem}
          >
            Delete
          </button>
        </div>
        <VirtualDraggableGrid
          items={this.state.items}
          fixedRows={fixedRows}
          fixedColumns={fixedColumns}
          fixedWidthAll={fixedWidthAllBool ? fixedWidthAll : null}
          fixedHeightAll={fixedHeightAllBool ? fixedHeightAll : null}
          gutterX={gutterX}
          gutterY={gutterY}
          leeway={leeway}
          scrollBufferX={scrollBufferX}
          scrollBufferY={scrollBufferY}
          onlyDragElements={this.convertToArray(onlyDragElements)}
          noDragElements={this.convertToArray(noDragElements)}
          getItems={this.getItems}
          // getVisibleItems={this.getVisibleItems}
        />
      </div>
    );
  }
}

export default Demo;
