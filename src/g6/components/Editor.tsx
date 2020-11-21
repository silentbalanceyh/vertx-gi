import React from 'react';
import isArray from 'lodash/isArray';
import pick from 'lodash/pick';
import {Ambient, Cv, EventCommand, MgrCommand} from "@/g6/ambient";
import {EditorContext, EditorContextPrivate, EditorContextProp, EditorContextPropPrivate} from "./EditorContext";
import * as G6 from '@antv/g6';

interface EditorProp {
    style?: React.CSSProperties;
    className?: string;
    [Cv.EventEditor.onBeforeExecuteCommand]?: (e: EventCommand) => void;
    [Cv.EventEditor.onAfterExecuteCommand]?: (e: EventCommand) => void;
}

interface EditorState extends EditorContextProp, EditorContextPropPrivate {
}

class Editor extends React.Component<EditorProp, EditorState> {
    static defaultProps = {
        [Cv.EventEditor.onBeforeExecuteCommand]: () => ({}),
        [Cv.EventEditor.onAfterExecuteCommand]: () => ({})
    }
    // 上次鼠标悬停位置
    lastMousedownTarget: EventTarget | null = null;

    constructor(props: EditorProp) {
        super(props);

        this.state = {
            graph: null,
            setGraph: this.setGraph,
            executeCommand: this.executeCommand,
        }

        this.lastMousedownTarget = null;
    }

    // 打开 Debug
    static trackable(trackable: boolean) {
        Ambient.trackable = trackable;
    }

    initEvent(graph: G6.Graph) {
        const {props} = this;

        graph.on(Cv.EventEditor.onBeforeExecuteCommand, props[Cv.EventEditor.onBeforeExecuteCommand]);
        graph.on(Cv.EventEditor.onAfterExecuteCommand, props[Cv.EventEditor.onAfterExecuteCommand]);
    }

    initShortcut(graph: G6.Graph) {
        // 绑定事件
        window.addEventListener(Cv.EventGraphCommon.onMouseDown, e => {
            this.lastMousedownTarget = e.target;
        });

        // 绑定 onKeyDown
        graph.on(Cv.EventGraphCommon.onKeyDown, (e: any) => {
            const elementCanvas = graph.get(Cv.ModeRender.Canvas).get('el');
            if (elementCanvas !== this.lastMousedownTarget) {
                return;
            }
            Object.values(MgrCommand.command).some(command => {
                const {name, shortcuts} = command;

                const flag = shortcuts.some((shortcut: string | string[]) => {
                    const {key} = e;

                    if (!isArray(shortcut)) {
                        return shortcut === key;
                    }

                    return (shortcut as string[]).every((item, index) => {
                        if (index === shortcut.length - 1) {
                            return item === key;
                        }

                        return e[item];
                    });
                });

                if (flag) {
                    if (MgrCommand.canExecute(graph, name)) {
                        // Prevent default
                        e.preventDefault();

                        // Execute command
                        this.executeCommand(name);
                        return true;
                    }
                }
                return false;
            })
        })
    }

    executeCommand = (name: string, params?: object) => {
        const {graph} = this.state;
        if (graph) {
            MgrCommand.execute(graph, name, params);
        }
    }

    setGraph = (graph: G6.Graph) => {
        this.setState({graph});

        // setGraph
        this.initEvent(graph);
        this.initShortcut(graph);
    }

    render() {
        const {children} = this.props;
        const {graph, setGraph, executeCommand} = this.state;
        return (
            <EditorContext.Provider value={{
                graph,
                executeCommand,
            }}>
                <EditorContextPrivate.Provider value={{
                    setGraph
                }}>
                    <div {...pick(this.props, ['className', 'style'])}>{children}</div>
                </EditorContextPrivate.Provider>
            </EditorContext.Provider>
        )
    }
}

export default Editor;