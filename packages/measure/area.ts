import type { Cartesian3 } from 'cesium'
import { splitTriangle } from '../utils/geometry-split'

/**
 * 计算贴地面积
 */
export function computeAreaOfGround (positions: Cartesian3[]): number {
  const triangles = splitTriangle(positions, {
    maxTriangleArea: 1
    // terrainProvider: true
  })
  return triangles.length
}
