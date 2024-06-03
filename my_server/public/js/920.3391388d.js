"use strict";(self["webpackChunksph_230410"]=self["webpackChunksph_230410"]||[]).push([[920],{1143:function(t,s,a){a.r(s),a.d(s,{default:function(){return u}});var e=function(){var t=this,s=t._self._c;return s("div",[t.cartInfoList.length?s("div",{staticClass:"cart"},[s("h4",[t._v("全部商品")]),s("div",{staticClass:"cart-main"},[t._m(0),s("div",{staticClass:"cart-body"},t._l(t.cartInfoList,(function(a){return s("ul",{key:a.id,staticClass:"cart-list"},[s("li",{staticClass:"cart-list-con1"},[s("input",{attrs:{type:"checkbox"},domProps:{checked:a.isChecked},on:{click:function(s){return s.preventDefault(),t.checkOne(a)}}})]),s("li",{staticClass:"cart-list-con2"},[s("img",{attrs:{src:a.imgUrl}}),s("div",{staticClass:"item-msg"},[t._v(t._s(a.skuName))])]),s("li",{staticClass:"cart-list-con4"},[s("span",{staticClass:"price"},[t._v(t._s(a.cartPrice))])]),s("li",{staticClass:"cart-list-con5"},[s("a",{staticClass:"mins",on:{click:function(s){return t.changeSkuNum("decrement",a)}}},[t._v("-")]),s("input",{staticClass:"itxt",attrs:{type:"text"},domProps:{value:a.skuNum},on:{change:function(s){return t.changeSkuNum("input",a,s)}}}),s("a",{staticClass:"plus",on:{click:function(s){return t.changeSkuNum("increment",a)}}},[t._v("+")])]),s("li",{staticClass:"cart-list-con6"},[s("span",{staticClass:"sum"},[t._v(t._s(a.cartPrice*a.skuNum))])]),s("li",{staticClass:"cart-list-con7"},[s("a",{staticClass:"sindelet",on:{click:function(s){return t.deleteOne(a.skuId)}}},[t._v("删除")]),s("br")])])})),0)]),s("div",{staticClass:"cart-tool"},[s("div",{staticClass:"select-all"},[s("input",{staticClass:"chooseAll",attrs:{type:"checkbox"},domProps:{checked:t.isAll},on:{click:function(s){return s.preventDefault(),t.checkAll.apply(null,arguments)}}}),s("span",[t._v("全选")])]),s("div",{staticClass:"option"},[s("a",{on:{click:t.batchDlete}},[t._v("删除选中的商品")])]),s("div",{staticClass:"money-box"},[s("div",{staticClass:"chosed"},[t._v(" 已选择 "),s("span",[t._v(t._s(t.total))]),t._v("件商品 ")]),s("div",{staticClass:"sumprice"},[s("em",[t._v("总价（不含运费） ：")]),s("i",{staticClass:"summoney"},[t._v(t._s(t.totalPrice))])]),s("div",{staticClass:"sumbtn"},[s("router-link",{staticClass:"sum-btn",attrs:{to:"/trade"}},[t._v("结算")])],1)])])]):t._e(),t.cartInfoList.length?t._e():s("div",{staticClass:"empty"},[s("hr"),s("img",{attrs:{src:"http://49.232.112.44/images/empty.gif",alt:""}}),s("h2",[t._v("购物车空空如也")])])])},c=[function(){var t=this,s=t._self._c;return s("div",{staticClass:"cart-th"},[s("div",{staticClass:"cart-th1"},[t._v("全部")]),s("div",{staticClass:"cart-th2"},[t._v("商品")]),s("div",{staticClass:"cart-th3"},[t._v("单价（元）")]),s("div",{staticClass:"cart-th4"},[t._v("数量")]),s("div",{staticClass:"cart-th5"},[t._v("小计（元）")]),s("div",{staticClass:"cart-th6"},[t._v("操作")])])}],i=(a(7658),a(9798)),r={name:"ShopCart",data(){return{cartInfoList:[]}},computed:{isAll(){return this.cartInfoList.every((t=>1===t.isChecked))},total(){let t=0;return this.cartInfoList.forEach((s=>{s.isChecked&&(t+=s.skuNum)})),t},totalPrice(){let t=0;return this.cartInfoList.forEach((s=>{s.isChecked&&(t+=s.skuNum*s.skuPrice)})),t}},methods:{async getCartList(){const{code:t,message:s,data:a}=await(0,i.S3)();200===t?this.cartInfoList=a[0]?.cartInfoList||[]:alert(`获取购物车数据失败:${s}`)},async checkOne(t){const{skuId:s,isChecked:a}=t,e=1===a?0:1,{code:c,message:r}=await(0,i.ZV)(s,e);200===c?t.isChecked=e:alert(`勾选失败：${r}`)},async checkAll(){const t=[];this.cartInfoList.forEach((s=>t.push(s.skuId)));const s=this.isAll?0:1,{code:a,message:e}=await(0,i.i_)(t,s);200===a?this.cartInfoList.forEach((t=>{t.isChecked=s})):alert(`全选失败：${e}`)},async deleteOne(t){if(confirm("确定删除吗？")){const{code:s,message:a}=await(0,i.BV)(t);200===s?this.cartInfoList=this.cartInfoList.filter((s=>s.skuId!==t)):alert(`删除失败：${a}`)}},async batchDlete(){if(confirm("确定删除已勾选的吗？")){const t=[];this.cartInfoList.forEach((s=>{s.isChecked&&t.push(s.skuId)}));let{code:s,message:a}=await(0,i.cT)(t);200===s?this.cartInfoList=this.cartInfoList.filter((t=>0===t.isChecked)):alert(`删除失败：${a}`)}},async changeSkuNum(t,s,a){if(this.isLock)return;this.isLock=!0;const{skuId:e,skuNum:c}=s;switch(t){case"input":const{value:t}=a.target;if(t>=1&&t<=200){const r=parseInt(t)-c,{code:n,message:l}=await(0,i.u1)(e,r);200===n?(s.skuNum=a.target.value=parseInt(t),s.isChecked=1):(alert(`修改商品数量失败：${l}`),a.target.value=c)}else if(t>200){const t=200-c,{code:r,message:n}=await(0,i.u1)(e,t);200===r?(s.skuNum=a.target.value=200,s.isChecked=1):(alert(`修改商品数量失败：${n}`),a.target.value=c)}else a.target.value=c;break;case"increment":if(200===c)alert("最大购买数量为200");else{const{code:t,message:a}=await(0,i.u1)(e,1);200===t?(s.skuNum+=1,s.isChecked=1):alert(`修改数量失败：${a}`)}break;case"decrement":if(1===c)alert("最小购买数量为1");else{const{code:t,message:a}=await(0,i.u1)(e,-1);200===t?(s.skuNum-=1,s.isChecked=1):alert(`修改数量失败：${a}`)}break}this.isLock=!1}},mounted(){this.getCartList()}},n=r,l=a(1001),o=(0,l.Z)(n,e,c,!1,null,"e1c51ca8",null),u=o.exports}}]);
//# sourceMappingURL=920.3391388d.js.map