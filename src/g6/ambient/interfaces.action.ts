import * as G6 from '@antv/g6';
import {
    CommandEditor,
    EventAop,
    EventGraphCanvas,
    EventGraphCommon,
    EventGraphEdge,
    EventGraphNode,
    StateGraph,
    StateLabel
} from "./cv";
import {BehaviorOption} from "@antv/g6/lib/types";

export interface Behavior extends BehaviorOption {
    // 提供图引用，绑定和非绑定专用操作
    // graph: G6.Graph | null,
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

/*
 * 键盘事件，是否支持多按键处理
 */
export interface KeyPressed {
    /** 是否支持多选 */
    multiple: boolean;
    /** 是否按下多选 */
    keydown: boolean;
    /** 多选按键码值 */
    keyCode: number;
}

export interface KeyAllowed {
    /** 允许拖拽 KeyCode */
    allowKeyCode: number[];
    /** 禁止拖拽 KeyCode */
    notAllowKeyCode: number[];
}