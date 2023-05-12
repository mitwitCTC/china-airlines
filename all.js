import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
const API = "http://192.168.50.220:4330";
// let updateModal = null;

createApp({
    data() {
        return {
            huahang_spaces: [],
            jixiu_spaces: [],
            // temp_spaces: {}
        }
    },
    methods: {
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
        },
        // openUpdateModal(item) {
        //     this.temp_spaces = { ...item}
        //     updateModal.show();
        // },
        // update() {
        //     console.log("修改成功");
        //     console.log(this.temp_spaces);   
        //     updateModal.hide();
        // }
    },
    mounted() {
        this.getHuahang_spaces();
        this.getJixiu_spaces();
        setInterval(() => this.getHuahang_spaces(), 60000);
        setInterval(() => this.getJixiu_spaces(), 60000);
        // 初始化 bootstrap modal
        // updateModal = new bootstrap.Modal('#updateModal');
    }
}).mount('#app')