import {Behavior, Cv, IItem, KeyPressed, MgrBehavior, T} from "@/g6/ambient";
import * as G6 from '@antv/g6';

interface ClickItemBehavior extends Behavior {
    /* 处理元素点击事件 */
    handleClickItem({item}: { item: IItem }): void;

    /* 处理画布点击事件 */
    handleClickCanvas(): void;

    /* 处理按钮按下 */
    handleKeyDown(e: KeyboardEvent): void;

    /* 处理按钮抬起 */
    handleKeyUp(e: KeyboardEvent): void;
}

const clickItemBehavior: ClickItemBehavior & ThisType<ClickItemBehavior & KeyPressed> = {

    getDefaultCfg(): KeyPressed {
        return {
            multiple: true,
            keydown: false,
            keyCode: 17,
        };
    },

    getEvents() {
        const events = {};
        events[Cv.EventGraphNode.onNodeClick] = 'handleClickItem';
        events[Cv.EventGraphEdge.onEdgeClick] = 'handleClickItem';
        events[Cv.EventGraphCanvas.onCanvasClick] = 'handleClickCanvas';
        events[Cv.EventGraphCommon.onKeyDown] = 'handleKeyDown';
        events[Cv.EventGraphCommon.onKeyUp] = 'handleKeyUp';
        return events;
    },

    handleClickItem({item}: { item: IItem }) {
        const graph = this.graph as G6.Graph;

        if (T.isMind(graph) && T.isEdge(item)) {
            return;
        }

        const isSelected = item.hasState(Cv.StateItem.Selected);

        if (this.multiple && this.keydown) {
            graph.setItemState(item, Cv.StateItem.Selected, !isSelected);
        } else {
            T.clearSelected(graph, selectedItem => selectedItem !== item);

            if (!isSelected) {
                graph.setItemState(item, Cv.StateItem.Selected, true);
            }
        }

        graph.emit(Cv.EventEditor.onGraphStateChange, {
            graphState: T.getGraphState(graph)
        })
    },

    handleClickCanvas() {
        const graph = this.graph as G6.Graph;

        T.clearSelected(graph);

        graph.emit(Cv.EventEditor.onGraphStateChange, {
            graphState: Cv.StateGraph.CanvasSelected,
        })
    },

    handleKeyDown(e: KeyboardEvent) {
        this.keydown = (e.keyCode || e.which) === this.keyCode;
    },

    handleKeyUp(e: KeyboardEvent) {
        this.keydown = false;
    }
};

MgrBehavior.registry('click-item', clickItemBehavior);