<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区 -->
      <el-form
        ref="loginFromRef"
        :rules="loginRules"
        label-width="0px"
        class="login-form"
        :model="loginForm"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="bt-back">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单
      loginForm: {
        username: "admin",
        password: "123456",
      },
      // 验证规则
      loginRules: {
        username: [
          { required: true, message: "请输入登录昵称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetLoginForm: function () {
      this.$refs.loginFromRef.resetFields();
    },
    login: function () {
      this.$refs.loginFromRef.validate(async (bool, obj) => {
        if (!bool) {
          return;
        }
        const { data: res } = await this.$http.post("login", this.loginForm);
        if (res) {
          this.$message.success("登录成功");
          window.sessionStorage.setItem("token", res.data.token);
          this.$router.push("/home");
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    position: absolute;
    left: 50%;
    right: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.bt-back {
  display: flex;
  justify-content: flex-end;
}
.login-form {
  bottom: 0;
  position: absolute;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>