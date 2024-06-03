import Mock from 'mockjs'
import floor from './floor'
import slide from './slide'

Mock.mock('http://www.0410.com/floor','get',{code:200,message:'成功',ok:true,data:floor})

Mock.mock('http://www.0410.com/slide','get',{code:200,message:'成功',ok:true,data:slide})