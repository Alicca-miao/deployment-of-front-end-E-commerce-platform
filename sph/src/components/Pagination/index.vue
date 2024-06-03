<template>  
	<div class="pagination" v-if="total">
    <button @click="sendPageNo(pageNo-1)" :disabled="pageNo === 1">上一页</button>
    <button @click="sendPageNo(1)" v-if="startEnd.start !== 1">1</button>
    <span v-if="startEnd.start > 2">···</span>
    
    <button 
      v-for="(_,index) in (startEnd.end - startEnd.start + 1)" 
      :key="index"
      :class="{active:(index + startEnd.start === pageNo)}"
      @click="sendPageNo(index + startEnd.start)"
    >
      {{index + startEnd.start}}
    </button>

    <span v-if="startEnd.end < totalPage - 1">···</span>
    <button @click="sendPageNo(totalPage)"  v-if="startEnd.end !== totalPage">{{totalPage}}</button>
    <button @click="sendPageNo(pageNo+1)"  :disabled="pageNo === totalPage">下一页</button>

    <span>共 {{total}} 条</span>
  </div>
</template>

<script>    
  export default {      
    name: "Pagination",    
    props:['total','pageSize','pageNo','continues','sendPageNo'],
    computed:{
      // 计算总页数
      totalPage(){
        return Math.ceil(this.total / this.pageSize)
      },
      // 计算连续页的：起始、结束
      startEnd(){
        // 取出要用的：pageNo(页码)、continues(连续)
        const {pageNo,continues,totalPage} = this
        let start = 0 //起始
        let end = 0 //结束
        // 若连续页数(continues)大于总页数(totalPage)，推都不推，直接全给
        if(continues > totalPage){
          start = 1
          end = totalPage
        }else{
          // 左推计算起始、右推计算结束
          start = pageNo - (continues-1)/2
          end = pageNo + (continues-1)/2
          // 判断推完后左边是否“溢出” —— 左边冒了（左重置）
          if(start < 1){
            start = 1
            end = continues
          }
          // 判断推完后右边是否“溢出” —— 右边冒了（右重置）
          if(end > totalPage){
            start = totalPage - continues + 1
            end = totalPage
          }
        }
        // 返回计算的结果（值为对象，里面包含着：start、end）
        return {start,end}
      }
    }
  };
</script>

<style lang="less" scoped>
  .pagination {
    text-align: center;

    button {
      margin: 0 5px;
      background-color: #f4f4f5;
      color: gray;
      outline: none;
      border-radius: 2px;
      padding: 0 4px;
      vertical-align: top;
      display: inline-block;
      font-size: 13px;
      min-width: 35.5px;
      height: 28px;
      line-height: 28px;
      cursor: pointer;
      box-sizing: border-box;
      text-align: center;
      border: 0;

      &[disabled] {
        color: #c0c4cc;
        cursor: not-allowed;
      }

      &.active {
        cursor: not-allowed;
        background-color: #c81623;
        color: #fff;
      }
    }

    span {
      display: inline-block;
      line-height: 28px;
      font-size: 14px;
      color: gray;
      vertical-align: middle;
    }
  }
</style>