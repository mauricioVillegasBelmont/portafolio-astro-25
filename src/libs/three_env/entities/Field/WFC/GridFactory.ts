import {CellFactory, type Cell} from './CellFactory'

export class GridFactory {
  constructor(private width: number, private height: number) {}

  createGrid(isZeroZero: boolean = false): Cell[][] {
    return Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => 
        isZeroZero 
          ? CellFactory.createCollapsedCell(0) 
          : CellFactory.createCell()
      )
    );
  }
}