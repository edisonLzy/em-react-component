import { createContext } from 'react';
import FormStore from './FormStore';
/* 创建一个 FormContext */
const FormContext = createContext({} as FormStore<any>);
export default FormContext;
