import { Cartesian3, Cartographic, sampleTerrainMostDetailed, TerrainProvider } from 'cesium'

export async function cartesian3ClampToGround (terrainProvider: TerrainProvider, positions: Cartesian3[]): Promise<Cartesian3[]> {
  return await sampleTerrainMostDetailed(terrainProvider, positions.map(p => Cartographic.fromCartesian(p)))
    .then(values => values.map(p => Cartesian3.fromRadians(p.longitude, p.latitude, p.height)))
}
