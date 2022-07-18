import {
  FC,
  forwardRef,
  ForwardRefExoticComponent,
  ForwardRefRenderFunction,
  PropsWithChildren,
  ReactElement,
  useImperativeHandle,
} from 'react';
import FormContext from './formContext';
import FormStore, { useForm } from './FormStore';
export declare type InternalNamePath = (string | number)[];
export declare type StoreValue = any;
export interface Store {
  [name: string]: StoreValue;
}

export interface ValidateErrorEntity<Values = any> {
  values: Values;
  errorFields: {
    name: InternalNamePath;
    errors: string[];
  }[];
  outOfDate: boolean;
}

export interface Callbacks<Values = any> {
  onValuesChange?: (changedValues: any, values: Values) => void;
  onFinish?: (values: Values) => void;
  onFinishFailed?: (errorInfo: ValidateErrorEntity<Values>) => void;
}

export interface FormProps<Values extends Record<string, unknown> = any> {
  initialValues?: Values;
  form?: FormStore<Values>;
  component?: false | string | React.FC<any> | React.ComponentClass<any>;
  name?: string;
  onFinish?: Callbacks<Values>['onFinish'];
  onFinishFailed?: Callbacks<Values>['onFinishFailed'];
  validateTrigger?: string | string[] | false;
  preserve?: boolean;
}
const InternalForm: ForwardRefRenderFunction<unknown, FormProps> = <
  T extends Record<string, unknown>
>(
  {
    form,
    initialValues,
    children,
    onFinish,
    onFinishFailed,
  }: PropsWithChildren<FormProps<T>>,
  ref: any
) => {
  const formInstance = useForm(form, initialValues);
  const { setCallback, dispatch, ...providerFormInstance } = formInstance;
  setCallback({
    onFinish,
    onFinishFailed,
  });

  /* Form 能够被 ref 标记，并操作实例。 */
  useImperativeHandle(ref, () => providerFormInstance, []);

  const RenderChildren = (
    <FormContext.Provider value={formInstance}>{children}</FormContext.Provider>
  );
  return (
    <form
      onReset={(e) => {
        e.preventDefault();
        e.stopPropagation();
        formInstance.resetFields(); /* 重置表单 */
      }}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        formInstance.submit(); /* 提交表单 */
      }}
    >
      {RenderChildren}
    </form>
  );
};

const Form = forwardRef<unknown, FormProps>(InternalForm) as <
  Values extends Record<string, unknown> = any
>(
  props: React.PropsWithChildren<FormProps<Values>> & {
    ref?: React.Ref<FormStore<Values>>;
  }
) => ReactElement;

export default Form;
