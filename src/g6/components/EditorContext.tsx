import React from 'react';
import {WrapContext} from '@/g6/ambient';
import * as G6 from '@antv/g6';

export interface EditorContextProp {
    graph: G6.Graph | null;
    executeCommand: (name: string, params?: object) => void;
}

export interface EditorContextPropPrivate {
    setGraph: (graph: G6.Graph) => void;
}

export const EditorContext = React.createContext({} as EditorContextProp);
export const EditorContextPrivate = React.createContext({} as EditorContextPropPrivate);

export const WrapEditorContext =
    WrapContext<EditorContextProp>(EditorContext, context => !!context.graph);
export const WrapEditorContextPrivate =
    WrapContext<EditorContextPropPrivate>(EditorContextPrivate);