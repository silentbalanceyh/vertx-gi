import {StateItem, TypeItem} from "./cv";
import React from 'react';
import {IGroup} from '@antv/g-base'; // 分组
import {IEdge, INode} from './interfaces.native';

interface LabelStyle {
    // 文本颜色
    fill?: string;
    // 文本描边颜色
    stroke?: string;
    // 文本描边宽度
    lineWidth?: number;
    // 文本透明度
    opacity?: number;
    // 文本字体属性
    font?: string;
    // 文本字体大小
    fontSize?: number;

    [propName: string]: any;
}

interface ConfigLabelNode {
    position?: 'center' | 'top' | 'right' | 'bottom' | 'left';
    offset?: number;
    style?: LabelStyle;
}

interface ConfigLabelEdge {
    position?: 'start' | 'end' | 'center';
    refX?: number;
    refY?: number;
    style?: LabelStyle;
    autoRotate?: boolean;
}

/*
 * G6 内置节点
 */
export interface DataNode {
    id?: string;
    x?: number;
    y?: number;
    size?: number | number[];
    anchorPoints?: number[][];
    shape?: string;
    style?: {
        // 节点填充颜色
        fill?: string;
        // 节点描边颜色
        stroke?: string;
        // 节点描边宽度
        lineWidth?: number;
        // 节点阴影颜色
        shadowColor?: string;
        // 节点阴影范围
        shadowBlur?: number;
        // 节点阴影 x 方向偏移量
        shadowOffsetX?: number;
        // 节点阴影 y 方向偏移量
        shadowOffsetY?: number;

        [propName: string]: any;
    };
    label?: string;
    labelCfg?: ConfigLabelNode;

    // 节点中心位置
    center?: 'center' | 'topLeft';

    [propName: string]: any;
}

export interface DataEdge {
    source: string;
    target: string;
    sourceAnchor?: number;
    targetAnchor?: number;
    startPoint?: {
        x: number;
        y: number;
    };
    endPoint?: {
        x: number;
        y: number;
    };
    shape?: string;
    style?: {
        // 边线颜色
        stroke?: string;
        // 边线宽度
        lineWidth?: number;
        // 边线响应宽度
        lineAppendWidth?: number;
        // 边线结束箭头
        endArrow: boolean;
        // 边线透明度
        strokeOpacity: number;
        // 边线阴影颜色
        shadowColor?: string;
        // 边线阴影范围
        shadowBlur?: number;
        // 边线阴影 x 方向偏移量
        shadowOffsetX?: number;
        // 边线阴影 y 方向偏移量
        shadowOffsetY?: number;
    };
    label?: string;
    labelCfg?: ConfigLabelEdge;

    [propName: string]: any;
}

/*
 * 流程图和拓扑图
 */
export interface GraphFlow {
    nodes: DataNode[],
    edges: DataEdge[],
}

export interface GraphTopology extends GraphFlow {

}

export interface GraphMind extends DataNode {
    root?: boolean;         // 是否根节点
    collapsed?: boolean;    // 是否合并
    children: GraphMind[];  // 所有子节点
}

/*
 * 自定义形状
 * - GShape
 * - GNode
 * - GCombo
 * - GEdge
 */
export interface Shape<T, M> {
    // 配置
    options?: any;

    // 属性
    itemType: TypeItem;

    // 绘制专用函数
    draw?(model: M, group: IGroup): IGroup;

    drawShape?(model: M, group: IGroup): void;

    drawLabel?(model: M, group: IGroup): IGroup;

    afterDraw?(model: M, group: IGroup): void;

    // 更新专用函数
    update?(model: M, item: T): void;

    afterUpdate?(model: M, item: T): void;

    shouldUpdate?(type: TypeItem): boolean;

    setState?(name: StateItem, value: boolean, item: T): void;

    // 通用函数
    getShape?(type: TypeItem): ShapeNode | ShapeEdge;

    getLabelStyle?(model: M, labelConfig: ConfigLabelNode | ConfigLabelEdge, group: IGroup): React.CSSProperties;

    getLabelStyleByPosition?(model: M, labelConfig: ConfigLabelNode | ConfigLabelEdge, group: IGroup): React.CSSProperties;

    getShapeStyle?(model: M): React.CSSProperties;
}

export interface ShapeNode<M = DataNode> extends Shape<INode, M> {
    // 属性
    labelPosition?: 'center' | 'top' | 'right' | 'bottom' | 'left';

    // 通用
    getAnchorPoints?(model: M): number[][];

    getSize?(model: M): number[];
}

export interface ShapeEdge<M = DataEdge> extends Shape<IEdge, M> {
    // 属性
    labelPosition?: 'start' | 'end' | 'center';
    labelAutoRotate?: boolean;

    // 通用
    getControlPoints?: number[][];

    getPath?(points: { x: number; y: number }[]): [];

    getPathPoints?(model: M): any;
}

export * from './interfaces.action';