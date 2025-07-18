export type Cell = {
  collapsed: boolean;
  options: number[];
};

export class CellFactory {
  static readonly POSSIBLE_VALUES = [-1, 0, 1];
  // static readonly POSSIBLE_VALUES = [0, 1, 2];

  static createCell(): Cell {
    return {
      collapsed: false,
      options: [...this.POSSIBLE_VALUES],
    };
  }

  static createCollapsedCell(value: number): Cell {
    return {
      collapsed: true,
      options: [value],
    };
  }
}