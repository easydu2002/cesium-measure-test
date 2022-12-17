import { Cartesian2, CallbackProperty, Cartesian3, Color, defined, Entity, LabelGraphics, PolygonGraphics, PolygonHierarchy, ScreenSpaceEventHandler, ScreenSpaceEventType, Viewer, VerticalOrigin, HeightReference, ConstantProperty } from 'cesium'

const taskMap: WeakMap<Viewer, { handler: ScreenSpaceEventHandler, entity: Entity }> = new WeakMap()

function clearTask (viewer: Viewer): void {
  const task = taskMap.get(viewer)
  if (task != null) {
    task.handler.destroy()
    // viewer.entities.remove(task.entity)
    taskMap.delete(viewer)
  }
}

export async function drawPolygon (viewer: Viewer): Promise<Cartesian3[]> {
  clearTask(viewer)

  const positions: Cartesian3[] = []
  const tmpPositions: Cartesian3[] = []
  const entity = new Entity({
    // @ts-expect-error
    position: new CallbackProperty(() => tmpPositions.slice(-1)[0], false),
    polygon: new PolygonGraphics({
      hierarchy: new CallbackProperty(() => new PolygonHierarchy(tmpPositions), false),
      outline: true,
      outlineColor: Color.RED,
      outlineWidth: 2,
      material: Color.YELLOW.withAlpha(0.6),
      heightReference: HeightReference.CLAMP_TO_GROUND
    }),
    label: new LabelGraphics({
      text: new CallbackProperty(() => `已选择${positions.length}个点${positions.length > 0 ? '\n右键撤回' : ''}${positions.length >= 3 ? '\n双击左键结束' : ''}`, false),
      font: '16px',
      showBackground: true,
      backgroundColor: Color.BLACK,
      pixelOffset: new Cartesian2(0, -20),
      disableDepthTestDistance: Infinity,
      verticalOrigin: VerticalOrigin.BOTTOM,
      heightReference: HeightReference.CLAMP_TO_GROUND
    })
  })
  return await new Promise((resolve, reject) => {
    viewer.entities.add(entity)
    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas)
    taskMap.set(viewer, { handler, entity })
    handler.setInputAction((e: ScreenSpaceEventHandler.PositionedEvent) => {
      const pos = viewer.scene.pickPosition(e.position)
      if (!defined(pos) || pos.equals(positions.slice(-1)[0])) return
      positions.push(pos)
      tmpPositions.push(pos)
    }, ScreenSpaceEventType.LEFT_CLICK)
    handler.setInputAction((e: ScreenSpaceEventHandler.MotionEvent) => {
      const pos = viewer.scene.pickPosition(e.endPosition)
      if (!defined(pos)) return
      tmpPositions.splice(-1, 1, pos)
    }, ScreenSpaceEventType.MOUSE_MOVE)
    handler.setInputAction((e: ScreenSpaceEventHandler.MotionEvent) => {
      positions.pop()
      tmpPositions.splice(-2, 1)
    }, ScreenSpaceEventType.RIGHT_CLICK)
    handler.setInputAction(() => {
      if (positions.length >= 3 && (entity.polygon != null)) {
        entity.polygon.hierarchy = new ConstantProperty(new PolygonHierarchy(positions))
        clearTask(viewer)
        resolve(positions)
      }
    }, ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
  })
}
