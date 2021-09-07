<template>
  <div id="app-2">
  <span v-bind:title="message">
    鼠标悬停几秒钟查看此处动态绑定的提示信息！
  </span>
    <a v-bind:href="url">点击跳转</a>
    <a :href="url">缩写跳转</a>
    <p>{{ pmessage }}</p>
    <button v-on:click="reverseMessage()">翻转</button>
    <p>{{ imessage }}</p>
    <p>Computed reversed message:'{{ reverseMessage1 }}'</p>
    <input v-model="imessage">
    <p>{{ fullName }}</p>
    <template>
      <div id="watch">
        <p>
          Ask a yes/no question:
          <input v-model="question">
        </p>
        <p>{{ answer }}</p>
      </div>
    </template>
    <template>
      <div id="v-for-e">
        <ul>
          <li v-for="(item,index) in items" v-bind:key="item.message" >
            {{ top }} - {{index}} - {{item.message}}
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'Register',
  data() {
    return {
      message: '页面加载于 ' + new Date().toLocaleString(),
      url: 'https://www.baidu.com',
      pmessage: 'Hello Vue.js!',
      imessage: 'HelloWorld',
      firstName: 'foo',
      secondName: 'Sb',
      question: '',
      answer: 'I cannot give you an answer until you ask a question!',
      top: 'top',
      items: [
        {message: '陈浩'},
        {message: '方基于'},
        {message: '要领'}
      ]
    }
  },
  created() {
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 500)
  },
  methods: {
    reverseMessage() {
      this.fullName = 'Jhon Doe'
    },
    getAnswer: function () {
      if (this.question.indexOf('?') === -1) {
        this.answer = 'Questions usually contain a question mark. ;-)'
        return
      }
      this.answer = 'Thinking...'
      let vm = this
      this.$http(
        {
          url: 'https://yesno.wtf/api',
          method: 'get'
        })
        .get()
        .then(function (response) {
          // eslint-disable-next-line no-undef
          vm.answer = _.capitalize(response.data.answer)
        })
        .catch(function (error) {
          vm.answer = 'Error! Could not reach the API. ' + error
        })
    }
  },
  computed: {
    reverseMessage1: function () {
      return this.pmessage.split('').reverse().join('')
    },
    fullName: {
      get: function () {
        return this.firstName + this.secondName
      },
      set: function (value) {
        let names = value.split(' ')
        this.firstName = names[0]
        this.secondName = names[names.length - 1]
      }
    }
  },
  watch: {
    question: function (newQuestion, oldQuestion) {
      this.answer = 'Waiting for you to stop typing...'
      this.debouncedGetAnswer()
    }
  }
}
</script>

<style scoped>

</style>
