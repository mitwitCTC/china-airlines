import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const API = 'https://2cb7-122-116-23-30.ngrok-free.app'

let loginCheckData = {};

createApp({
    data() {
        return {
            // login
            users: {
                account: '',
                password: '',
            },
        }
    },
    methods: {
        // login
        login() {
            const loginApi = `${API}/users/login`;
            axios
                .post(loginApi, { target: this.users })
                .then((response) => {
                    if (response.data.returnCode == 0) {
                        // console.log(response.data.data);
                        loginCheckData.account = response.data.data.account;
                        // loginCheckData.userToken = response.data.data.token;
                        loginCheckData.id = response.data.data.id;
                        loginCheckData.access = response.data.data.access
                        // Init
                        sessionStorage.setItem("userCAL", loginCheckData.account);
                        sessionStorage.setItem("userAccess", loginCheckData.access);
                        alert(response.data.message);
                        window.location = `index.html`;
                    } else if (response.data.returnCode == 400) {
                        alert(response.data.message);
                    }
                })
            .catch((message) => {
                // alert("帳號或密碼錯誤！請確認");
                // alert(message);
            })
        },
        // 確認是否登入
        checkLogin(){
            if (sessionStorage.getItem('userCAL')) {
                alert("已登入，即將跳轉頁面")
                window.location = 'index.html'
            }
        }
    },
    mounted() {
        this.checkLogin();
    }
}).mount('#app');