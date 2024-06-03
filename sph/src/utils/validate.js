// 此文件专门用于管理整个项目的表单校验
import Vue from 'vue'

// 引入ValidationProvider组件，用于包裹需要验证的输入元素
// 引入extend函数，用于定制规则
// 引入ValidationObserver组件，用于统一校验
import {ValidationProvider,extend,ValidationObserver} from 'vee-validate'
// 引入一个内置的规则
import {required} from 'vee-validate/dist/rules'

// 将ValidationProvider注册为全局组件
// 将ValidationObserver注册为全局组件
Vue.component('ValidationProvider',ValidationProvider)
Vue.component('ValidationObserver',ValidationObserver)

// 定制一个验证手机的规则
const phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
extend('shouji',{
  //只要你输入了东西，validate方法就会调用，且会收到你输入的内容
  validate:value => phoneReg.test(value) , //具体的验证逻辑
  message:'手机号格式不合法' //验证不通过提示的内容
})

// 定制一个必填项规则
extend('bixu',{
  ...required,
  message:'{_field_}必须输入'
})

// 定制一个验证码规则
const codeReg = /^\d{6}$/
extend('ma',{
  validate :value => codeReg.test(value),
  message:'验证码必须为6为纯数字'
})

// 定制一个密码规则
const pwdReg = /^\w{6,21}$/
extend('mima',{
  validate :value => pwdReg.test(value),
  message:'密码必须为6~21位的数字、字母、下划线'
})

// 定制一个确认密码规则
extend('remima',{
  validate(value,params){
    return value === params[0]
  },
  message:'确认密码必须和密码一致'
})

// 定制一个协议规则
extend('agree',{
  validate: value => value,
  message:'协议必须同意'
})


