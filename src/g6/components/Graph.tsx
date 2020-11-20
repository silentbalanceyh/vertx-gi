import React from 'react';
import pick from 'lodash/pick';
import {Ambient, Cv, EventGraphNative, EventGraphReact, EventGraphReactProp, GraphFlow, GraphMind} from '../ambient';
import {EditorContextPropPrivate, WrapEditorContextPrivate} from "./EditorContext";
import * as G6 from '@antv/g6';
import {EventAop, EventGraphCanvas, EventGraphCommon, EventGraphEdge, EventGraphNode} from "@/g6/ambient/cv.event";

interface GraphProp extends Partial<EventGraphReactProp>, EditorContextPropPrivate {
    style?: React.CSSProperties;
    className?: string;
    container: string;
    data: GraphFlow | GraphMind;

    parsing(data: object): void;

    initialize(width: number, height: number): G6.Graph;
}

interface GraphState {

}

class Graph extends React.Component<GraphProp, GraphState> {
    graph: G6.Graph | null = null;

    componentDidMount() {
        this.initGraph();
        this.initEvents();
    }

    componentDidUpdate(prevProps: GraphProp) {
        const {data} = this.props;
        if (data !== prevProps.data) {
            this.changeData(data);
        }
    }

    initGraph() {
        const {
            container,
            parsing,
            initialize,
            data = {},
            setGraph,
        } = this.props;

        const {clientWidth = 0, clientHeight = 0} = document.getElementById(container) || {};

        // 解析数据信息
        parsing(data);

        // 初始化画布
        this.graph = initialize(clientWidth, clientHeight);

        this.graph.read(data);
        this.graph.fitView(Cv.VIEW_FIT_PADDING);
        this.graph.setMode(Cv.ModeGraph.Default);

        setGraph(this.graph);

        // 是否启用 debug
        if (Ambient.trackable) {
            // 开启 debug 模式
        }
    }

    initEvents() {
        const {graph, props} = this;
        if (!graph) {
            return;
        }

        const events: {
            [propName in EventGraphReact]: EventGraphNative
        } = {
            ...EventGraphCommon,
            ...EventGraphNode,
            ...EventGraphEdge,
            ...EventGraphCanvas,
            ...EventAop
        };
        (Object.keys(events) as EventGraphReact[]).forEach(event => {
            if ("function" === typeof props[event]) {
                graph.on(events[event], props[event])
            }
        });
    }

    changeData(data: any) {
        const {graph} = this;
        if (!graph) {
            return;
        }
        const {parsing} = this.props;
        parsing(data);

        graph.changeData(data);
        graph.fitView(Cv.VIEW_FIT_PADDING);
    }

    render() {
        const {container, children} = this.props;
        return (
            <div id={container} {...pick(this.props, ['className', 'style'])}>
                {children}
            </div>
        )
    }
}

export default WrapEditorContextPrivate(Graph);