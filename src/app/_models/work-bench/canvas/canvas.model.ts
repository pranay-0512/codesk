import '../canvas/canvas-state.model'
// This class will be an object of arrays

export class CoCanvasElement {
    type!: string
    version!: number
    versionNonce!: number
    isDeleted!: boolean
    id!: string
    fillStyle!: string
    strokeWidth!: number
    strokeStyle!: string
    roughness!: number
    opacity!: number
    angle!: number
    x!: number
    y!: number
    strokeColor!: string
    backgroundColor!: string
    width!: number
    height!: number
    seed!: number
    groupIds!: any[]
    frameId!: any
    roundness!: Roundness
    boundElements!: BoundElement[]
    updated!: number
    link!: any
    locked!: boolean
}
export class Roundness {
    type!: number
}
  
export class BoundElement {
    id!: string
    type!: string
}