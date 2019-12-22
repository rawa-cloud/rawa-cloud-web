<template>
    <div :class="[$style.container]">
        <div :class="[$style.box]" class="rounded p-4" @keyup.enter="onLogin">
            <div :class="[$style.logo]">
                <img src="@/assets/logo.png" alt="&times;" class="w-3 circle">
            </div>
            <div :class="[$style.title]">瑞柚云盘</div>

            <form @submit.prevent>
                <div class="mb-3">
                    <v-input name="username" v-model.trim="form.username" placeholder="请输入账号" size="lg" block prefix="user" maxlength="32"></v-input>
                </div>
                <div class="mb-3">
                    <v-input name="password" v-model.trim="form.password" placeholder="请输入密码" size="lg" block prefix="lock" type="password" maxlength="32"></v-input>
                </div>

                <!-- <div class="mb-3 text-right">
                    <a> <v-icon type="key" class="mr-2"></v-icon> 忘记密码</a>
                </div> -->

                <v-button type="primary" size="lg" block @click="onLogin" :loading="loading">登 录</v-button>
            </form>
        </div>
    </div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Login extends Vue {
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
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: linear-gradient(180deg,hsla(0,0%,100%,0) 60%,#fff),linear-gradient(70deg,#dbedff 32%,#ebfff0);
}

.box {
    position: relative;
    width: 360px;
    height: 280px;
    background: rgba(255, 255, 255, .4);
}

.logo {
    position: absolute;
    left: 50%;
    transform: translateX(-50%) translateY(-200%);
}

.title {
    text-align: center;
    font-size: 24px;
    color: rgba(0, 0, 0, .6);
    margin: 0 0 12px 0;
    font-family: Avenir,Helvetica Neue,Arial,Helvetica,sans-serif;
}
</style>
