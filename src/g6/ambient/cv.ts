/*
 * 三种图对应的 HTML ID
 */
export const ID_FLOW = "Z_FlowContainer";
export const ID_MIND = "Z_MindContainer";
export const ID_TOPOLOGY = "Z_TopologyContainer";
/*
 * 默认文字
 */
export const TEXT_LABEL_DEFAULT = "新建节点";
export const TEXT_NODE_DEFAULT = "新节点";
export const TEXT_EDGE_DEFAULT = "新连线";
/*
 * 默认宽度
 */
export const VIEW_FIT_PADDING = 200;
// ---------------------- 模式 --------------------------
/*
 * 渲染模式
 */
export enum ModeRender {
    Canvas = "canvas",
    Svg = "svg"
}

/* 图模式 */
export enum ModeGraph {
    Default = 'default',
    AddNode = 'addNode',
    Readonly = 'readonly'
}

// ---------------------- 类型 --------------------------
/* 元素类型 */
export enum TypeItem {
    Node = 'node',          // 节点
    Edge = 'edge',          // 边
    Combo = 'combo',        // Combo类型，新版保留
}

/* 图类型 */
export enum TypeGraph {
    Flow = 'flow',              // 流程图
    Mind = 'mind',              // 脑图
}

/* 面板类型 */
export enum TypeDetail {
    Node = 'node',              // 节点
    Edge = 'edge',              // 边
    Group = 'group',            // 组
    Canvas = 'canvas',          // 画布
}

// ---------------------- 状态 --------------------------
/* 元素状态 */
export enum StateItem {
    Active = "active",          // 激活时
    Selected = 'selected',      // 选中时
    HighLight = 'highLight',    // 高亮显示
    Error = 'error'             // 错误
}

/* 图状态 */
export enum StateGraph {
    NodeSelected = 'nodeSelected',
    EdgeSelected = 'edgeSelected',
    GroupSelected = 'groupSelected',
    CanvasSelected = 'canvasSelected'
}

/* 标签状态 */
export enum StateLabel {
    Hide = 'hide',
    Show = 'show'
}

// ---------------------- 命令 --------------------------
/* 编辑器命令 */
export enum CommandEditor {
    /** 保存 **/
    Save = "edit",
    /** 撤销 */
    Undo = 'undo',
    /** 重做 */
    Redo = 'redo',
    /** 添加 */
    Add = 'add',
    /** 更新 */
    Update = 'update',
    /** 删除 */
    Remove = 'remove',
    /** 复制 */
    Copy = 'copy',
    /** 粘贴 */
    Paste = 'paste',
    /** 粘贴到这里 */
    PasteHere = 'pasteHere',
    /** 放大 */
    ZoomIn = 'zoomIn',
    /** 缩小 */
    ZoomOut = 'zoomOut',
    /** 插入主题 */
    Topic = 'topic',
    /** 插入子主题 */
    Subtopic = 'subtopic',
    /** 收起 */
    Fold = 'fold',
    /** 展开 */
    Unfold = 'unfold',
}

// ---------------------- Css --------------------------
/* 风格专用 */
export enum CssButton {
    FOLD_BUTTON = "node-fold-button",
    UNFOLD_BUTTON = "node-unfold-button",
}

// 事件
export * from './cv.event';