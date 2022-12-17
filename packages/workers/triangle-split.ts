import { createWorldTerrain } from 'cesium'
import { TrianglePositions } from '../types'
// import { _splitTriangle } from '../utils/geometry-split'
import { computeTriangleArea, getCartesian3Center } from '../utils/math'

onmessage = function (e) {
  switch (e.data.type) {
    case 'start':
      console.log('e.data', e.data, createWorldTerrain())
      _split(e.data.positions, e.data.options)
        .then(area => {
          postMessage({ type: 'success', data: area })
        })
        .catch(err => console.trace(err))
      break
  }
}

async function _split (positions: TrianglePositions[], options = {
  maxTriangleArea: 10,
  terrainProvider: undefined
}): Promise<number> {
  // const buff = []
  let totalArea = 0
  for (let i = 0; i < positions.length; i++) {
    const area = computeTriangleArea(...positions[i])
    if (area <= options.maxTriangleArea) {
      // buff.push({ position: positions[i], area })
      // if (buff.length === 1000 || (i === positions.length - 1)) {
      //   // await db.split_triangles.bulkAdd(buff)
      //   buff.length = 0
      // }
      // positions[i][3] = area
      // resultTriangles.push(positions[i])
      totalArea += area
      positions.splice(i--, 1)
      continue
    }
    positions.push(..._splitTriangle(positions[i]))
    positions.splice(i--, 1)
  }
  return totalArea
}

function _splitTriangle (positions: TrianglePositions): [TrianglePositions, TrianglePositions] {
  const splitCenter = getCartesian3Center(positions[1], positions[2])

  return [
    [splitCenter, positions[1], positions[0]],
    [splitCenter, positions[2], positions[0]]
  ]
}
