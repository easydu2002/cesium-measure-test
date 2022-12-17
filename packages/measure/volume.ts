import type { Cartesian3 } from 'cesium'

interface VolumeOptions {
  /**
   * 基准高度
   */
  baseHeight: number

}

interface VolumeResult extends VolumeOptions {

  /**
   * 最低高度
   */
  minHeight: number
  /**
   * 最高高度
   */
  maxHeight: number
  /**
   * 挖方体积
   */
  cutVolume: number
  /**
   * 填方体积
   */
  fillVolume: number
}

/**
 * 方量分析
 */
export function computeVolume (positions: Cartesian3[], options: VolumeOptions): VolumeResult {
  return {
    maxHeight: 0,
    minHeight: 0,
    baseHeight: options.baseHeight,
    cutVolume: 0,
    fillVolume: 0
  }
}
