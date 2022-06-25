<template>
  <div
    style="
      width: 100%;
      height: 100vh;
      background-color: #DODODO;
      overflow: hidden;
    "
  >
    <div style="width: 400px; margin: 150px auto">
      <div style="color: #2c3e50; font-size: 30px; text-align: center">
        欢迎登录
      </div>
      <el-form ref="form" :model="form" size="normal" :rules="rules">
        <el-form-item prop="username">
          <el-input prefix-icon="Avatar" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="Lock"
            v-model="form.password"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item prop="verifyCode" label="验证码">
          <el-input
            placeholder="请输入验证码"
            v-model="form.verifyCode"
          ></el-input>
          <div class="verify">
            <el-image
              style="width: 100px; height: 100px"
              :src="verifyCodePicUrl"
              :fit="fit"
            />
            <el-button
              type="text"
              @click="resetVerifyCode"
              :disabled="isDisable"
              >看不清换一张</el-button
            >
          </div>
        </el-form-item>

        <el-form-item>
          <el-button style="width: 100%" type="primary" @click="login"
            >登录</el-button
          >
        </el-form-item>

        <el-form-item
          ><el-button type="text" @click="$router.push('/register')"
            >前往注册&gt;&gt;
          </el-button></el-form-item
        >
      </el-form>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
export default {
  name: "Login",
  data() {
    return {
      // 验证码路径
      verifyCodePicUrl: "",
      // 表单数据
      form: {},
      // 表单校验
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],

        verifyCode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    sessionStorage.removeItem("user");
    this.resetVerifyCode();
  },
  methods: {
    // 重新生成验证码
    resetVerifyCode() {
      this.isDisable = false;
      this.getVerifyCodePic();
    },
    // 发起获取验证码请求
    getVerifyCodePic() {
      var that = this;
      request
        .get("/code/getVerifyCodePic")
        .then((res) => {
          console.log(res);
          if (res.code == 0 && res.data) {
            that.form.verifyKey = res.data.key;
            that.verifyCodePicUrl = "data:image/png;base64," + res.data.image;
          } else if (res.code == -1 && res.msg) {
            that.$message.error(res.msg);
          } else {
            that.$message.error("获取验证码失败");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    login() {
      console.log(this.form);
      // 表示验证成功才能登录
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // 发送请求
          request.post("/user/login", this.form).then((res) => {
            if (res.code === "0") {
              this.$message({
                type: "success",
                message: res.msg,
              });
              console.log(res.data + "1111");
              // 缓存用户信息
              sessionStorage.setItem("user", JSON.stringify(res.data));
              this.$router.push("/");
            } else {
              console.log(res);
              this.resetVerifyCode()
              this.$message({
                type: "error",
                message: res.msg,
              });
            }
          });
        }
      });
    },
  },
};
</script>
<style>
.verify {
  margin-top: 10px;
}
</style>