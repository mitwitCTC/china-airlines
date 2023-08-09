const huahang_spaces = document.querySelector('#huahang_spaces');
const jixiu_spaces = document.querySelector('#jixiu_spaces');
if (sessionStorage.getItem('userAccess') === '華航') {
    jixiu_spaces.classList.add('d-none');
} else if (sessionStorage.getItem('userAccess') === '機修') {
    huahang_spaces.classList.add('d-none');
}