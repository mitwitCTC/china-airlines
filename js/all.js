import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
const API = "https://1192-122-116-23-30.ngrok-free.app";

let editUserModal = null;

createApp({
    data() {
        return {
            huahang_spaces: [],
            jixiu_spaces: [],
            users: [],
            tempUser: {},
            isNewUser: false
        }
    },
    methods: {
        checkLogin() {
            if (sessionStorage.getItem('userCAL')) {
                this.getHuahang_spaces()
                this.getJixiu_spaces();
                this.getUsers();
            } else {
                alert("請登入");
                window.location = 'login.html'
            }
        },
        getUsers() {
            const getUsersApi = `${API}/users/userInfo`;
            axios
                .get(getUsersApi)
                .then((response) => {
                    this.users = response.data;
                })
        },
        openEditUserModal(status, user) {
            editUserModal.show();
            if (status === 'create') {
                this.isNewUser = true;
                this.tempUser = {};
            } else if (status === 'edit') {
                this.isNewUser = false;
                this.tempUser = Object.assign({}, user);
                this.tempUser.password = "";
            }
        },
        updateUser() {
            let updateUserApi = `${API}/users/createUser`;
            if (this.isNewUser) {
                axios
                    .post(updateUserApi, { target: this.tempUser })
                    .then((response) => {
                        alert(response.data.message);
                        editUserModal.hide();
                        this.getUsers();
                    })
            }else if(!this.isNewUser){
                // 確認原密碼
                const checkUserApi = `${API}/users/checkUser`;
                axios
                .post(checkUserApi, {target: this.tempUser})
                .then((response) => {
                    // 原密碼正確
                    if (response.data.returnCode == 0){
                        if (this.tempUser.newPassword === this.tempUser.newPasswordComfirm){
                            this.tempUser.password = this.tempUser.newPasswordComfirm;
                            // 修改密碼
                            updateUserApi = `${API}/users/updatePassword/${this.tempUser.id}`;
                            axios
                            .put(updateUserApi, {target: {password: this.tempUser.password}})
                            .then((response) => {
                                if (sessionStorage.getItem('userCAL') == this.tempUser.account){
                                    sessionStorage.removeItem('userCAL');
                                    alert("已修改密碼，請重新登入！");
                                    window.location = 'login.html';
                                }else{
                                    alert(response.data.message);
                                    this.getUsers();
                                    editUserModal.hide();
                                }
                            })
                        } else {
                            alert("新密碼輸入不一致！");
                        }
                    // 原密碼錯誤
                    }  else if (response.data.returnCode == -1){
                        alert("原密碼輸入錯誤！")
                    }
                })
            }
        },
        getHuahang_spaces() {
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
        getJixiu_spaces() {
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
        editUserModal = new bootstrap.Modal('#editUserModal');
    }
}).mount('#app')