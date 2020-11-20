import * as G6 from '@antv/g6';
import {
    CommandEditor,
    EventAop,
    EventGraphCanvas,
    EventGraphCommon,
    EventGraphEdge,
    EventGraphNode,
    StateGraph,
    StateLabel,
    TypeGraph
} from "./cv";
import {IShape} from '@antv/g-canvas/lib/interfaces';
import {IItem} from './interfaces.native';

export interface Behavior {
    graph?: G6.Graph;
    graphType?: TypeGraph;
    graphMode?: string;

    getEvents(): {
        [propName in EventGraphNative]?: string;
    };

    getDefaultCfg?(): object;

    shouldBegin?(e?: EventGraph): boolean;

    shouldUpdate?(e?: EventGraph): boolean;

    shouldEnd?(e?: EventGraph): boolean;
}

export interface EventGraph {
    x: number;
    y: number;
    canvasX: number;
    canvasY: number;
    clientX: number;
    clientY: number;
    event: MouseEvent;
    target: IShape;
    type: string;
    currentTarget: object;
    item: IItem;
    removed: boolean;
    timeStamp: number;
    bubbles: boolean;
    defaultPrevented: boolean;
    cancelable: boolean;
}

export interface Command<P = object, G = G6.Graph> {
    /** 命令名称 */
    name: string;
    /** 命令参数 */
    params: P;
    /** 命令快捷键 */
    shortcuts: string[] | string[][];

    /** 是否可以执行 */
    canExecute(graph: G): boolean;

    /** 是否应该执行 */
    shouldExecute(graph: G): boolean;

    /** 是否可以撤销 */
    canUndo(graph: G): boolean;

    /** 初始命令 */
    init(graph: G): void;

    /** 执行命令 */
    execute(graph: G): void;

    /** 撤销命令 */
    undo(graph: G): void;
}

export interface EventCommand {
    name: CommandEditor;
    params: object;
}

export interface EventStateGraph {
    stateGraph: StateGraph;
}

export interface EventStateLabel {
    stateLabel: StateLabel;
}

export type EventGraphNative =
    EventGraphCommon |
    EventGraphNode |
    EventGraphEdge |
    EventGraphCanvas |
    EventAop

export type EventGraphReact =
    | keyof typeof EventGraphCommon
    | keyof typeof EventGraphNode
    | keyof typeof EventGraphEdge
    | keyof typeof EventGraphCanvas
    | keyof typeof EventAop

export type EventGraphReactProp = Record<EventGraphReact, (e: any) => void>;