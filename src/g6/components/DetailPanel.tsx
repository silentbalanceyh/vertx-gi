import React from 'react';
import {Cv, IEdge, INode, T} from '../ambient';
import {EditorContextProp, WrapEditorContext} from "./EditorContext";

export interface DetailPanelProp {
    type: Cv.TypeDetail;
    nodes: INode[];
    edges: IEdge[];
}

class DetailPanel {

    static create = function <P extends DetailPanelProp>(type: DetailPanelProp) {
        return function (WrappedComponent: React.ComponentType<P>) {
            type TypedPanelProp = EditorContextProp & Omit<P, keyof DetailPanelProp>;
            type TypedPanelState = { graphState: Cv.StateGraph };

            class TypedPanel extends React.Component<TypedPanelProp, TypedPanelState> {
                state = {
                    graphState: Cv.StateGraph.CanvasSelected,
                }

                componentDidMount() {
                    const {graph} = this.props;

                    graph.on(Cv.EventEditor.onGraphStateChange, ({graphState}) => {
                        this.setState({graphState});
                    });
                }

                render() {
                    const {graph} = this.props;
                    const {graphState} = this.state;

                    if (graphState !== `${type}Selected`) {
                        return false;
                    }

                    const nodes = T.getSelectedNodes(graph);
                    const edges = T.getSelectedEdges(graph);
                    return (
                        <WrappedComponent type={type} nodes={nodes} edges={edges} {...(this.props as any)} />
                    )
                }
            }

            return WrapEditorContext<TypedPanelProp>(TypedPanel);
        }
    }
}

export default DetailPanel;