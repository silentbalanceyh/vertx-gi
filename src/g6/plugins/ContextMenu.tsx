import React from 'react';
import ReactDOM from 'react-dom';
import {EditorContextProp, WrapEditorContext} from "../components";
import {Ambient, Cv, IItem, T} from '../ambient';

/* 右键菜单类型 */
export enum TypeContextMenu {
    Canvas = 'canvas',          // 画布右键菜单
    Node = 'node',              // 节点右键菜单
    Edge = 'edge',              // 线右键菜单
}

interface ContextMenuProp extends EditorContextProp {
    /* 菜单类型 */
    type?: TypeContextMenu,
    /* 菜单内容 */
    renderContent: (item: IItem, position: { x: number, y: number }, hide: () => void) => React.ReactNode;
}

interface ContextMenuState {
    visible: boolean;
    content: React.ReactNode;
}

class ContextMenu extends React.Component<ContextMenuProp, ContextMenuState> {
    static defaultProps = {
        type: TypeContextMenu.Canvas,
    }

    state = {
        visible: false,
        content: null
    }

    componentDidMount() {
        const {graph, type} = this.props;
        switch (type) {
            case TypeContextMenu.Canvas:
                graph.on(Cv.EventGraphCanvas.onCanvasContextMenu, ({x, y}) => this.showContext(x, y));
                break;
            case TypeContextMenu.Node:
                graph.on(Cv.EventGraphNode.onNodeContextMenu, ({x, y, item}) => this.showContext(x, y, item));
                break;
            case TypeContextMenu.Edge:
                graph.on(Cv.EventGraphEdge.onEdgeContextMenu, ({x, y, item}) => this.showContext(x, y, item));
                break;
            default:
                break;
        }

        graph.on(Cv.EventGraphCommon.onClick, () => this.hideContext());
    }

    showContext = (x: number, y: number, item?: IItem) => {
        const {graph, renderContent} = this.props;

        T.clearSelected(graph);

        if (item) {
            graph.setItemState(item, Cv.StateItem.Selected, true);
        }

        Ambient.plugin.contextMenu.state = 'show';
        Ambient.clipboard.point = {
            x,
            y
        }

        const position = graph.getCanvasByPoint(x, y);

        this.setState({
            visible: true,
            content: renderContent(item, position, this.hideContext),
        })
    }

    hideContext = () => {
        Ambient.plugin.contextMenu.state = 'hide';

        this.setState({
            visible: false,
            content: null
        })
    }

    render() {
        const {graph} = this.props;
        const {visible, content} = this.state;

        if (!visible) {
            return false;
        }

        return ReactDOM.createPortal(content, graph.get('container'));
    }
}

export default WrapEditorContext<ContextMenuProp>(ContextMenu);