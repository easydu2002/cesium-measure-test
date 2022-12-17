import type { TerrainProvider } from 'cesium'
import { Cartesian3 as Test } from 'cesium'
import { Cartesian3, TrianglePositions } from '../types'
import { getCartesian3Center } from './math'
import Dexie from 'dexie'
import splitWorkerSrc from 'inline-worker:./../workers/triangle-split.ts'

interface SplitTriangleOptions {
  maxTriangleArea: number
  /**
   * 传进该值表示贴地拆分
   */
  terrainProvider?: TerrainProvider
}

// interface SplitGridOptions {

// }

/**
 * 拆分小三角
 * @param positions
 * @param [options]
 * @returns
 */
export async function splitTriangle (positions: Cartesian3[], options: SplitTriangleOptions): Promise<TrianglePositions[]> {
  const db = new Dexie('tmp_measure')
  db.version(1).stores({ split_triangles: '++id' })
  const a = Test.ZERO
  console.log(a)
  return await new Promise((resolve, reject) => {
    const worker = new Worker(splitWorkerSrc)
    worker.postMessage({ type: 'start', positions: simpleSplitTriangle(positions), options })
    worker.onmessage = function (e) {
      console.log('primary process', e)
    }
  })
}

/**
 * 简单拆分三角
 * @param positions
 * @returns
 */
export function simpleSplitTriangle (positions: Cartesian3[]): TrianglePositions[] {
  const triangles: TrianglePositions[] = []
  for (let i = 0; i <= positions.length - 3; i++) {
    triangles.push([positions[0], positions[i + 1], positions[i + 2]])
  }
  return triangles
}

/**
 * 三角拆分成两个子三角
 * @param positions
 * @returns
 */
export function _splitTriangle (positions: TrianglePositions): [TrianglePositions, TrianglePositions] {
  const splitCenter = getCartesian3Center(positions[1], positions[2])

  return [
    [splitCenter, positions[1], positions[0]],
    [splitCenter, positions[2], positions[0]]
  ]
}
