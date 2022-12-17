import { Cartesian3, TrianglePositions } from '../types'

/**
 * 计算三角面积
 * @link https://baike.baidu.com/item/%E6%B5%B7%E4%BC%A6%E5%85%AC%E5%BC%8F/106956?fr=aladdin
 */
export function computeTriangleArea (...positions: TrianglePositions): number {
  const [p1, p2, p3] = positions
  const a = computeDistance([p1, p2])
  const b = computeDistance([p2, p3])
  const c = computeDistance([p3, p1])
  const p = (a + b + c) / 2
  return Math.sqrt(p * (p - a) * (p - b) * (p - c))
}

/**
 * 获取笛卡尔集合中心点
 */
export function getCartesian3Center (...positions: Cartesian3[]): Cartesian3 {
  const { x, y, z } = positions.reduce((r, c) => ({ x: r.x + c.x, y: r.y + c.y, z: r.z + c.z }), { x: 0, y: 0, z: 0 })
  return { x: x / positions.length, y: y / positions.length, z: z / positions.length }
}

/**
 * 计算笛卡尔集合距离
 * @param positions
 * @returns
 */
export function computeDistance (positions: Cartesian3[]): number {
  let distance = 0
  for (let i = 1; i < positions.length; i++) {
    const p1 = positions[i - 1]
    const p2 = positions[i]
    distance += Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2))
  }
  return distance
}
