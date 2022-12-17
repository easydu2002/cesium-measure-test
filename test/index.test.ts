import { TrianglePositions } from '../packages/types'
import { _splitTriangle } from '../packages/utils/geometry-split'
import { computeTriangleArea } from '../packages/utils/math'

test('三角面积', () => {
  const triangle345 = computeTriangleArea({ x: 0, y: 0, z: 0 }, { x: 0, y: 3, z: 0 }, { x: 4, y: 0, z: 0 })
  expect(triangle345).toEqual(3 * 4 / 2)
})

test('子三角拆分', () => {
  const positions: TrianglePositions = [{ x: 0, y: 0, z: 0 }, { x: 0, y: 3, z: 0 }, { x: 4, y: 0, z: 0 }]
  const splits = _splitTriangle(positions)
  expect(computeTriangleArea(...splits[0]) + computeTriangleArea(...splits[1]))
    .toEqual(3 * 4 / 2)
})

// test('简单拆分三角', () => {
//   const testData = [
//     [
//       new Cartesian3(0, 0, 0),
//       new Cartesian3(0, 4, 0),
//       new Cartesian3(4, 4, 0),
//       new Cartesian3(4, 0, 0)
//     ],
//     [
//       new Cartesian3(0, 0, 0),
//       new Cartesian3(0, 4, 0),
//       new Cartesian3(4, 4, 0)
//     ]
//   ]
//   // console.log(result)
//   expect(simpleSplitTriangle(testData[0]).length).toBe(2)
//   expect(simpleSplitTriangle(testData[1]).length).toBe(1)
// })

// test('三角拆分', () => {
//   const testData = [
//     [
//       new Cartesian3(0, 0, 0),
//       new Cartesian3(0, 4, 0),
//       new Cartesian3(4, 4, 0),
//       new Cartesian3(4, 0, 0)
//     ],
//     [
//       new Cartesian3(0, 0, 0),
//       new Cartesian3(0, 4, 0),
//       new Cartesian3(4, 4, 0)
//     ]
// //   ]
// //   const result = splitTriangle(testData[0], {
// //     maxTriangleArea: 100,
// //     clampToGround: false
// //   })
// //   console.log(result)
// //   expect(result.length).toBe(2)
// // })
