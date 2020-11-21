import {StateGraph, StateItem, TypeItem} from './cv';
import * as G6 from '@antv/g6';
import {IEdge, IItem, INode} from './interfaces.native';
import {Behavior} from "./interfaces.action";
import {BehaviorOption} from "@antv/g6/lib/types";

/** 获取选中节点 */
export function getSelectedNodes(graph: G6.Graph): INode[] {
    return graph.findAllByState(TypeItem.Node, StateItem.Selected);
}

/** 获取选中边线 */
export function getSelectedEdges(graph: G6.Graph): IEdge[] {
    return graph.findAllByState(TypeItem.Edge, StateItem.Selected);
}

/** 获取图表状态 */
export function getGraphState(graph: G6.Graph): StateGraph {
    let graphState: StateGraph = StateGraph.GroupSelected;

    const selectedNodes = getSelectedNodes(graph);
    const selectedEdges = getSelectedEdges(graph);

    if (selectedNodes.length === 1 && !selectedEdges.length) {
        graphState = StateGraph.NodeSelected;
    }

    if (selectedEdges.length === 1 && !selectedNodes.length) {
        graphState = StateGraph.EdgeSelected;
    }

    if (!selectedNodes.length && !selectedEdges.length) {
        graphState = StateGraph.CanvasSelected;
    }
    return graphState;
}

/** 判断是否流程图 */
export function isFlow(graph: G6.Graph) {
    return graph.constructor === G6.Graph;
}

/** 判断是否脑图 */
export function isMind(graph: G6.Graph) {
    return graph.constructor === G6.TreeGraph;
}

/** 转换 **/
export function toBehaviorOption(behavior: Behavior): BehaviorOption {

    return null;
}

/** 清空状态 **/
export function clearSelected(graph: G6.Graph, shouldUpdate: (item: IItem) => boolean = () => true) {
    const selectedNodes = getSelectedNodes(graph);
    const selectedEdges = getSelectedEdges(graph);
    executeBatch(graph, () => {
        [...selectedNodes, ...selectedEdges].forEach(item => {
            if (shouldUpdate(item)) {
                graph.setItemState(item, StateItem.Selected, false);
            }
        })
    })
}

/* 批量执行 */
export function executeBatch(graph: G6.Graph, execute: Function) {
    const autoPoint = graph.get('autoPaint');

    graph.setAutoPaint(false);

    execute();

    graph.paint();
    graph.setAutoPaint(autoPoint);
}