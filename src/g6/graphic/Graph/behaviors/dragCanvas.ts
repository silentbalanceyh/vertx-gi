import {Behavior, Cv, KeyAllowed, MgrBehavior} from "@/g6/ambient";
import {IG6GraphEvent} from "@antv/g6/lib/types";
import * as G6 from "@antv/g6";
import {IGraph} from "@antv/g6/lib/interface/graph";

interface DragCanvasBehavior extends Behavior {
    /* 开始拖拽的坐标 */
    origin: {
        x: number;
        y: number;
    } | null;
    /** 当前按键码值 **/
    keyCode: number | null;
    /* 正在拖拽的图标 */
    dragging: boolean;
    /** 处理窗口鼠标弹起 */
    handleWindowMouseUp: (e: MouseEvent) => void | null;

    /* 是否能够拖拽 */
    canDrag(): boolean;

    /** 更新当前窗口 **/
    updateViewport(e: IG6GraphEvent): void;

    /* 处理画布鼠标按钮 */
    handleCanvasMouseDown(e: IG6GraphEvent): void;

    /** 处理画布鼠标移动 */
    handleCanvasMouseMove(e: IG6GraphEvent): void;

    /** 处理画布鼠标弹起 */
    handleCanvasMouseUp(e: MouseEvent): void;

    /** 处理鼠标移出画布 */
    handleCanvasMouseLeave(e: IG6GraphEvent): void;

    /** 处理画布鼠标右键 */
    handleCanvasContextMenu(e: IG6GraphEvent): void;

    /** 处理按键按下 */
    handleKeyDown(e: KeyboardEvent): void;

    /** 处理按键抬起 */
    handleKeyUp(e: KeyboardEvent): void;
}

const dragCanvasBehavior: DragCanvasBehavior & ThisType<DragCanvasBehavior & KeyAllowed> = {
    graph: null,

    bind(e: IGraph) {
        this.graph = e as G6.Graph;
    },

    unbind(e: IGraph) {
        this.graph = null;
    },

    origin: null,

    keyCode: null,

    dragging: false,

    handleWindowMouseUp: null,

    getDefaultCfg(): KeyAllowed {
        return {
            allowKeyCode: [],
            notAllowKeyCode: [16],
        };
    },

    getEvents() {
        const events = {};
        events[Cv.EventGraphCanvas.onCanvasMouseDown] = 'handleCanvasMouseDown';
        events[Cv.EventGraphCanvas.onCanvasMouseMove] = 'handleCanvasMouseMove';
        events[Cv.EventGraphCanvas.onCanvasMouseUp] = 'handleCanvasMouseUp';
        events[Cv.EventGraphCanvas.onCanvasMouseLeave] = 'handleCanvasMouseLeave';
        events[Cv.EventGraphCanvas.onCanvasContextMenu] = 'handleCanvasContextMenu';
        events[Cv.EventGraphCommon.onKeyDown] = 'handleKeyDown';
        events[Cv.EventGraphCommon.onKeyUp] = 'handleKeyUp';
        return events;
    },

    canDrag() {
        const {keyCode, allowKeyCode, notAllowKeyCode} = this;
        let isAllow = !!!allowKeyCode.length;
        if (!keyCode) {
            return isAllow;
        }

        if (allowKeyCode.length && allowKeyCode.includes(keyCode)) {
            isAllow = true;
        }

        if (notAllowKeyCode.includes(keyCode)) {
            isAllow = false;
        }
        return isAllow;
    },

    updateViewport(e: IG6GraphEvent) {
        const {clientX, clientY} = e;

        const dx = clientX - this.origin.x;
        const dy = clientY - this.origin.y;

        this.origin = {
            x: clientX,
            y: clientY,
        };

        this.graph.translate(dx, dy);
        this.graph.paint();
    },

    handleCanvasMouseDown(e: IG6GraphEvent) {
        if (!this.shouldBegin.call(this, e)) {
            return;
        }
        if (!this.canDrag()) {
            return;
        }

        this.origin = {
            x: e.clientX,
            y: e.clientY
        };

        this.dragging = false;
    },

    handleCanvasMouseMove(e: IG6GraphEvent) {
        if (!this.shouldUpdate.call(this, e)) {
            return;
        }
        if (!this.canDrag()) {
            return;
        }
        if (!this.origin) {
            return;
        }

        if (!this.dragging) {
            this.graph.emit(Cv.EventGraphCanvas.onCanvasDragStart, {
                type: 'dragstart',
                ...e,
            });

            this.dragging = true;
        } else {
            this.graph.emit(Cv.EventGraphCanvas.onCanvasDrag, {
                type: 'drag',
                ...e,
            });

            this.updateViewport(e);
        }
    },

    handleCanvasMouseUp(e: MouseEvent) {
        if (!this.shouldEnd.call(this, e)) {
            return;
        }

        if (!this.canDrag()) {
            return;
        }

        this.graph.emit(Cv.EventGraphCanvas.onCanvasDragEnd, {
            type: 'dragend',
            ...e
        });

        this.origin = null;
        this.dragging = false;

        if (this.handleWindowMouseUp) {
            document.body.removeEventListener(Cv.EventGraphCommon.onMouseUp, this.handleWindowMouseUp, false);
            this.handleWindowMouseUp = null;
        }
    },

    handleCanvasMouseLeave(e: IG6GraphEvent) {
        const elementCanvas = this.graph.get(Cv.ModeRender.Canvas).get('el');

        if (this.handleWindowMouseUp) {
            return;
        }

        this.handleWindowMouseUp = e => {
            if (elementCanvas !== e.target) {
                this.handleCanvasMouseUp(e);
            }
        };

        document.body.addEventListener(Cv.EventGraphCommon.onMouseUp, this.handleWindowMouseUp, false);
    },

    handleCanvasContextMenu(e: IG6GraphEvent) {
        this.origin = null;
        this.dragging = false;
    },

    handleKeyDown(e: KeyboardEvent) {
        this.keyCode = e.keyCode || e.which;
    },

    handleKeyUp(e: KeyboardEvent) {
        this.keyCode = null;
    }
};

MgrBehavior.registry('drag-canvas', dragCanvasBehavior);