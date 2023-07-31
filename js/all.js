import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
const API = "https://7b44-122-116-23-30.ngrok-free.app";

createApp({
    data() {
        return {
            huahang_spaces: [],
            jixiu_spaces: [],
        }
    },
    methods: {
        checkLogin(){
            if (sessionStorage.getItem('userCAL')) {
                this.getHuahang_spaces()
                this.getJixiu_spaces();
            } else {
                alert("請登入");
                window.location = 'login.html'
            }
        },
        getHuahang_spaces(){
            const huahang_spacesAPI = `${API}/parking_place/huahang`;
            axios
            .get(huahang_spacesAPI)
            .then((response => {
                this.huahang_spaces = response.data;
            }))
            .catch((error) => {
                alert(error);
            })
        },
        getJixiu_spaces(){
            const jixiu_spacesAPI = `${API}/parking_place/jixiu`;
            axios
            .get(jixiu_spacesAPI)
            .then((response => {
                this.jixiu_spaces = response.data;
            }))
            .catch((error) => {
                alert(error);
            })
        }
    },
    mounted() {
        this.checkLogin()
        // this.getHuahang_spaces();
        // this.getJixiu_spaces();
        setInterval(() => this.getHuahang_spaces(), 15000);
        setInterval(() => this.getJixiu_spaces(), 15000);
    }
}).mount('#app')