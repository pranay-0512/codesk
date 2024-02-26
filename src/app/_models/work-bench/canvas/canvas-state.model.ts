// the CoCanvasState will change when the state of the canvas changes.
export class CoCanvasState {
    coCanvas_showWelcomeScreen!: boolean
    coCanvas_theme!: string
    // coCanvas_currentChartType!: string
    // cocoCavnas_currentItemBackgroundColor!: string
    // coCavnas_currentItemEndArrowhead!: string
    coCavnas_currentFillStyle!: string
    coCavnas_currentFontFamily!: number
    coCavnas_currentFontSize!: number
    coCavnas_currentOpacity!: number
    coCavnas_currentRoughness!: number
    // coCavnas_currentItemStartArrowhead!: any
    coCavnas_currentStrokeColor!: string
    coCavnas_currentRoundness!: string
    coCavnas_currentStrokeStyle!: string
    coCavnas_currentStrokeWidth!: number
    coCavnas_currentTextAlign!: string
    // coCavnas_cursorButton!: string
    coCavnas_editingGroupId!: any
    coCavnas_activeTool!: ActiveTool
    // coCavnas_penMode!: boolean
    // coCavnas_penDetected!: boolean
    coCavnas_exportBackground!: boolean
    // coCavnas_exportScale!: number
    // coCavnas_exportEmbedScene!: boolean
    // coCavnas_exportWithDarkMode!: boolean
    coCavnas_gridSize!: number
    // coCavnas_defaultSidebarDockedPreference!: boolean
    // coCavnas_lastPointerDownWith!: string
    coCavnas_name!: string
    // coCavnas_openMenu!: any
    // coCavnas_openSidebar!: any
    coCavnas_previousSelectedElementId!: PreviousSelectedElementId
    coCavnas_scrolledOutside!: boolean
    coCavnas_relativeScrollX!: number
    coCavnas_relativeScrollY!: number
    coCavnas_selectedElementIds!: SelectedElementIds
    // coCavnas_selectedGroupIds!: SelectedGroupIds
    // coCavnas_shouldCacheIgnoreZoom!: boolean
    // coCavnas_showStats!: boolean
    coCavnas_viewBackgroundColor!: string
    // coCavnas_zenModeEnabled!: boolean
    coCavnas_zoom!: Zoom
    // coCavnas_selectedLinearElement!: any
    // coCavnas_objectsSnapModeEnabled!: boolean
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