import React from 'react';
import pick from 'lodash/pick';
import {EditorContextProp, WrapEditorContext} from "./EditorContext";
import Item from './ItemElement';
import {Ambient, Cv} from "@/g6/ambient";

import {IGroup} from '@antv/g-base';
import {IShape} from '@antv/g-canvas/lib/interfaces';

interface ItemPanelProp extends EditorContextProp {
    style?: React.CSSProperties;
    className: string;
}

interface ItemPanelState {
}

class ItemPanel extends React.Component<ItemPanelProp, ItemPanelState> {
    static Item = Item;

    componentDidMount() {
        document.addEventListener(Cv.EventGraphCommon.onMouseUp, this.handleMouseUp, false);
    }

    componentWillUnmount() {
        document.removeEventListener(Cv.EventGraphCommon.onMouseUp, this.handleMouseUp, false);
    }

    handleMouseUp = () => {
        const {graph} = this.props;

        if (Cv.ModeGraph.Default === graph.getCurrentMode()) {
            return;
        }

        const group: IGroup = graph.get('group');
        const shape: IShape = group.findByClassName(Ambient.component.itemPanel.delegateClass) as IShape;

        if (shape) {
            shape.remove(true);
            graph.paint();
        }

        Ambient.component.itemPanel.model = null;
        graph.setMode(Cv.ModeGraph.Default);
    }

    render() {
        const {children} = this.props;
        return (
            <div {...pick(this.props, ['style', 'className'])}>{children}</div>
        )
    }
}

export {Item};
export default WrapEditorContext<ItemPanelProp>(ItemPanel);