
<template>
  <div style="padding: 12px">
    <!-- 功能区域 -->
    <div style="margin: 10px 0">
      <el-button type="primary" @click="add">新增</el-button>
    </div>

    <!-- 搜索区域 -->
    <div style="margin: 10px 0">
      <el-input
        v-model="search"
        placeholder="请输入昵称关键字"
        style="width: 20%"
      ></el-input>
      <el-button type="primary" style="margin-left: 5px" @click="liskeSearch"
        >查询</el-button
      >
    </div>
    <el-table :data="tableData" height="500" stripe style="width: 100%">
      <el-table-column prop="id" label="ID" sortable width="200" />
      <el-table-column prop="username" label="用户名" sortable width="150" />
      <el-table-column prop="nickName" label="昵称" width="150" />
      <el-table-column prop="sex" label="性别" width="150" />
      <el-table-column prop="age" label="年龄" width="150" />
      <el-table-column label="角色" width="150">
        <template #default="scope">
          <span v-if="scope.row.role === 1">老师</span>
          <span v-if="scope.row.role === 2">学生</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址" width="150" />
      <el-table-column
        align="right"
        label="操作"
        width="150"
        header-align="center"
      >
        <template #default="scope">
          <el-button
            size="mini"
            type="success"
            plain
            @click="showBooks(scope.$index, scope.row)"
            >查看图书列表</el-button
          >
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
            编辑
          </el-button>
          <el-popconfirm
            title="确认删除吗?"
            @confirm="handleDelete(scope.$index, scope.row)"
          >
            <template #reference>
              <el-button size="small" type="danger">删除 </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div style="margin: 10px 0">
      <el-pagination
        v-model:currentPage="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20]"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 新增 -->
    <el-dialog v-model="dialogVisible" title="提示" width="30%">
      <el-form :model="form" label-width="120px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickName" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="form.age" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio v-model="form.sex" label="男">男</el-radio>
          <el-radio v-model="form.sex" label="女">女</el-radio>
          <el-radio v-model="form.sex" label="未知">未知</el-radio>
        </el-form-item>
        <el-form-item label="地址">
          <el-input
            type="textarea"
            v-model="form.address"
            style="width: 80%"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </span>
      </template>
    </el-dialog>

      <!-- 书列表 -->
     <el-dialog title="用户拥有的图书列表" v-model="bookVis" width="30%">
      <el-table :data="bookList" stripe border>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="bookName" label="名称"></el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script >
import request from "@/utils/request";
export default {
  // 用于刷新界面
  inject: ["reload"],
  name: "User",
  components: {},
  data() {
    return {
      //新增弹窗默认关闭
      dialogVisible: false,
      // 新增时的表单
      form: {},
      // 分页
      currentPage: 1,
      total: 0,
      pageSize: 10,
      // 搜索
      search: "",
      // 表单
      tableData: [],
      // 用户查看的书列表
      bookList: [],
      // 是否关闭书列表，默认关闭
      bookVis: false,
    };
  },
  // 钩子函数
  created() {
    this.liskeSearch();
  },
  methods: {
    // 打开书列表
    showBooks($index,row) {
      // $index不知道有啥用可能是定位用
     //用于从当前行中获得数据定位id
      this.form = JSON.parse(JSON.stringify(row));
  
      request.get("/user/findBookList",{
          params: {
            id: this.form.id
          }
          }).then(res =>{
        if(res.code == "-1"){
           this.$message({
              type: "error",
              message: res.msg,
            });
        }else{
        this.bookList = res.data
        this.bookVis = true
    }})
      
    },
    //查询/按钮
    liskeSearch() {
      request
        .get("/user", {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            search: this.search,
          },
        })
        .then((res) => {
          console.log(res);
          this.tableData = res.data.records;
          this.total = res.data.total;
        });
    },
    // 点击新增按钮后会进行的操作
    add() {
      //弹窗点击新增就打开
      this.dialogVisible = true;
      //新增要清空表单项
      this.form = {};
    },
    save() {
      if (this.form.id) {
        request.put("/user", this.form).then((res) => {
          console.log(res);
          if (res.code === "0") {
            this.$message({
              type: "success",
              message: "编辑成功",
            });
          } else {
            this.$message({
              type: "error",
              message: "编辑失败",
            });
          }
        });
      } else {
        request.post("/user", this.form).then((res) => {
          console.log(res);

          if (res.code === "0") {
            this.$message({
              type: "success",
              message: "新增成功",
            });
          } else {
            this.$message({
              type: "error",
              message: "新增失败",
            });
          }
        });
      }

      this.dialogVisible = false;
      this.reload();
    },
    handleEdit($index, row) {
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;
    },
    // 删除
    handleDelete($index, row) {
      //用于从当前行中获得数据定位id,把json字符串转成json对象
      this.form = JSON.parse(JSON.stringify(row));
      let id = this.form.id;
      console.log(id);
      request
        .delete("/user", {
          params: {
            id,
          },
        })
        .then((res) => {
          if (res.code === "0") {
            this.$message({
              type: "success",
              message: "删除成功",
            });
          } else {
            this.$message({
              type: "error",
              message: "删除失败",
            });
          }
        });
      //重新刷新
      this.reload();
    },
    // 分页尺寸
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.liskeSearch();
    },
    // 前往指定页
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.liskeSearch();
    },
  },
};
</script>
