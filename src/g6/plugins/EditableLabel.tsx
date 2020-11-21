import React from 'react';
import ReactDOM from 'react-dom';

import {EditorContextProp, WrapEditorContext} from "@/g6/components";
import {Ambient, Cv, T} from "@/g6/ambient";
import * as G6 from '@antv/g6';

interface EditableLabelProp extends EditorContextProp {
    /* 标签图形名称 */
    labelClassName?: string;
    /* 标签最大宽度 */
    labelMaxWidth?: number;
}

interface EditableLabelState {
    visible: boolean;
}

class EditableLabel extends React.Component<EditableLabelProp, EditableLabelState> {
    static defaultProps = {
        labelClassName: 'node-label',
        labelMaxWidth: 100,
    }
    el: HTMLDivElement = null;

    state = {
        visible: false
    }

    componentDidMount() {
        const {graph} = this.props;

        graph.on(Cv.EventEditor.onLabelStateChange, ({labelState}) => {
            if (labelState === Cv.StateLabel.Show) {
                this.showUi();
            } else {
                this.hideUi();
            }
        });

        graph.on(Cv.EventGraphNode.onNodeDoubleClick, () => this.showUi());
    }

    updateUi = () => {
        const {graph, executeCommand} = this.props;

        const node = T.getSelectedNodes(graph)[0];
        const model = node.getModel();

        const {textContent: label} = this.el;

        if (label === model.label) {
            return;
        }

        executeCommand('update', {
            id: model.id,
            updateModel: {label},
            forceRefreshLayout: T.isMind(graph)
        })
    }

    showUi = () => {
        Ambient.plugin.editableLabel.state = 'show';

        this.setState({visible: true}, () => {
            const {el} = this;
            if (el) {
                el.focus();
                document.execCommand('selectAll', false, null);
            }
        })
    }

    hideUi = () => {
        Ambient.plugin.editableLabel.state = 'hide';

        this.setState({visible: false})
    }

    handleBlur = () => {
        this.updateUi();
        this.hideUi();
    }

    handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        e.stopPropagation();

        const {key} = e;

        if (['Tab'].includes(key)) {
            e.preventDefault();
        }

        if (['Enter', 'Escape', 'Tab'].includes(key)) {
            this.updateUi();
            this.hideUi();
        }
    }


    render() {
        const {graph, labelClassName, labelMaxWidth} = this.props;

        const mode = graph.getCurrentMode();
        const zoom = graph.getZoom();

        if (mode === Cv.ModeGraph.Readonly) {
            return null;
        }

        const node = T.getSelectedNodes(graph)[0];

        if (!node) {
            return null;
        }

        const model = node.getModel();
        const group = node.getContainer();

        const label = model.label;
        const labelShape = group.findByClassName(labelClassName);

        if (!labelShape) {
            return null;
        }

        const {visible} = this.state;

        if (!visible) {
            return null;
        }

        // Get the label offset
        const {x: relativeX, y: relativeY} = labelShape.getBBox();
        const {x: absoluteX, y: absoluteY} = G6.Util.applyMatrix(
            {
                x: relativeX,
                y: relativeY,
            },
            node.getContainer().getMatrix(),
        );

        const {x: left, y: top} = graph.getCanvasByPoint(absoluteX, absoluteY);

        // Get the label size
        const {width, height} = labelShape.getBBox();

        // Get the label font
        const font = labelShape.attr('font');

        const style: React.CSSProperties = {
            position: 'absolute',
            top,
            left,
            width: 'auto',
            height: 'auto',
            minWidth: width,
            minHeight: height,
            maxWidth: labelMaxWidth,
            font,
            background: 'white',
            border: '1px solid #1890ff',
            outline: 'none',
            transform: `scale(${zoom})`,
            transformOrigin: 'left top',
        };

        return ReactDOM.createPortal(
            <div
                ref={el => {
                    this.el = el;
                }}
                style={style}
                contentEditable
                onBlur={this.handleBlur}
                onKeyDown={this.handleKeyDown}
            >
                {label}
            </div>,
            graph.get('container'),
        );
    }
}

export default WrapEditorContext<EditableLabelProp>(EditableLabel);