import {Behavior, Cv, IItem, MgrBehavior} from "@/g6/ambient";
import * as G6 from "@antv/g6";
import {IGraph} from "@antv/g6/lib/interface/graph";

interface HoverItemBehavior extends Behavior {

    /** 处理鼠标进入 */
    handleItemMouseenter({item}: { item: IItem }): void;

    /** 处理鼠标移出 */
    handleItemMouseleave({item}: { item: IItem }): void;
}

const hoverItemBehavior: HoverItemBehavior = {
    graph: null,

    bind(e: IGraph) {
        this.graph = e as G6.Graph;
    },

    unbind(e: IGraph) {
        this.graph = null;
    },

    getEvents() {
        const events = {};
        events[Cv.EventGraphNode.onNodeMouseEnter] = 'handleItemMouseenter';
        events[Cv.EventGraphEdge.onEdgeMouseEnter] = 'handleItemMouseenter';
        events[Cv.EventGraphNode.onNodeMouseLeave] = 'handleItemMouseleave';
        events[Cv.EventGraphEdge.onEdgeMouseLeave] = 'handleItemMouseleave';
        return events;
    },

    handleItemMouseenter({item}: { item: IItem }) {

        this.graph.setItemState(item, Cv.StateItem.Active, true);
    },

    handleItemMouseleave({item}: { item: IItem }) {
        this.graph.setItemState(item, Cv.StateItem.Active, false);
    }
};

MgrBehavior.registry('hover-item', hoverItemBehavior);