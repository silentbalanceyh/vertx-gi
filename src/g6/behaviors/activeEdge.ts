import {Behavior, Cv, IEdge, MgrBehavior} from '@/g6/ambient';
import {IG6GraphEvent} from "@antv/g6/lib/types";
import {IGraph} from "@antv/g6/lib/interface/graph";
import * as G6 from '@antv/g6';

interface ActiveEdgeBehavior extends Behavior {
    setAllItemStates(e: IG6GraphEvent): void;

    clearAllItemStates(e: IG6GraphEvent): void;
}

const activeEdgeBehavior: ActiveEdgeBehavior = {
    graph: null,

    bind(e: IGraph) {
        this.graph = e as G6.Graph;
    },

    unbind(e: IGraph) {
        this.graph = null;
    },

    graphType: Cv.TypeGraph.Flow,

    getEvents() {
        const events = {};
        events[Cv.EventGraphEdge.onEdgeMouseEnter] = 'setAllItemStates';
        events[Cv.EventGraphEdge.onEdgeMouseLeave] = 'clearAllItemStates';
        return events;
    },

    shouldBegin(e?: IG6GraphEvent) {
        // 拖拽后没有目标节点，只有x,y 坐标，不点亮
        const edge = e.item as IEdge;
        return !edge.getTarget().getBBox().x;
    },

    setAllItemStates(e: IG6GraphEvent) {
        if (!this.shouldBegin(e)) {
            return;
        }

        // 1. 激活前选中的边
        const {graph} = this;
        const edge = e.item as IEdge;
        graph.setItemState(edge, Cv.StateValue.Active, true);

        // 2. 激活边关联的 sourceNode 和 targetNode
        graph.setItemState(edge.getTarget(), Cv.StateValue.Active, true);
        graph.setItemState(edge.getSource(), Cv.StateValue.Active, true);
    },

    clearAllItemStates(e: IG6GraphEvent) {
        if (!this.shouldBegin(e)) {
            return;
        }

        // 状态还原
        const {graph} = this;
        const edge = e.item as IEdge;
        graph.setItemState(edge, Cv.StateValue.Active, false);
        graph.setItemState(edge.getTarget(), Cv.StateValue.Active, false);
        graph.setItemState(edge.getSource(), Cv.StateValue.Active, false);
    },
};

MgrBehavior.registry('active-edge', activeEdgeBehavior);