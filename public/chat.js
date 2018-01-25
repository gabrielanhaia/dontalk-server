new Vue({
  el: '#app',
  data: {
    chat: '',
    chatToJoin: '',
    messages: [],
    newMessage: {
      chat: '',
      author: '',
      content: ''
    },
    page: 1,
    pages: 0
  },
  methods: {
    postMessage: function () {
      if (this.newMessage.content != '') {
        this.$http.post('/api/messages', { message: this.newMessage })
        .then(function (response) {
          this.newMessage.content = '';
          this.getMessages();
        });
      }
    },
    getMessages: function (page = 1) {
      this.page = page;
      this.$http.get(`/api/messages/${this.chat}/${page}`)
        .then(function (response) {
          this.messages = response.body.docs.slice().reverse();
          this.pages = response.body.pages;
        });
    },
    saveUser: function () {
      localStorage.setItem('username', this.newMessage.author)
    },
    joinChat: function () {
      window.location = this.chatToJoin;
    }
  },
  filters: {
    moment: function (date) {
      return moment(date).format('HH:mm:ss');
    }
  },
  mounted: function () {
    this.chat = window.location.pathname.replace('/', '');
    this.newMessage.chat = this.chat;
    this.newMessage.author = localStorage.getItem('username') || 'Anonymous';
    
    if (!this.chat) return;
    
    this.getMessages();
    setInterval(() => {
      if (this.page === 1) this.getMessages();
    }, 3000);
  }
});
