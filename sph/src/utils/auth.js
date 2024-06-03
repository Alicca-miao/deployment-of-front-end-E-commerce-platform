/* 
  getUserTempId专门用于给外部提供一个临时身份
  工作流程：从localStorage中获取用户的临时标识
        1.获取到了
            返回出去，直接给别人用。
        2.没获取到
            第一件事：新生成一个
            第二件事：去localStorage中存一份
            第三件事：返回出去
            
*/
import {v4} from 'uuid'

export function getUserTempId(){
  // 从localStorage中获取用户的临时标识
  const userTempId = localStorage.getItem('userTempId')
  // 获取到了
  if(userTempId){
    return userTempId
  }else{
    // 没获取到,新生成一个
    const newUserTempId = v4()
    // 去localStorage中存一份
    localStorage.setItem('userTempId',newUserTempId)
    // 返回出去
    return newUserTempId
  }
}

//用于将token存入localStorage
export function saveToken(token){
  localStorage.setItem('token',token)
}

//用于从localStorage中读取token
export function readToken(){
  return localStorage.getItem('token')
}

//从localStoragre删除用户token
export function deleteToken(){
  localStorage.removeItem('token')
}