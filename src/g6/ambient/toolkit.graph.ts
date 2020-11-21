import {EventEditor, StateGraph, StateItem, TypeItem} from './cv';
import * as G6 from '@antv/g6';
import {IEdge, IItem, INode} from './interfaces.native';

/** 获取选中节点 */
export function getSelectedNodes(graph: G6.Graph): INode[] {
    return graph.findAllByState(TypeItem.Node, StateItem.Selected);
}

/** 获取选中边线 */
export function getSelectedEdges(graph: G6.Graph): IEdge[] {
    return graph.findAllByState(TypeItem.Edge, StateItem.Selected);
}

/** 设置选中元素 */
export function setSelectedItems(graph: G6.Graph, items: IItem[] | string[]) {
    executeBatch(graph, () => {
        const selectedNodes = getSelectedNodes(graph);
        const selectedEdges = getSelectedEdges(graph);

        [...selectedNodes, ...selectedEdges].forEach(node => {
            graph.setItemState(node, StateItem.Selected, false);
        });

        items.forEach(item => {
            graph.setItemState(item, StateItem.Selected, true);
        });
    });

    graph.emit(EventEditor.onGraphStateChange, {
        graphState: getGraphState(graph),
    });
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

/** 判断是否节点 */
export function isNode(item: IItem) {
    return item.getType() === TypeItem.Node;
}

/** 判断是否边线 */
export function isEdge(item: IItem) {
    return item.getType() === TypeItem.Edge;
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


/** 获取回溯路径 - Flow */
export function getFlowRecallEdges(graph: G6.Graph, node: INode, targetIds: string[] = [], edges: IEdge[] = []) {
    const inEdges: IEdge[] = node.getInEdges();

    if (!inEdges.length) {
        return [];
    }

    inEdges.map(edge => {
        const sourceId = edge.getModel().source as string;
        const sourceNode = graph.findById(sourceId) as INode;

        edges.push(edge);

        const targetId = node.get('id');

        targetIds.push(targetId);

        if (!targetIds.includes(sourceId)) {
            getFlowRecallEdges(graph, sourceNode, targetIds, edges);
        }
    });

    return edges;
}

/** 获取回溯路径 - Mind */
export function getMindRecallEdges(graph: G6.TreeGraph, node: INode, edges: IEdge[] = []) {
    const parentNode = node.get('parent');

    if (!parentNode) {
        return edges;
    }

    node.getEdges().forEach(edge => {
        const sourceId = edge.getModel().source;

        if (sourceId === parentNode.get('id')) {
            edges.push(edge);
        }
    });

    return getMindRecallEdges(graph, parentNode, edges);
}