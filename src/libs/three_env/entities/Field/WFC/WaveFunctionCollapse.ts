import {CellFactory, type Cell} from './CellFactory'
import {GridFactory} from './GridFactory'

export class WaveFunctionCollapse {
  readonly WIDTH = 2;
  readonly HEIGHT = 2;

  gridMap: Map<string, Cell[][]> = new Map();
  gridFactory = new GridFactory(this.WIDTH, this.HEIGHT);
  private pendingCoordinates: Set<string> = new Set();

  constructor() {
    // Opcional: añadir coordenada inicial si es necesario
    // this.addCoordinate(0, 0);
  }

  private key(x: number, y: number): string {
    return `${x},${y}`;
  }

  private isGridCollapsed(grid: Cell[][]): boolean {
    return grid.every(row => row.every(cell => cell.collapsed));
  }

  private getLowestEntropyCell(grid: Cell[][]): [number, number] | null {
    let minOptions = Infinity;
    let coords: [number, number] | null = null;

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        const cell = grid[y][x];
        if (!cell.collapsed && cell.options.length < minOptions) {
          minOptions = cell.options.length;
          coords = [y, x];
        }
      }
    }
    return coords;
  }

  private collapseCell(grid: Cell[][], y: number, x: number) {
    const cell = grid[y][x];
    if (!cell || cell.collapsed) return;
    const choice = cell.options[Math.floor(Math.random() * cell.options.length)];
    cell.options = [choice];
    cell.collapsed = true;
    this.propagate(grid, y, x);
  }

  private getNeighbors(y: number, x: number): [number, number][] {
    return [
      [y - 1, x],
      [y + 1, x],
      [y, x - 1],
      [y, x + 1],
    ].filter(([ny, nx]) => ny >= 0 && ny < this.HEIGHT && nx >= 0 && nx < this.WIDTH) as [number, number][];
  }

  private propagate(grid: Cell[][], y: number, x: number) {
    const currentVal = grid[y][x].options[0];
    const neighbors = this.getNeighbors(y, x);

    for (const [ny, nx] of neighbors) {
      const neighbor = grid[ny][nx];
      if (neighbor.collapsed) continue;

      if (currentVal === 1) {
        neighbor.options = neighbor.options.filter(v => v !== -1);
      } else if (currentVal === -1) {
        neighbor.options = neighbor.options.filter(v => v !== 1);
      }

      if (neighbor.options.length === 1) {
        neighbor.collapsed = true;
        this.propagate(grid, ny, nx);
      }
    }
  }

  private runWFC(grid: Cell[][]): void {
    while (!this.isGridCollapsed(grid)) {
      const coords = this.getLowestEntropyCell(grid);
      if (!coords) break;
      const [y, x] = coords;
      this.collapseCell(grid, y, x);
    }
  }

  private getOrCreateGrid(x: number, y: number): Cell[][] {
    const key = this.key(x, y);
    if (!this.gridMap.has(key)) {
      const isZeroZero = x === 0 && y === 0;
      const grid = this.gridFactory.createGrid(isZeroZero);
      this.gridMap.set(key, grid);
      this.pendingCoordinates.add(key);
    }
    return this.gridMap.get(key)!;
  }

  addCoordinate(x: number, y: number): void {
    this.getOrCreateGrid(x, y);
  }

  setInitialCell(x: number, y: number, gridX: number, gridY: number): void {
    const key = this.key(gridX, gridY);
    if (this.gridMap.has(key)) {
      const grid = this.gridMap.get(key)!;
      if (x >= 0 && x < this.WIDTH && y >= 0 && y < this.HEIGHT) {
        grid[y][x] = CellFactory.createCollapsedCell(0);
        this.pendingCoordinates.add(key);
      }
    }
  }

  generatePendingGrids(): void {
    const keysToProcess = Array.from(this.pendingCoordinates);
    this.pendingCoordinates.clear();

    for (const key of keysToProcess) {
      const grid = this.gridMap.get(key);
      if (grid) {
        this.runWFC(grid);
      }
    }
  }

  getResult(): Record<string, number[][]> {
    const result: Record<string, number[][]> = {};
    for (const [k, grid] of this.gridMap.entries()) {
      result[k] = grid.map(row => row.map(cell => cell.options[0]));
    }
    return result;
  }
}