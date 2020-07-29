<template>
    <div :class="[$style.container]">
        <!-- <div :class="[$style.header]">
             <div :class="[$style.logo]">
                <img src="@/assets/logo.png" alt="&times;" class="circle">
            </div>
            <div :class="[$style.title]">
              <div>锐柚文档管理</div>
              <div>rawa cloud</div>
            </div>
        </div> -->
        <div :class="[$style.body]">
          <div :class="[$style.box]" class="p-4" @keyup.enter="onLogin">
            <div :class="[$style.label]">锐柚文档管理</div>

              <form @submit.prevent>
                  <div class="mb-3">
                      <v-input name="username" v-model.trim="form.username" placeholder="请输入账号" size="lg" block prefix="user" maxlength="32"></v-input>
                  </div>
                  <div class="mb-4">
                      <v-input name="password" v-model.trim="form.password" placeholder="请输入密码" size="lg" block prefix="lock" type="password" maxlength="32"></v-input>
                  </div>

                  <!-- <div class="mb-3 text-right">
                      <a> <v-icon type="key" class="mr-2"></v-icon> 忘记密码</a>
                  </div> -->

                  <v-button type="primary" size="lg" block @click="onLogin" :loading="loading">登 录</v-button>
              </form>
          </div>
          <div :class="[$style.tip]"><a :href="url" target="_blank">手机端访问: {{url}}</a></div>
        </div>
    </div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'
import MenuIcon from './menu-icon/index.vue'

const url = 'http://' + window.location.hostname + ':8004'

@Component({
  components: { MenuIcon }
})
export default class Login extends Vue {
    url = url

    form = {
      username: '',
      password: ''
    }

    loading: boolean = false

    onLogin () {
      this.$auth.login(this.form)
    }
}
</script>

<style lang="scss" module>
.container {
  height: 100vh;
  width: 100vw;
}

// .header {
//   height: 60px;
//   display: flex;
// }

.body {
  position: relative;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-image: url("@/assets/login.jpg");
  background-size: 100% auto;
}

.box {
    position: relative;
    width: 360px;
    height: 300px;
    margin-right: 10%;
    background: rgba(255, 255, 255, 1);
    border-radius: 2px;
    margin-bottom: 8%;
}

.logo {
  padding: 8px 0 8px 20px;
  &>img {
    width: 48px;
    height: 48px;
  }
}

.title {
  padding: 4px 0 4px 16px;
  text-align: center;
  font-size: 24px;
  color: rgba(0, 0, 0, .6);
  font-family: "Comic Sans MS", cursive, Avenir,Helvetica Neue,Arial,Helvetica,sans-serif;
  line-height: 1.2;
}

.label {
  text-align: center;
  margin-bottom: 16px;
  font-size: 24px;
  color: rgba(0, 0, 0, .6);
  line-height: 1.2;
}

.tip {
  position: absolute;
  bottom: 2%;
  width: 100%;
  color: #fff;
  text-align: center;
  & > a {
    color: #fff;
  }
  left: 0;
}
</style>
