import * as G6 from '@antv/g6';
import {Command, IEdge, IItem, INode} from './interfaces';
import {getSelectedEdges, getSelectedNodes, isMind, setSelectedItems} from './toolkit';
import {EventEditor, StateLabel} from "./cv";
import MgrCommand from './clazz.mgr.command';

export interface BaseCommand<P = object, G = G6.Graph> extends Command<P, G> {
    /** 判断是否脑图 */
    isMind(graph: G): boolean;

    /** 获取选中节点 */
    getSelectedNodes(graph: G): INode[];

    /** 获取选中连线 */
    getSelectedEdges(graph: G): IEdge[];

    /** 设置选中元素 */
    setSelectedItems(graph: G, items: IItem[] | string[]): void;

    /** 编辑选中节点 */
    editSelectedNode(graph: G): void;
}

export const baseCommand: BaseCommand = {
    name: '',

    params: {},

    canExecute() {
        return true;
    },

    shouldExecute() {
        return true;
    },

    canUndo() {
        return true;
    },

    init() {
    },

    execute() {
    },

    undo() {
    },

    shortcuts: [],

    isMind,

    getSelectedEdges,

    getSelectedNodes,

    setSelectedItems,

    editSelectedNode(graph: G6.Graph) {
        graph.emit(EventEditor.onLabelStateChange, {
            labelState: StateLabel.Show,
        })
    }
};

MgrCommand.registry('base', baseCommand);