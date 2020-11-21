import {Behavior, Cv, IItem} from "@/g6/ambient";
import * as G6 from "@antv/g6";

interface HoverItemBehavior extends Behavior {

    /** 处理鼠标进入 */
    handleItemMouseenter({item}: { item: IItem }): void;

    /** 处理鼠标移出 */
    handleItemMouseleave({item}: { item: IItem }): void;
}

const hoverItemBehavior: HoverItemBehavior = {

    getEvents() {
        const events = {};
        events[Cv.EventGraphNode.onNodeMouseEnter] = 'handleItemMouseenter';
        events[Cv.EventGraphEdge.onEdgeMouseEnter] = 'handleItemMouseenter';
        events[Cv.EventGraphNode.onNodeMouseLeave] = 'handleItemMouseleave';
        events[Cv.EventGraphEdge.onEdgeMouseLeave] = 'handleItemMouseleave';
        return events;
    },

    handleItemMouseenter({item}: { item: IItem }) {
        const graph = this.graph as G6.Graph;

        graph.setItemState(item, Cv.StateItem.Active, true);
    },

    handleItemMouseleave({item}: { item: IItem }) {
        const graph = this.graph as G6.Graph;

        graph.setItemState(item, Cv.StateItem.Active, false);
    }
}