import React from 'react';
import ReactDOM from 'react-dom';
import delay from 'lodash/delay';
import {EditorContextProp, WrapEditorContext} from "../components";
import {Ambient, Cv, IItem} from '../ambient';

/* Popover 类型 */
export enum TypeItemPopover {
    Node = 'node',              // 节点类型
    Edge = 'edge',              // 非节点类型
}

interface ItemPopoverProp extends EditorContextProp {
    /* 浮游层类型 */
    type?: TypeItemPopover;
    /* 浮游层内容 */
    renderContent: (
        item: IItem,
        position: {
            minX: number;
            minY: number;
            maxX: number;
            maxY: number;
            centerX: number;
            centerY: number;
        }
    ) => React.ReactNode
}

interface ItemPopoverState {
    visible: boolean,
    content: React.ReactNode
}

class ItemPopover extends React.Component<ItemPopoverProp, ItemPopoverState> {
    static defaultProps = {
        type: TypeItemPopover.Node
    }

    state = {
        visible: false,
        content: null
    }

    mouseEnterTimeoutID = 0;
    mouseLeaveTimeoutID = 0;

    componentDidMount() {
        const {graph, type} = this.props;
        if (TypeItemPopover.Node === type) {
            graph.on(Cv.EventGraphNode.onNodeMouseEnter, ({item}) => {
                clearTimeout(this.mouseLeaveTimeoutID);

                this.mouseEnterTimeoutID = delay(this.showUi, 250, item);
            });

            graph.on(Cv.EventGraphNode.onNodeMouseLeave, () => {
                clearTimeout(this.mouseEnterTimeoutID);

                this.mouseLeaveTimeoutID = delay(this.hideUi, 250);
            })
        }
    }

    showUi = (item: IItem) => {
        const {graph, renderContent} = this.props;

        Ambient.plugin.itemPopover.state = 'show';

        const {minX, minY, maxX, maxY, centerX, centerY} = item.getBBox();

        const {x: itemMinX, y: itemMinY} = graph.getCanvasByPoint(minX, minY);
        const {x: itemMaxX, y: itemMaxY} = graph.getCanvasByPoint(maxX, maxY);
        const {x: itemCenterX, y: itemCenterY} = graph.getCanvasByPoint(centerX, centerY);

        const position = {
            minX: itemMinX,
            minY: itemMinY,
            maxX: itemMaxX,
            maxY: itemMaxY,
            centerX: itemCenterX,
            centerY: itemCenterY,
        };

        this.setState({
            visible: true,
            content: renderContent(item, position),
        });
    }

    hideUi = () => {
        Ambient.plugin.itemPopover.state = 'hide';

        this.setState({
            visible: false,
            content: null,
        });
    }

    render() {
        const {graph} = this.props;
        const {visible, content} = this.state;

        if (!visible) {
            return null;
        }

        return ReactDOM.createPortal(content, graph.get('container'));
    }
}

export default WrapEditorContext<ItemPopoverProp>(ItemPopover);