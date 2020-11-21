import React from 'react';
import pick from 'lodash/pick';

import {EditorContextProp, WrapEditorContext} from './EditorContext';
import {Ambient, Cv, DataNode} from "@/g6/ambient";

export interface ItemProp extends EditorContextProp {
    style?: React.CSSProperties;
    className?: string;
    type?: Cv.TypeItem,
    model: DataNode
}

export interface ItemState {
}

class ItemElement extends React.Component<ItemProp, ItemState> {
    static defaultProps = {
        type: Cv.TypeItem.Node,
    };

    handleMouseDown = () => {
        const {graph, type, model} = this.props;
        if (type === Cv.TypeItem.Node) {
            // 全局赋值
            Ambient.component.itemPanel.model = model;
            graph.setMode(Cv.ModeGraph.AddNode);
        }
    }

    render() {
        const {children} = this.props;

        return (
            <div {...pick(this.props, ['style', 'className'])} onMouseDown={this.handleMouseDown}>
                {children}
            </div>
        );
    }
}

export default WrapEditorContext<ItemProp>(ItemElement);