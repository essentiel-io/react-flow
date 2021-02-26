import { Action, Thunk, Computed } from 'easy-peasy';
import { Selection as D3Selection, ZoomBehavior } from 'd3';
import { ElementId, Elements, Transform, Node, Edge, Rect, Dimensions, XYPosition, OnConnectFunc, OnConnectStartFunc, OnConnectStopFunc, OnConnectEndFunc, SelectionRect, HandleType, SetConnectionId, NodePosUpdate, NodeDiffUpdate, TranslateExtent, SnapGrid, ConnectionMode, NodeExtent } from '../types';
declare type NodeDimensionUpdate = {
    id: ElementId;
    nodeElement: HTMLDivElement;
};
declare type NodeDimensionUpdates = {
    updates: NodeDimensionUpdate[];
};
declare type InitD3Zoom = {
    d3Zoom: ZoomBehavior<Element, unknown>;
    d3Selection: D3Selection<Element, unknown, null, undefined>;
    d3ZoomHandler: ((this: Element, event: any, d: unknown) => void) | undefined;
    transform: Transform;
};
export interface StoreModel {
    width: number;
    height: number;
    transform: Transform;
    elements: Elements;
    nodes: Computed<StoreModel, Node[]>;
    edges: Computed<StoreModel, Edge[]>;
    selectedElements: Elements | null;
    selectedNodesBbox: Rect;
    viewportBox: Computed<StoreModel, Rect>;
    d3Zoom: ZoomBehavior<Element, unknown> | null;
    d3Selection: D3Selection<Element, unknown, null, undefined> | null;
    d3ZoomHandler: ((this: Element, event: any, d: unknown) => void) | undefined;
    minZoom: number;
    maxZoom: number;
    translateExtent: TranslateExtent;
    nodeExtent: NodeExtent;
    nodesSelectionActive: boolean;
    selectionActive: boolean;
    userSelectionRect: SelectionRect;
    connectionNodeId: ElementId | null;
    connectionHandleId: ElementId | null;
    connectionHandleType: HandleType | null;
    connectionPosition: XYPosition;
    connectionMode: ConnectionMode;
    snapToGrid: boolean;
    snapGrid: SnapGrid;
    nodesDraggable: boolean;
    nodesConnectable: boolean;
    elementsSelectable: boolean;
    multiSelectionActive: boolean;
    reactFlowVersion: string;
    onConnect?: OnConnectFunc;
    onConnectStart?: OnConnectStartFunc;
    onConnectStop?: OnConnectStopFunc;
    onConnectEnd?: OnConnectEndFunc;
    setOnConnect: Action<StoreModel, OnConnectFunc>;
    setOnConnectStart: Action<StoreModel, OnConnectStartFunc>;
    setOnConnectStop: Action<StoreModel, OnConnectStopFunc>;
    setOnConnectEnd: Action<StoreModel, OnConnectEndFunc>;
    setElements: Action<StoreModel, Elements>;
    batchUpdateNodeDimensions: Action<StoreModel, NodeDimensionUpdates>;
    updateNodeDimensions: Action<StoreModel, NodeDimensionUpdate>;
    updateNodePos: Action<StoreModel, NodePosUpdate>;
    updateNodePosDiff: Action<StoreModel, NodeDiffUpdate>;
    setSelection: Action<StoreModel, boolean>;
    unsetNodesSelection: Action<StoreModel>;
    resetSelectedElements: Action<StoreModel>;
    setSelectedElements: Action<StoreModel, Elements | Node | Edge>;
    addSelectedElements: Thunk<StoreModel, Elements | Node | Edge>;
    updateTransform: Action<StoreModel, Transform>;
    updateSize: Action<StoreModel, Dimensions>;
    initD3Zoom: Action<StoreModel, InitD3Zoom>;
    setMinZoom: Action<StoreModel, number>;
    setMaxZoom: Action<StoreModel, number>;
    setTranslateExtent: Action<StoreModel, TranslateExtent>;
    setNodeExtent: Action<StoreModel, NodeExtent>;
    setSnapToGrid: Action<StoreModel, boolean>;
    setSnapGrid: Action<StoreModel, SnapGrid>;
    setConnectionPosition: Action<StoreModel, XYPosition>;
    setConnectionNodeId: Action<StoreModel, SetConnectionId>;
    setInteractive: Action<StoreModel, boolean>;
    setNodesDraggable: Action<StoreModel, boolean>;
    setNodesConnectable: Action<StoreModel, boolean>;
    setElementsSelectable: Action<StoreModel, boolean>;
    setUserSelection: Action<StoreModel, XYPosition>;
    updateUserSelection: Action<StoreModel, XYPosition>;
    unsetUserSelection: Action<StoreModel>;
    setMultiSelectionActive: Action<StoreModel, boolean>;
    setConnectionMode: Action<StoreModel, ConnectionMode>;
}
export declare const storeModel: StoreModel;
declare const store: import("easy-peasy").Store<StoreModel, import("easy-peasy").EasyPeasyConfig<undefined, {}>>;
export default store;
