<template>
  <div class="login" clearfix>
    <div class="login-wrap">
      <div class="login-logo">
        <img src="../assets/img/register_logo.png">
      </div>
      <el-form ref="register-form" :model="user" :rules="rules" label-position="center">
        <el-form-item prop="userName">
          <el-input v-model="user.phone" placeholder="请输入用户名h或手机号" autoComplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="user.password" placeholder="请输入密码" type="password" autoComplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doLogin">登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox> 我已经阅读并同意
            <a href="https://www.hupu.com/policies/terms" data-title=用户协议 target="_blank">用户协议</a>及<a
              href="https://www.hupu.com/policies/privacy" data-title="隐私条款" target="_blank">隐私条款</a></el-checkbox>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'login',
  data() {
    return {
      user: {
        phone: '',
        password: ''
      },
      rules: {
        phone: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
          {min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
          {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
  },
  methods: {
    doLogin() {
      if (!this.user.phone) {
        this.$message.error('请输入用户名！')
      } else if (!this.user.password) {
        this.$message.error('请输入密码！')
      } else {
        this.$http().post('/login/userName', {
          phone: this.user.phone,
          password: this.user.password
        })
          .then(res => {
            // console.log("输出response.data.status", res.data.status);
            if (res.data.status === 200) {
              // 校验用户名和密码是否正确;
              this.$message({
                duration: 1000,
                message: '登陆成功',
                type: 'success'
              })
              this.$router.push({path: '/main'})
            } else {
              alert('您输入的用户名或密码错误！')
            }
          })
      }
    }
  }
}
</script>
<style scoped>
.login {
  background: url("../assets/img/register.png") no-repeat 100% 100%;
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;

}

.login-wrap {
  position: fixed;
  width: 540px;
  height: 580px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
  background-color: white;
}

.login-logo {
  position: absolute;
  margin-top: 30px;
  margin-left: 80px;
}

.el-form {
  position: absolute;
  width: 540px;
  height: 400px;
  margin-top: 200px;
}

.el-input {
  padding-left: 15px;
  box-sizing: border-box;
  padding-right: 15px;
  border: 1px #CCC;
  width: 363px;
  height: 44px;
}

.el-input >>> .el-input__inner {
  border-radius: 0;
  height: 44px;
}

.el-button {
  width: 330px;
  background-color: #e42837;
}

</style>
