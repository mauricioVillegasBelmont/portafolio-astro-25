export type RangeNumber = -1 | 0 | 1;
export type RangeNumberRow = [RangeNumber,RangeNumber];
export type TopoMap = [RangeNumberRow,RangeNumberRow];
export interface TopoMapData{image: string, rotationSteps: number, direction:'CW'|'CCW' }

export default function get_map(map:TopoMap):TopoMapData{
  const _keys = [
    'C',
    'B',
    'A',
  ]
  const name = (map.flat().map((value)=>{
    const k = value+1 
    return _keys[k]
  })).join("")
  // CW ROTATION:
  const img_keys = {
    // 1C SOLID
    'tile_AAAA':['AAAA'],
    'tile_BBBB':['BBBB'],
    'tile_CCCC':['CCCC'],
    // 2C 1:3
    'tile_ABBB':['ABBB','BABB','BBBA','BBAB'],
    'tile_ACCC':['ACCC','CACC','CCCA','CCAC'],
    'tile_BAAA':['BAAA','ABAA','AAAB','AABA'],
    'tile_BCCC':['BCCC','CBCC','CCCB','CCBC'],
    'tile_CAAA':['CAAA','ACAA','AAAC','AACA'],
    'tile_CBBB':['CBBB','BCBB','BBBC','BBCB'],
    // 2C 2:2
    'tile_ABAB':['ABAB','AABB','BABA','BBAA'],
    'tile_BAAB':['BAAB','ABBA'],
    'tile_ACAC':['ACAC','AACC','CACA','CCAA'],
    'tile_CAAC':['CAAC','ACCA'],
    'tile_BCBC':['BCBC','BBCC','CBCB','CCBB'],
    'tile_CBBC':['CBBC','BCCB'],
    // 3C 2:1:1
    'tile_ABCA':['ABCA','CAAB','ACBA','BAAC'],
    'tile_BCAB':['BCAB','ABBC','BACB','CBBA'],
    'tile_CABC':['CABC','BCCA','CBAC','ACCB'], 
    
    'tile_AABC':['AABC','BACA','CBAA','ACAB'],
    'tile_AACB':['AACB','CABA','BCAA','ABAC'],
    'tile_BBAC':['BBAC','ABCB','CABB','BCBA'],
    'tile_BBCA':['BBCA','CBAB','ACBB','BABC'],
    'tile_CCAB':['CCAB','ACBC','BACC','CBCA'],
    'tile_CCBA':['CCBA','BCAC','ABCC','CACB'],
  }

  
  let topoMapData:TopoMapData|undefined ;
  Object.entries(img_keys).forEach(([key, value]) => {
    if(value.includes(name)) {
      topoMapData ={image: key, rotationSteps: value.indexOf(name), direction:'CW' };
      return;
    }
  })
  
  if(topoMapData) return topoMapData as TopoMapData;
  throw new Error('TopographyMap not found')
  
}