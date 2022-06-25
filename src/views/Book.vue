
<template>
  <div style="padding: 12px">
    <!-- 功能区域 -->
    <div style="margin: 10px 0" v-if="user.role === 1">
      <el-button type="primary" @click="add">上传新书</el-button>
      <!-- 批量删除按钮 -->
      <el-popconfirm
        v-if="user.role === 1"
        title="确定删除吗？"
        @confirm="deleteBatch"
      >
        <template #reference>
          <el-button type="danger">批量删除</el-button>
        </template>
      </el-popconfirm>
    </div>

    <!-- 搜索区域 -->
    <div style="margin: 10px 0">
      <el-input
        v-model="search"
        placeholder="请根据书名查询"
        style="width: 20%"
      ></el-input>
      <el-button type="primary" style="margin-left: 5px" @click="liskeSearch"
        >查询</el-button
      >
    </div>
    <el-table :data="tableData" height="500" stripe style="width: 100%"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="180"> </el-table-column>
      <el-table-column prop="id" label="ID" sortable width="180" />
      <el-table-column prop="bookName" label="书名" sortable width="180" />
      <el-table-column prop="price" label="单价" width="180" />
      <el-table-column prop="author" label="作者" width="180" />
      <el-table-column prop="createTime" label="出版时间" width="180" />
      <el-table-column label="封面">
        <template #default="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.cover"
            :preview-src-list="[scope.row.cover]"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        align="right"
        label="操作"
        width="100"
        header-align="center"
      >
        <template #default="scope">
          <el-button
            size="small"
            @click="handleEdit(scope.$index, scope.row)"
            v-if="user.role === 1"
          >
            编辑
          </el-button>
          <el-button size="small" @click="download(scope.$index, scope.row)">
            下载
          </el-button>
          <el-popconfirm
            title="确认删除吗?"
            @confirm="handleDelete(scope.$index, scope.row)"
            v-if="user.role === 1"
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
        <el-form-item label="名称">
          <el-input v-model="form.bookName" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="form.price" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="form.author" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="出版时间">
          <el-date-picker
            v-model="form.createTime"
            value-format="YYYY-MM-DD"
            type="date"
            style="width: 80%"
            clearable
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="封面">
          <el-upload
            ref="upload"
            :action="filesUploadUrl"
            :on-success="filesUploadSuccess"
          >
            <el-button type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script >
import request from "@/utils/request";
export default {
  // 获取user用户信息
  props: ["user"],
  // 用于刷新界面
  inject: ["reload"],
  name: "Book",
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
      filesUploadUrl: "",
      // 批量删除的id
      ids: [],
    };
  },
  // 钩子函数
  created() {
    this.filesUploadUrl =
      "http://" + window.server.filesUploadUrl + ":8099/houcheng/file/upload";
    this.liskeSearch();
  },

  methods: {
    // 给ids赋值
    handleSelectionChange(val) {
      this.ids = val.map(v => v.id)   // [{id,name}, {id,name}] => [id,id]
    },
    // 批量删除函数
    deleteBatch() {
       console.log(this.ids)
      if (!this.ids.length) {
        this.$message.warning("请选择数据！");
        return;
      }
      request.post("/book/deleteBatch", this.ids).then((res) => {
        if (res.code === "0") {
          this.$message.success("批量删除成功");
          this.reload();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //   上传文件
    filesUploadSuccess(res) {
      console.log(res.data);
      this.form.cover = res.data;
    },
    //查询/按钮
    liskeSearch() {
      request
        .get("/book", {
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
        request.put("/book", this.form).then((res) => {
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
        request.post("/book", this.form).then((res) => {
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
      //用于从当前行中获得数据定位id
      this.form = JSON.parse(JSON.stringify(row));
      let id = this.form.id;
      console.log(id);
      request
        .delete("/book", {
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

    // 下载此书
    download($index, row) {
      console.log(row.cover);
      window.location.href = row.cover;
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
