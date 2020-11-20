import * as React from 'react';
/*
 * React 上下文环境封装，后续保留使用
 */
export default function <ContextProp>(
    // 封装 ContextProp 结构
    Context: React.Context<ContextProp>,
    // 是否执行渲染
    shouldRender: (context: ContextProp) => boolean = () => true) {
    return function <Prop extends ContextProp>(WrappedComponent: React.ComponentClass<Prop>) {

        type WrappedInstance = InstanceType<typeof WrappedComponent>;
        type WrappedProp = Omit<React.PropsWithChildren<Prop>, keyof ContextProp>;
        type WrappedPropRef = WrappedProp & {
            forwardRef: React.Ref<WrappedInstance>
        };

        const ReactContext: React.FC<WrappedPropRef> = (props) => {
            const {forwardRef, ...rest} = props;
            return (
                <Context.Consumer>
                    {context => shouldRender(context) ?
                        <WrappedComponent ref={forwardRef} {...(rest as any)} {...context}/> :
                        null
                    }
                </Context.Consumer>
            )
        };

        return React.forwardRef<WrappedInstance, WrappedProp>(
            (props, ref) => (
                <ReactContext forwardRef={ref} {...props}/>
            )
        )
    }
}