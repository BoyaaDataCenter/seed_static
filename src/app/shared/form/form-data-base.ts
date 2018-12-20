
export interface ValidatorMsg {
  require?: string;
}

/**
 * 表单基础数据类
 */
export class FormDataBase {
  value: any;
  key: string;
  label: string;
  controlType: string;

  // input 除去 radio 和 checkbox 的类型选项
  type: string;
  // dropdown、radio、checkbox 的可选值列表
  options: any[];

  require: boolean;
  validatorMsg: ValidatorMsg;

  constructor(options: {
    value: string | number | string[] | number[],
    key: string,
    label: string,
    controlType: 'text' | 'textarea' | 'dropdown' | 'radio' | 'checkbox',

    type?: string,
    options?: {label: string, value: string | number}[],

    require?: boolean,
    validatorMsg?: ValidatorMsg
  }) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.controlType = options.controlType || '';

    this.type = options['type'] || '';
    this.options = options['options'] || [];

    this.require = !!options.require;
    this.validatorMsg = options.validatorMsg || {};
  }
}
