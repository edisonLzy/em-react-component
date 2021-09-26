import { ReactElement, useContext, useEffect, useMemo, useState } from 'react';
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
}: FormItemProps) => {
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

  return <h1>aa</h1>;
};
export default FormItem;
