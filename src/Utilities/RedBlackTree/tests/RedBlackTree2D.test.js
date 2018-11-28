import RBT2D from '../RedBlackTree2D';
import Interval1D from '../Interval1D';

describe('RedBlackTree2D', () => {
  it('correctly adds and gets an array of values 1', () => {
    const rbt2D = new RBT2D();
    const intervalX = new Interval1D(0, 100);
    const intervalY = new Interval1D(0, 100);
    const value1 = { key: 'testValue1' };

    rbt2D.add(intervalX, intervalY, value1);

    const array = [value1];

    const maxInterval = new Interval1D(0, 100);

    const expectedCoordinatesResult = {
      left: 0,
      right: 100,
      top: 0,
      bottom: 100,
      value: value1,
    };

    expect(rbt2D.getIntervalsNodeValues(maxInterval, maxInterval)).toEqual(array);
    expect(rbt2D.getCoordinates(50, 50)).toEqual(expectedCoordinatesResult);
    expect(rbt2D.size).toEqual(1);
    expect(rbt2D.maxX).toEqual(100);
    expect(rbt2D.maxY).toEqual(100);
    expect(rbt2D.findIntervalYMaxX(maxInterval)).toEqual(100);
    expect(rbt2D.findIntervalXMaxY(maxInterval)).toEqual(100);
  });

  it('correctly adds and gets an array of values 2', () => {
    const rbt2D = new RBT2D();
    const value1 = { key: 'testValue1' };
    const value2 = { key: 'testValue2' };
    const value3 = { key: 'testValue3' };

    rbt2D.add(new Interval1D(0, 100), new Interval1D(0, 100), value1);
    rbt2D.add(new Interval1D(100, 200), new Interval1D(150, 200), value2);
    rbt2D.add(new Interval1D(200, 300), new Interval1D(200, 300), value3);

    const array = [value2, value1];

    const maxInterval = new Interval1D(0, 200);

    const expectedCoordinatesResult = {
      left: 200,
      right: 300,
      top: 300,
      bottom: -1,
      value: null,
    };

    expect(rbt2D.getIntervalsNodeValues(maxInterval, maxInterval)).toEqual(array);
    expect(rbt2D.getCoordinates(260, 350)).toEqual(expectedCoordinatesResult);
    expect(rbt2D.size).toEqual(3);
    expect(rbt2D.maxX).toEqual(300);
    expect(rbt2D.maxY).toEqual(300);
    expect(rbt2D.findIntervalYMaxX(maxInterval)).toEqual(200);
    expect(rbt2D.findIntervalXMaxY(maxInterval)).toEqual(200);
  });

  it('correctly adds and gets an array of values, two matching intervalY fields 1', () => {
    const rbt2D = new RBT2D();
    const value1 = { key: 'testValue1' };
    const value2 = { key: 'testValue2' };
    const value3 = { key: 'testValue3' };
    const value4 = { key: 'testValue4' };
    const value5 = { key: 'testValue5' };

    rbt2D.add(new Interval1D(0, 100), new Interval1D(0, 100), value1);
    rbt2D.add(new Interval1D(100, 200), new Interval1D(0, 100), value2);
    rbt2D.add(new Interval1D(200, 300), new Interval1D(200, 300), value3);
    rbt2D.add(new Interval1D(300, 400), new Interval1D(300, 400), value4);
    rbt2D.add(new Interval1D(400, 500), new Interval1D(400, 500), value5);

    const array = [value2, value1];

    const maxInterval = new Interval1D(0, 200);

    const expectedCoordinatesResult = {
      left: 200,
      right: 300,
      top: 200,
      bottom: 300,
      value: value3,
    };

    expect(rbt2D.getIntervalsNodeValues(maxInterval, maxInterval)).toEqual(array);
    expect(rbt2D.getCoordinates(260, 260)).toEqual(expectedCoordinatesResult);
    expect(rbt2D.size).toEqual(5);
    expect(rbt2D.maxX).toEqual(500);
    expect(rbt2D.maxY).toEqual(500);
    expect(rbt2D.findIntervalYMaxX(maxInterval)).toEqual(200);
    expect(rbt2D.findIntervalXMaxY(maxInterval)).toEqual(100);
  });

  it('correctly adds and deletes a value; get returns empty array', () => {
    const rbt2D = new RBT2D();
    const intervalX = new Interval1D(0, 100);
    const intervalY = new Interval1D(0, 100);
    const value = { key: 'testValue' };

    rbt2D.add(intervalX, intervalY, value);
    rbt2D.delete(intervalX, intervalY);

    const array = [];

    const expectedCoordinatesResult = {
      left: -1,
      right: -1,
      top: -1,
      bottom: -1,
      value: null,
    };

    expect(rbt2D.getIntervalsNodeValues(intervalX, intervalY)).toEqual(array);
    expect(rbt2D.getCoordinates(50, 50)).toEqual(expectedCoordinatesResult);
    expect(rbt2D.size).toEqual(0);
    expect(rbt2D.maxX).toEqual(-1);
    expect(rbt2D.maxY).toEqual(-1);
    expect(rbt2D.findIntervalYMaxX(intervalX)).toEqual(-1);
    expect(rbt2D.findIntervalXMaxY(intervalY)).toEqual(-1);
  });

  it('correctly adds and deletes a value; get returns values array', () => {
    const rbt2D = new RBT2D();
    const deleteIntervalX = new Interval1D(400, 500);
    const deleteIntervalY = new Interval1D(400, 500);
    const value1 = { key: 'testValue1' };
    const value2 = { key: 'testValue2' };
    const value3 = { key: 'testValue3' };
    const value4 = { key: 'testValue4' };
    const value5 = { key: 'testValue5' };

    rbt2D.add(new Interval1D(0, 100), new Interval1D(0, 100), value1);
    rbt2D.add(new Interval1D(100, 200), new Interval1D(150, 200), value2);
    rbt2D.add(new Interval1D(200, 300), new Interval1D(200, 300), value3);
    rbt2D.add(new Interval1D(300, 400), new Interval1D(300, 400), value4);
    rbt2D.add(deleteIntervalX, deleteIntervalX, value5);
    rbt2D.delete(deleteIntervalX, deleteIntervalY);

    const array = [value2, value1, value4, value3];

    const maxInterval = new Interval1D(0, 400);

    const expectedCoordinatesResult = {
      left: -1,
      right: -1,
      top: -1,
      bottom: 0,
      value: null,
    };

    expect(rbt2D.getIntervalsNodeValues(maxInterval, maxInterval)).toEqual(array);
    expect(rbt2D.getCoordinates(350, -100)).toEqual(expectedCoordinatesResult);
    expect(rbt2D.size).toEqual(4);
    expect(rbt2D.maxX).toEqual(400);
    expect(rbt2D.maxY).toEqual(400);
    expect(rbt2D.findIntervalYMaxX(maxInterval)).toEqual(400);
    expect(rbt2D.findIntervalXMaxY(maxInterval)).toEqual(400);
  });

  it('correctly adds and deletes a value; get returns values array, two matching intervalX fields 1', () => {
    const rbt2D = new RBT2D();
    const deleteIntervalX = new Interval1D(0, 100);
    const deleteIntervalY = new Interval1D(150, 200);
    const value1 = { key: 'testValue1' };
    const value2 = { key: 'testValue2' };
    const value3 = { key: 'testValue3' };
    const value4 = { key: 'testValue4' };
    const value5 = { key: 'testValue5' };

    rbt2D.add(new Interval1D(0, 100), new Interval1D(0, 100), value1);
    rbt2D.add(deleteIntervalX, deleteIntervalY, value2);
    rbt2D.add(new Interval1D(200, 300), new Interval1D(200, 300), value3);
    rbt2D.add(new Interval1D(300, 400), new Interval1D(300, 400), value4);
    rbt2D.add(new Interval1D(400, 500), new Interval1D(400, 500), value5);
    rbt2D.delete(deleteIntervalX, deleteIntervalY);

    const array = [value3, value1];

    const maxInterval = new Interval1D(0, 300);

    const expectedCoordinatesResult = {
      left: -1,
      right: 0,
      top: 400,
      bottom: 500,
      value: null,
    };

    expect(rbt2D.getIntervalsNodeValues(maxInterval, maxInterval)).toEqual(array);
    expect(rbt2D.getCoordinates(-100, 450)).toEqual(expectedCoordinatesResult);
    expect(rbt2D.size).toEqual(4);
    expect(rbt2D.maxX).toEqual(500);
    expect(rbt2D.maxY).toEqual(500);
    expect(rbt2D.findIntervalYMaxX(maxInterval)).toEqual(300);
    expect(rbt2D.findIntervalXMaxY(maxInterval)).toEqual(300);
  });

  it('correctly adds and deletes a value; get returns values array, two matching intervalX fields 2', () => {
    const rbt2D = new RBT2D();
    const deleteIntervalX = new Interval1D(300, 400);
    const deleteIntervalY = new Interval1D(150, 200);
    const value1 = { key: 'testValue1' };
    const value2 = { key: 'testValue2' };
    const value3 = { key: 'testValue3' };
    const value4 = { key: 'testValue4' };
    const value5 = { key: 'testValue5' };

    rbt2D.add(new Interval1D(0, 100), new Interval1D(0, 100), value1);
    rbt2D.add(deleteIntervalX, deleteIntervalY, value2);
    rbt2D.add(new Interval1D(200, 300), new Interval1D(200, 300), value3);
    rbt2D.add(new Interval1D(300, 400), new Interval1D(300, 400), value4);
    rbt2D.add(new Interval1D(400, 500), new Interval1D(400, 500), value5);
    rbt2D.delete(deleteIntervalX, deleteIntervalY);

    const array = [value4, value3, value1];

    const maxInterval = new Interval1D(0, 400);

    const expectedCoordinatesResult = {
      left: -1,
      right: 0,
      top: -1,
      bottom: 0,
      value: null,
    };

    expect(rbt2D.getIntervalsNodeValues(maxInterval, maxInterval)).toEqual(array);
    expect(rbt2D.getCoordinates(-100, -100)).toEqual(expectedCoordinatesResult);
    expect(rbt2D.size).toEqual(4);
    expect(rbt2D.maxX).toEqual(500);
    expect(rbt2D.maxY).toEqual(500);
    expect(rbt2D.findIntervalYMaxX(maxInterval)).toEqual(400);
    expect(rbt2D.findIntervalXMaxY(maxInterval)).toEqual(400);
  });

  it('correctly adds and deletes two values; get returns values array, one matching intervalX field', () => {
    const rbt2D = new RBT2D();
    const deleteIntervalX1 = new Interval1D(300, 400);
    const deleteIntervalY1 = new Interval1D(150, 200);
    const deleteIntervalX2 = new Interval1D(400, 500);
    const deleteIntervalY2 = new Interval1D(250, 300);
    const value1 = { key: 'testValue1' };
    const value2 = { key: 'testValue2' };
    const value3 = { key: 'testValue3' };
    const value4 = { key: 'testValue4' };
    const value5 = { key: 'testValue5' };

    rbt2D.add(new Interval1D(0, 100), new Interval1D(0, 100), value1);
    rbt2D.add(deleteIntervalX1, deleteIntervalY1, value2);
    rbt2D.add(new Interval1D(200, 300), new Interval1D(200, 300), value3);
    rbt2D.add(deleteIntervalX2, deleteIntervalY2, value4);
    rbt2D.add(new Interval1D(400, 500), new Interval1D(400, 500), value5);
    rbt2D.delete(deleteIntervalX1, deleteIntervalY1);
    rbt2D.delete(deleteIntervalX2, deleteIntervalY2);

    const array = [value3, value1];

    const maxInterval = new Interval1D(0, 400);

    const expectedCoordinatesResult = {
      left: 500,
      right: -1,
      top: 500,
      bottom: -1,
      value: null,
    };

    expect(rbt2D.getIntervalsNodeValues(maxInterval, maxInterval)).toEqual(array);
    expect(rbt2D.getCoordinates(600, 600)).toEqual(expectedCoordinatesResult);
    expect(rbt2D.size).toEqual(3);
    expect(rbt2D.maxX).toEqual(500);
    expect(rbt2D.maxY).toEqual(500);
    expect(rbt2D.findIntervalYMaxX(maxInterval)).toEqual(300);
    expect(rbt2D.findIntervalXMaxY(maxInterval)).toEqual(300);
  });

  it('correctly adds and deletes two values; get returns values array, two matching intervalX fields', () => {
    const rbt2D = new RBT2D();
    const deleteIntervalX1 = new Interval1D(200, 300);
    const deleteIntervalY1 = new Interval1D(150, 200);
    const deleteIntervalX2 = new Interval1D(400, 500);
    const deleteIntervalY2 = new Interval1D(250, 300);
    const value1 = { key: 'testValue1' };
    const value2 = { key: 'testValue2' };
    const value3 = { key: 'testValue3' };
    const value4 = { key: 'testValue4' };
    const value5 = { key: 'testValue5' };

    rbt2D.add(new Interval1D(0, 100), new Interval1D(0, 100), value1);
    rbt2D.add(deleteIntervalX1, deleteIntervalY1, value2);
    rbt2D.add(new Interval1D(200, 300), new Interval1D(200, 300), value3);
    rbt2D.add(deleteIntervalX2, deleteIntervalY2, value4);
    rbt2D.add(new Interval1D(400, 500), new Interval1D(400, 500), value5);
    rbt2D.delete(deleteIntervalX1, deleteIntervalY1);
    rbt2D.delete(deleteIntervalX2, deleteIntervalY2);

    const array = [value3, value1];

    const maxInterval = new Interval1D(0, 400);

    const expectedCoordinatesResult = {
      left: 500,
      right: -1,
      top: 0,
      bottom: 100,
      value: null,
    };

    expect(rbt2D.getIntervalsNodeValues(maxInterval, maxInterval)).toEqual(array);
    expect(rbt2D.getCoordinates(600, 50)).toEqual(expectedCoordinatesResult);
    expect(rbt2D.size).toEqual(3);
    expect(rbt2D.maxX).toEqual(500);
    expect(rbt2D.maxY).toEqual(500);
    expect(rbt2D.findIntervalYMaxX(maxInterval)).toEqual(300);
    expect(rbt2D.findIntervalXMaxY(maxInterval)).toEqual(300);
  });

  it('correctly adds and deletes a value; get returns values array, two matching intervalY fields 1', () => {
    const rbt2D = new RBT2D();
    const deleteIntervalX = new Interval1D(150, 200);
    const deleteIntervalY = new Interval1D(0, 100);
    const value1 = { key: 'testValue1' };
    const value2 = { key: 'testValue2' };
    const value3 = { key: 'testValue3' };
    const value4 = { key: 'testValue4' };
    const value5 = { key: 'testValue5' };

    rbt2D.add(new Interval1D(0, 100), new Interval1D(0, 100), value1);
    rbt2D.add(deleteIntervalX, deleteIntervalY, value2);
    rbt2D.add(new Interval1D(200, 300), new Interval1D(200, 300), value3);
    rbt2D.add(new Interval1D(300, 400), new Interval1D(300, 400), value4);
    rbt2D.add(new Interval1D(400, 500), new Interval1D(400, 500), value5);
    rbt2D.delete(deleteIntervalX, deleteIntervalY);

    const array = [value4, value3, value1];

    const maxInterval = new Interval1D(0, 400);

    const expectedCoordinatesResult = {
      left: 300,
      right: 400,
      top: 300,
      bottom: 400,
      value: value4,
    };

    expect(rbt2D.getIntervalsNodeValues(maxInterval, maxInterval)).toEqual(array);
    expect(rbt2D.getCoordinates(350, 350)).toEqual(expectedCoordinatesResult);
    expect(rbt2D.size).toEqual(4);
    expect(rbt2D.maxX).toEqual(500);
    expect(rbt2D.maxY).toEqual(500);
    expect(rbt2D.findIntervalYMaxX(maxInterval)).toEqual(400);
    expect(rbt2D.findIntervalXMaxY(maxInterval)).toEqual(400);
  });

  it('correctly adds and deletes a value; get returns values array, two matching intervalY fields 2', () => {
    const rbt2D = new RBT2D();
    const deleteIntervalX = new Interval1D(0, 200);
    const deleteIntervalY = new Interval1D(400, 500);
    const value1 = { key: 'testValue1' };
    const value2 = { key: 'testValue2' };
    const value3 = { key: 'testValue3' };
    const value4 = { key: 'testValue4' };
    const value5 = { key: 'testValue5' };

    rbt2D.add(new Interval1D(0, 100), new Interval1D(0, 100), value1);
    rbt2D.add(deleteIntervalX, deleteIntervalY, value2);
    rbt2D.add(new Interval1D(200, 300), new Interval1D(200, 300), value3);
    rbt2D.add(new Interval1D(300, 400), new Interval1D(300, 400), value4);
    rbt2D.add(new Interval1D(400, 500), new Interval1D(400, 500), value5);
    rbt2D.delete(deleteIntervalX, deleteIntervalY);

    const array = [value5, value4, value3, value1];

    const maxInterval = new Interval1D(0, 500);

    const expectedCoordinatesResult = {
      left: -1,
      right: -1,
      top: -1,
      bottom: -1,
      value: null,
    };

    expect(rbt2D.getIntervalsNodeValues(maxInterval, maxInterval)).toEqual(array);
    expect(rbt2D.getCoordinates(140, 140)).toEqual(expectedCoordinatesResult);
    expect(rbt2D.size).toEqual(4);
    expect(rbt2D.maxX).toEqual(500);
    expect(rbt2D.maxY).toEqual(500);
    expect(rbt2D.findIntervalYMaxX(maxInterval)).toEqual(500);
    expect(rbt2D.findIntervalXMaxY(maxInterval)).toEqual(500);
  });

  it('correctly adds and deletes two values; get returns values array, one matching intervalY field', () => {
    const rbt2D = new RBT2D();
    const deleteIntervalX1 = new Interval1D(150, 200);
    const deleteIntervalY1 = new Interval1D(200, 350);
    const deleteIntervalX2 = new Interval1D(300, 500);
    const deleteIntervalY2 = new Interval1D(200, 300);
    const value1 = { key: 'testValue1' };
    const value2 = { key: 'testValue2' };
    const value3 = { key: 'testValue3' };
    const value4 = { key: 'testValue4' };
    const value5 = { key: 'testValue5' };

    rbt2D.add(new Interval1D(0, 100), new Interval1D(0, 100), value1);
    rbt2D.add(deleteIntervalX1, deleteIntervalY1, value2);
    rbt2D.add(new Interval1D(200, 300), new Interval1D(200, 300), value3);
    rbt2D.add(deleteIntervalX2, deleteIntervalY2, value4);
    rbt2D.add(new Interval1D(400, 500), new Interval1D(400, 500), value5);
    rbt2D.delete(deleteIntervalX1, deleteIntervalY1);
    rbt2D.delete(deleteIntervalX2, deleteIntervalY2);

    const array = [value3, value1, value5];

    const maxInterval = new Interval1D(0, 500);

    const expectedCoordinatesResult = {
      left: 500,
      right: -1,
      top: -1,
      bottom: -1,
      value: null,
    };

    expect(rbt2D.getIntervalsNodeValues(maxInterval, maxInterval)).toEqual(array);
    expect(rbt2D.getCoordinates(550, 350)).toEqual(expectedCoordinatesResult);
    expect(rbt2D.size).toEqual(3);
    expect(rbt2D.maxX).toEqual(500);
    expect(rbt2D.maxY).toEqual(500);
    expect(rbt2D.findIntervalYMaxX(maxInterval)).toEqual(500);
    expect(rbt2D.findIntervalXMaxY(maxInterval)).toEqual(500);
  });

  it('correctly adds and deletes two values; get returns values array, two matching intervalY fields', () => {
    const rbt2D = new RBT2D();
    const deleteIntervalX1 = new Interval1D(150, 200);
    const deleteIntervalY1 = new Interval1D(0, 100);
    const deleteIntervalX2 = new Interval1D(300, 500);
    const deleteIntervalY2 = new Interval1D(200, 300);
    const value1 = { key: 'testValue1' };
    const value2 = { key: 'testValue2' };
    const value3 = { key: 'testValue3' };
    const value4 = { key: 'testValue4' };
    const value5 = { key: 'testValue5' };

    rbt2D.add(new Interval1D(0, 100), new Interval1D(0, 100), value1);
    rbt2D.add(deleteIntervalX1, deleteIntervalY1, value2);
    rbt2D.add(new Interval1D(200, 300), new Interval1D(200, 300), value3);
    rbt2D.add(deleteIntervalX2, deleteIntervalY2, value4);
    rbt2D.add(new Interval1D(400, 500), new Interval1D(400, 500), value5);
    rbt2D.delete(deleteIntervalX1, deleteIntervalY1);
    rbt2D.delete(deleteIntervalX2, deleteIntervalY2);

    const array = [value3, value1, value5];

    const maxInterval = new Interval1D(0, 500);

    const expectedCoordinatesResult = {
      left: -1,
      right: -1,
      top: 500,
      bottom: -1,
      value: null,
    };

    expect(rbt2D.getIntervalsNodeValues(maxInterval, maxInterval)).toEqual(array);
    expect(rbt2D.getCoordinates(350, 550)).toEqual(expectedCoordinatesResult);
    expect(rbt2D.size).toEqual(3);
    expect(rbt2D.maxX).toEqual(500);
    expect(rbt2D.maxY).toEqual(500);
    expect(rbt2D.findIntervalYMaxX(maxInterval)).toEqual(500);
    expect(rbt2D.findIntervalXMaxY(maxInterval)).toEqual(500);
  });
});
