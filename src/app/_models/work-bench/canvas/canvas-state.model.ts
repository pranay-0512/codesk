// the CoCanvasState will change when the state of the canvas changes.
export class CoCanvasState {
    showWelcomeScreen!: boolean
    theme!: string
    currentFillStyle!: string
    currentFontFamily!: number
    currentFontSize!: number
    currentOpacity!: number
    currentRoughness!: number
    currentStrokeColor!: string
    currentRoundness!: number
    currentStrokeStyle!: string
    currentStrokeWidth!: number
    currentTextAlign!: string
    editingGroupId!: any
    activeTool!: ActiveTool
    exportBackground!: boolean
    gridSize!: number
    name!: string
    previousSelectedElementId!: PreviousSelectedElementId
    scrolledOutside!: boolean
    relativeScrollX!: number
    relativeScrollY!: number
    selectedElementIds!: SelectedElementIds
    viewBackgroundColor!: string
    font_family!: string;
    fonts?: Array<string>;
    zoom!: Zoom;
    shadow?: Shadow
}

export class Shadow {
    blur!: number
    offsetX!: number
    offsetY!: number
    color!: string
}
export class ActiveTool {
    type!: string
    lastActiveTool!: string
}
  
export class PreviousSelectedElementId {
    selectedElementId!: SelectedElement
}

export class SelectedElement {
    elementId!: string
}

export class SelectedElementIds {
    selectedElementIds!: Array<SelectedElement>
}

export class Zoom {
    value!: number
}