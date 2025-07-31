import TopographyTileChunk from "./TopographyTileChunk";

export default function tilesGenerator(){
  const tiles = [
    [
      [0, 0],
      [0, 0],
    ],
    [
      [1, 1],
      [1, 1],
    ],
    [
      [-1, -1],
      [-1, -1],
    ],
    [
      [1, 0],
      [0, 0],
    ],
    [
      [0, 1],
      [0, 0],
    ],
    [
      [0, 0],
      [0, 1],
    ],
    [
      [0, 0],
      [1, 0],
    ],
    [
      [-1, 0],
      [0, 0],
    ],
    [
      [0, -1],
      [0, 0],
    ],
    [
      [0, 0],
      [0, -1],
    ],
    [
      [0, 0],
      [-1, 0],
    ],
    [
      [1, 1],
      [0, 0],
    ],
    [
      [0, 1],
      [0, 1],
    ],
    [
      [0, 0],
      [1, 1],
    ],
    [
      [1, 0],
      [1, 0],
    ],
    [
      [-1, -1],
      [0, 0],
    ],
    [
      [0, -1],
      [0, -1],
    ],
    [
      [0, 0],
      [-1, -1],
    ],
    [
      [-1, 0],
      [-1, 0],
    ],
  ];
  function edges(map: Array<Array<number>>) {
    let keys = {
      top: "",
      right: "",
      bottom: "",
      left: "",
    };
    map.forEach(([a, b], index) => {
      if (index === 0) keys.top = `${a}|${b}`;
      if (index === 1) keys.bottom = `${a}|${b}`;
      keys.left += `${index > 0 ? "|" : ""}${a}`;
      keys.right += `${index > 0 ? "|" : ""}${b}`;
    });
    return keys;
  }
}
