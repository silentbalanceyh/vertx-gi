import {guid} from './toolkit';
import {DataNode} from './interfaces';

class Ambient {
    /* 当前版本 */
    version: string = process.env.GI_VERSION;

    /* 调试模式专用开关 */
    trackable = true;

    /** 剪切板 **/
    clipboard: {
        point: {
            x: number;
            y: number;
        };
        models: DataNode[];
    } = {
        point: {
            x: 0,
            y: 0
        },
        models: [],
    }

    /** 组件数据 **/
    component: {
        itemPanel: {
            model: DataNode;
            delegateClass: string;
        };
    } = {
        itemPanel: {
            model: null,
            delegateClass: `g6DelegateShape_${guid()}`,
        }
    }

    /** 插件数据 **/
    plugin: {
        itemPopover: {
            state: 'show' | 'hide';
        };
        contextMenu: {
            state: 'show' | 'hide';
        };
        editableLabel: {
            state: 'show' | 'hide';
        };
    } = {
        itemPopover: {
            state: 'hide',
        },
        contextMenu: {
            state: 'hide',
        },
        editableLabel: {
            state: 'hide',
        },
    }
}

export default new Ambient();