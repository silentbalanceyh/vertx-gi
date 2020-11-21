import {Behavior, Cv, IEdge, INode, MgrBehavior, T} from "@/g6/ambient";
import {IG6GraphEvent} from "@antv/g6/lib/types";
import {IGraph} from "@antv/g6/lib/interface/graph";
import * as G6 from "@antv/g6";

interface RecallEdgeBehavior extends Behavior {
    /** 当前高亮边线 **/
    edges: IEdge[];

    /** 设置高亮状态 **/
    /** 设置高亮状态 */
    setHighLightState(edges: IEdge[]): void;

    /** 清除高亮状态 */
    clearHighLightState(): void;

    /** 处理节点点击 */
    handleNodeClick(e: IG6GraphEvent): void;

    /** 处理边线点击 */
    handleEdgeClick(e: IG6GraphEvent): void;

    /** 处理画布点击 */
    handleCanvasClick(e: IG6GraphEvent): void;
}

const recallEdgeBehavior: RecallEdgeBehavior = {

    graph: null,

    bind(e: IGraph) {
        this.graph = e as G6.Graph;
    },

    unbind(e: IGraph) {
        this.graph = null;
    },

    edges: [],

    getEvents() {
        const events = {};
        events[Cv.EventGraphNode.onNodeClick] = 'handleNodeClick';
        events[Cv.EventGraphEdge.onEdgeClick] = 'handleEdgeClick';
        events[Cv.EventGraphCanvas.onCanvasClick] = 'handleCanvasClick';
        return events;
    },

    setHighLightState(edges: IEdge[]) {
        const {graph} = this;

        this.clearHighLightState();

        T.executeBatch(graph, () => {
            edges.forEach(item => graph.setItemState(item, Cv.StateItem.HighLight, true));
        });

        this.edges = edges;
    },

    clearHighLightState() {
        const {graph} = this;
        T.executeBatch(graph, () => {
            this.edges.forEach(item => graph.setItemState(item, Cv.StateItem.HighLight, false));
        });

        this.edges = [];
    },

    handleNodeClick({item}) {
        const {graph} = this;
        let edges: IEdge[] = [];

        if (T.isFlow(graph)) {
            edges = T.getFlowRecallEdges(graph, item as INode);
        }

        if (T.isMind(graph)) {
            edges = T.getMindRecallEdges(graph as G6.TreeGraph, item as INode);
        }

        this.setHighLightState(edges);
    },

    handleEdgeClick() {
        this.clearHighLightState();
    },

    handleCanvasClick() {
        this.clearHighLightState();
    },
}

MgrBehavior.registry("recall-edge", recallEdgeBehavior);