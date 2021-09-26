import {
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  PropsWithChildren,
  isValidElement,
  cloneElement,
} from 'react';
import formContext from './formContext';
export interface ValidatorRule {
  message?: string | ReactElement;
}
interface BaseRule {
  len?: number;
  max?: number;
  message?: string | ReactElement;
  min?: number;
  pattern?: RegExp;
  required?: boolean;
  type?: RuleType;
  whitespace?: boolean;
  /** Customize rule level `validateTrigger`. Must be subset of Field `validateTrigger` */
  validateTrigger?: string | string[];
}

declare type AggregationRule = BaseRule & Partial<ValidatorRule>;
export declare type RuleType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'method'
  | 'regexp'
  | 'integer'
  | 'float'
  | 'object'
  | 'enum'
  | 'date'
  | 'url'
  | 'hex'
  | 'email';
export declare type RuleObject = AggregationRule;
export declare type Rule = RuleObject;
interface InternalFormItemProps {
  name: string;
  label: string;
  required: boolean;
  trigger: string;
  validateTrigger: string;
  rule: Rule;
}
type FormItemProps = Partial<InternalFormItemProps>;

const FormItem = ({
  name,
  label,
  required = false,
  trigger = 'onChange',
  validateTrigger = 'onChange',
  rule,
  children,
}: PropsWithChildren<FormItemProps>) => {
  const formInstance = useContext(formContext);
  const [, forceUpdate] = useState({});
  const { registerValidateFields, dispatch, unRegisterValidate } = formInstance;
  const onStoreChange = useMemo(() => {
    /* 管理层改变 => 通知表单项
       creator
     */
    const onStoreChange = {
      changeValue() {
        forceUpdate({});
      },
    };
    return onStoreChange;
  }, [formInstance]);

  useEffect(() => {
    name && registerValidateFields(name, onStoreChange, { rule, required });
    return () => {
      name && unRegisterValidate(name);
    };
  }, [name, onStoreChange]);
  // 将表单控件受控
  const getControlled = (child: ReactElement) => {
    const mergeChildrenProps = { ...child.props };
    if (!name) return mergeChildrenProps;
    /* 改变表单单元项的值 */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      /* 设置表单的值 */
      dispatch({
        type: 'setFieldsValue',
        payload: [name, value],
      });
    };
    mergeChildrenProps[trigger] = handleChange;

    if (required || rule) {
      /* 验证表单单元项的值 */
      mergeChildrenProps[validateTrigger] = (
        e: React.ChangeEvent<HTMLInputElement>
      ) => {
        /* 当改变值和验证表单，用统一一个事件 */
        if (validateTrigger === trigger) {
          handleChange(e);
        }
        /* 触发表单验证 */
        dispatch({ type: 'validateFieldValue', payload: name });
      };
    }

    mergeChildrenProps['value'] = dispatch({
      type: 'getFieldValue',
      payload: name,
    });
    return mergeChildrenProps;
  };

  let renderChildren;
  if (isValidElement(children)) {
    /* 获取 | 合并 ｜ 转发 | =>  props  */
    renderChildren = cloneElement(children, getControlled(children));
  } else {
    renderChildren = children;
  }

  return (
    <label>
      <span>{label}:</span>
      {renderChildren}
    </label>
  );
};
export default FormItem;
