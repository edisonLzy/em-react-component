import { useRef, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
type Callback<T> = {
  onFinish: (values: T) => void;
  onFinishFailed: any;
};
type ValidateCallback = (res: boolean) => void;
type Status = 'resolve' | 'reject' | 'pending';
type Action<T = any> = {
  type: keyof FormStore;
  payload: T;
};
type Controller = {
  changeValue: () => void;
};
type Control<T extends Record<string, unknown>> = {
  [name in keyof T]: Controller;
};
interface Validate {
  value: any;
  rule: any;
  required: boolean;
  message: string;
  status: Status;
}
type Model<T extends Record<string, unknown>> = {
  [name in keyof T]: Validate;
};
function isReg(v: unknown): v is RegExp {
  return v instanceof RegExp;
}
export default class FormStore<T extends Record<string, unknown> = {}> {
  // FormItem的状态都存在这里
  private model: Model<T> = {} as Model<T>;
  // 存储 FormItem的更新函数
  private control: Control<T> = {} as Control<T>;
  // 批量更新的队列
  private pendingValidateQueue: any[] = [];
  // 是否开启异步调用
  private isSchedule = false;
  // 表单默认值
  private defaultFormValue: T = {} as T;
  // callback
  private callback: Callback<T> = {} as Callback<T>;
  constructor(forceUpdate: any, defaultFormValue: T) {
    this.defaultFormValue = defaultFormValue;
  }
  static createValidate(validate: Validate): Validate {
    const { value, rule, required, message } = validate;
    return {
      value,
      rule: rule || (() => true),
      required: required || false,
      message: message || '',
      status: 'pending',
    };
  }
  private getDefaultValue(name: keyof T) {
    return Reflect.get(this.defaultFormValue, name);
  }
  setCallback(callback: any) {
    if (callback) this.callback = callback;
  }
  dispatch(action: Action) {
    const { type, payload } = action;
    return Reflect.apply(this[type], this, payload);
  }
  /**
   * 收集 FormItem的 信息 以及 更新函数, 在formItem初始化的时候调用
   * @param name
   * @param control
   * @param model
   */
  registerValidateFields(
    name: keyof T,
    control: Controller,
    model: Partial<Validate>
  ) {
    if (this.defaultFormValue[name]) model.value = this.defaultFormValue[name];
    const validate = FormStore.createValidate(model as Validate);
    this.model[name] = validate;
    this.control[name] = control;
  }
  /* 卸载注册表单单元项 */
  unRegisterValidate(name: keyof T) {
    const deleteProperty = Reflect.deleteProperty;
    return (
      deleteProperty(this.model, name) && deleteProperty(this.control, name)
    );
  }
  /* 通知对应FormItem更新 */
  notifyChange(name: keyof T) {
    const controller = this.control[name];
    if (controller) controller?.changeValue();
  }
  /* 重置表单 */
  resetFields() {
    Object.keys(this.model).forEach((modelName) => {
      this.setValueClearStatus(
        this.model[modelName],
        modelName,
        this.getDefaultValue(modelName)
      );
    });
  }
  /* 设置一组字段状态	  */
  setFields(object: Model<T>) {
    if (typeof object !== 'object') return;
    Object.keys(object).forEach((modelName) => {
      this.setFieldsValue(modelName, object[modelName]);
    });
  }
  /* 设置表单值 */
  setFieldsValue(name: keyof T, modelValue: Validate | string) {
    const model = this.model[name];
    if (!model) return false;
    if (typeof modelValue === 'object') {
      /* 设置表单项 */
      const { message, rule, value } = modelValue;
      if (message) model.message = message;
      if (rule) model.rule = rule;
      if (value) model.value = value;
      model.status = 'pending'; /* 设置待验证状态 */
      this.validateFieldValue(
        name,
        true
      ); /* 如果重新设置了验证规则，那么重新验证一次 */
    } else {
      this.setValueClearStatus(model, name, modelValue);
    }
  }
  /* 复制并清空状态 */
  setValueClearStatus(model: Validate, name: keyof T, value: unknown) {
    model.value = value;
    model.status = 'pending';
    this.notifyChange(name);
  }
  /* getFieldsValue */
  getFieldsValue() {
    const model = this.model;
    return Object.keys(model).reduce<T>((values, cur: keyof T) => {
      values[cur] = model[cur].value;
      return values;
    }, {} as T);
  }
  getFieldModel(name: keyof T) {
    const model = this.model[name];
    return model ? model : {};
  }
  /* 获取对应字段名的值 */
  getFieldValue(name: keyof T) {
    const model = this.model[name];
    const defaultValue = this.getDefaultValue(name);
    if (!model && defaultValue)
      return defaultValue; /* 没有注册，但是存在默认值的情况 */
    return model ? model.value : null;
  }
  /* 单一表单单元项验证 */
  validateFieldValue(name: keyof T, forceUpdate = false) {
    const model = this.model[name];
    /* 记录上次状态 */
    const lastStatus = model.status;
    if (!model) return null;
    const { required, rule, value } = model;
    let status: Status = 'resolve';
    if (required && !value) {
      status = 'reject';
    } else if (isReg(rule)) {
      /* 正则校验规则 */
      status = rule.test(value) ? 'resolve' : 'reject';
    } else if (typeof rule === 'function') {
      /* 自定义校验规则 */
      status = rule(value) ? 'resolve' : 'reject';
    }
    model.status = status;
    if (lastStatus !== status || forceUpdate) {
      const notify = this.notifyChange.bind(this, name);
      this.pendingValidateQueue.push(notify);
    }
    this.scheduleValidate();
    return status;
  }
  /* 批量调度验证更新任务 */
  scheduleValidate() {
    if (this.isSchedule) return;
    this.isSchedule = true;
    Promise.resolve().then(() => {
      /* 批量更新验证任务 */
      unstable_batchedUpdates(() => {
        do {
          const notify = this.pendingValidateQueue.shift();
          notify && notify(); /* 触发更新 */
        } while (this.pendingValidateQueue.length > 0);
        this.isSchedule = false;
      });
    });
  }
  /* 表单整体验证 */
  validateFields(callback: ValidateCallback) {
    let status = true;
    Object.keys(this.model).forEach((modelName) => {
      const modelStates = this.validateFieldValue(modelName, true);
      if (modelStates === 'reject') status = false;
    });
    callback(status);
  }
  /* 提交表单 */
  submit(cb?: ValidateCallback) {
    this.validateFields((res) => {
      const { onFinish, onFinishFailed } = this.callback;
      cb && cb(res);
      if (!res)
        onFinishFailed &&
          typeof onFinishFailed === 'function' &&
          onFinishFailed(); /* 验证失败 */
      onFinish &&
        typeof onFinish === 'function' &&
        onFinish(this.getFieldsValue()); /* 验证成功 */
    });
  }
}

export function useForm<T extends Record<string, unknown>>(
  form?: FormStore<T>,
  defaultFormValue: T = {} as T
) {
  const formRef = useRef<FormStore<T> | null>(null);
  const [, forceUpdate] = useState({});
  if (!formRef.current) {
    if (form) {
      formRef.current = form; /* 如果已经有 form，那么复用当前 form  */
    } else {
      /* 没有 form 创建一个 form */
      const formStoreCurrent = new FormStore<T>(forceUpdate, defaultFormValue);
      /* 获取实例方法 */
      formRef.current = formStoreCurrent;
    }
  }
  return formRef.current;
}
