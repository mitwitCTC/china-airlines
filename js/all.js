import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
const API = "https://2cb7-122-116-23-30.ngrok-free.app";

let editUserModal = null;
let deleteUserModal = null;

createApp({
    data() {
        return {
            huahang_spaces: [],
            jixiu_spaces: [],
            users: [],
            tempUser: {},
            isNewUser: false,
            access: []
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
        // 判斷權限
        accessFrom() {
            if (sessionStorage.getItem('userAccess') === '華航') {
                this.access = [
                    {
                        id: 2,
                        access: '華航'
                    }
                ]
            } else if (sessionStorage.getItem('userAccess') === '機修') {
                this.access = [
                    {
                        id: 3,
                        access: '機修'
                    }
                ]
            } else {
                this.access = [
                    {
                        id: 1,
                        access: '管理者'
                    },
                    {
                        id: 2,
                        access: '華航'
                    },
                    {
                        id: 3,
                        access: '機修'
                    },
                ]
            }
        },
        openEditUserModal(status, user) {
            this.accessFrom();
            if (status === 'create') {
                editUserModal.show();
                this.isNewUser = true;
                this.tempUser = {};
            } else if (status === 'edit') {
                this.isNewUser = false;
                this.tempUser = Object.assign({}, user);
                this.tempUser.password = "";
                if (sessionStorage.getItem('userCAL') == this.tempUser.account || sessionStorage.getItem('userAccess') == '管理者') {
                    editUserModal.show();
                } else {
                    alert("無權限！")
                }
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
            } else if (!this.isNewUser) {
                // 確認原密碼
                const checkUserApi = `${API}/users/checkUser`;
                axios
                    .post(checkUserApi, { target: this.tempUser })
                    .then((response) => {
                        // 原密碼正確
                        if (response.data.returnCode == 0) {
                            if (this.tempUser.newPassword === this.tempUser.newPasswordComfirm) {
                                this.tempUser.password = this.tempUser.newPasswordComfirm;
                                // 修改密碼
                                updateUserApi = `${API}/users/updatePassword/${this.tempUser.id}`;
                                axios
                                    .put(updateUserApi, { target: { password: this.tempUser.password } })
                                    .then((response) => {
                                        sessionStorage.removeItem('userCAL');
                                        alert(response.data.message + "，請重新登入！");
                                        window.location = 'login.html';
                                    })
                            } else {
                                alert("新密碼輸入不一致！");
                            }
                            // 原密碼錯誤
                        } else if (response.data.returnCode == -1) {
                            alert("原密碼輸入錯誤！")
                        }
                    })
            }
        },
        openDeleteUserModal(user) {
            this.tempUser = Object.assign({}, user)
            if (sessionStorage.getItem('userCAL') == this.tempUser.account || sessionStorage.getItem('userAccess') == '管理者') {
                deleteUserModal.show();
            } else {
                alert("無權限！");
            }
        },
        deleteUser() {
            const deleteUserApi = `${API}/users/deleteUser/${this.tempUser.id}`;
            axios
                .patch(deleteUserApi)
                .then((response) => {
                    alert(response.data.message + '，請重新登入！');
                    sessionStorage.removeItem('userCAL');
                    window.location = 'login.html';
                })
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
        },
        logout() {
            sessionStorage.removeItem('userCAL');
            sessionStorage.removeItem('userAccess');
            const logoutApi = `${API}/users/logOut`;
            axios
                .post(logoutApi)
                .then((response) => {
                    alert(response.data.message);
                    window.location = 'login.html';
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
        deleteUserModal = new bootstrap.Modal('#deleteUserModal');
    }
}).mount('#app')