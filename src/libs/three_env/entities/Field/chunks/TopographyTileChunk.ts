import * as THREE from "three";
import { isMobile } from "mobile-device-detect";
import mathHelper from "libs/three_env/utils/MathHelpers";

export type topographyMapType = Array<Array<number>>;

export interface TileChunkArgs {
  chunkSize?: number;
  LOD?: number;
  topographyMap?: topographyMapType;
  direction?: 1 | -1;
}
/*
  [
    [{x:0,z:0}, {x:1,z:0}],
    [{x:0,z:1}, {x:1,z:1}],
  ]
*/
export default class TopographyTileChunk extends THREE.Mesh {
  topographyMap: Array<Array<number>> = [
    [0, 0],
    [0, 0],
  ];
  
  density: number = isMobile ? 2 : 1;
  chunkSize: number = 250;
  LOD: number = 0;
  direction = 1;
  edges:{[key:string]:string}={}

  constructor(args: TileChunkArgs) {
    const { chunkSize, LOD, topographyMap } = args;
    const material = new THREE.MeshNormalMaterial({ wireframe: true });
    const geometry = new THREE.PlaneGeometry(0, 0, 0, 0);
    super(geometry, material);
    if (chunkSize) this.chunkSize = chunkSize;
    if (topographyMap) this.topographyMap = topographyMap;
    if (LOD) this.LOD = LOD;
    this.updateGeometry();
    // this.updateTopography();
    // this.geometry.rotateX(-Math.PI / 2);
  }

  get subdivisions() {
    const subdivisiones = Math.round(
      Math.max(Math.floor(this.chunkSize * 0.5 ** this.LOD), this.density) /
        this.density
    );
    return subdivisiones;
  }
  get reliefMap() {
    return this.geometry.getAttribute("position");
  }
  get height() {
    if (!this.geometry.getAttribute("height")) {
      this.geometry.setAttribute(
        "height",
        new THREE.BufferAttribute(new Float32Array(this.reliefMap.count), 1)
      );
    }
    const heightAttr = this.geometry.getAttribute("height");
    return heightAttr;
  }


  public updateGeometry() {
    this.geometry.dispose();
    const subdivisions = this.subdivisions;
    this.geometry = new THREE.PlaneGeometry(
      this.chunkSize,
      this.chunkSize,
      subdivisions,
      subdivisions
    );
  }

  public updateTopography() {
    return new Promise((resolve, reject) => {
      const textureLoader = new THREE.TextureLoader();
      
    })
  }

  private bumpHeightGenerator(posX:number,posZ:number,refX:number,regZ:number){
    const dist = new THREE.Vector2(posX, posZ).distanceTo(
      new THREE.Vector2(refX, regZ)
    );
    let h = 1.0 - mathHelper.sat(dist / (this.chunkSize * 0.25));
    h = h * h * h * (h * (h * 6 - 15) + 10);
    return h;
  }

  private catchTopoColRow(){
    const rowTopo: Array<number> = [];
    const colTopo: Array<number> = [];
    for (let i = 0; i < this.topographyMap.length; i++) {
      if (this.topographyMap[i].find((element) => element !== 0)) {
        rowTopo.push(i);
      }
    }
    rowTopo.forEach((row) => {
      for (let i = 0; i < this.topographyMap[row].length; i++) {
        if (this.topographyMap[row][i] !== 0) colTopo.push(i);
      }
    });
    return {
      rowTopo,
      colTopo
    }
  }
}

/*

0 0 0 0   . . . .  |   . . . .  -1-1-1-1
0 0 0 0   . . . .  |   . . . .  -1-1-1-1
0 0 0 0   . . . .  |   . . . .  -1-1-1-1
0 0 0 0   . . . .  |   . . . .  -1-1-1-1
                   |                   
. . . .   . . . .  |   . . . .   . . . .
. . . .   . . . .  |   . . . .   . . . .
. . . .   . . . .  |   . . . .   . . . .
. . . .   . . . .  |   . . . .   . . . .
                   |                   
-----------------  |   -----------------
                   |                   
. . . .   . . . .  |   . . . .   . . . .
. . . .   . . . .  |   . . . .   . . . .
. . . .   . . . .  |   . . . .   . . . .
. . . .   . . . .  |   . . . .   . . . .
                   |                   
1 1 1 1   . . . .  |   . . . .   0 0 0 0
1 1 1 1   . . . .  |   . . . .   0 0 0 0
1 1 1 1   . . . .  |   . . . .   0 0 0 0
1 1 1 1   . . . .  |   . . . .   0 0 0 0


*/