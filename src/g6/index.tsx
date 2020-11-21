import {RegistryBehavior, RegistryCommand, RegistryEdge, RegistryNode} from "./components/Register";
import {T as G6T} from './ambient';
// Plugin 插件
import ItemPopover from './plugins/ItemPopover';
import ContextMenu from './plugins/ContextMenu';
import EditableLabel from './plugins/EditableLabel';
// 可重用组件
import Command from './components/Command';
import DetailPanel from "./components/DetailPanel";
import ItemPanel, {Item} from './components/ItemPanel';
import {WrapEditorContext} from './components';
// 编辑器
import G6Editor from './components/Editor';

export {
    // G6 工具类
    G6T,

    // 特殊图相关信息

    // G6 插件
    ItemPopover,
    ContextMenu,
    EditableLabel,

    // G6 专用组件
    Command,
    DetailPanel,
    ItemPanel,
    Item,
    WrapEditorContext,

    // G6 专用注册方法
    RegistryNode,
    RegistryEdge,
    RegistryCommand,
    RegistryBehavior,
};

export default G6Editor;