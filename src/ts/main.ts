import "../sass/style.scss";

import $ from 'jquery';
import {Modal} from "./Modal";

function escapeHTML(htmlString: string): string {
    let str: string = htmlString;
    str = str.replace(/&/g, '&amp;');
    str = str.replace(/</g, '&lt;');
    str = str.replace(/>/g, '&gt;');
    str = str.replace(/"/g, '&quot;');
    str = str.replace(/'/g, '&#39;');
    return str;
}

function doSomethingAsync(callback: () => void) {
    setTimeout(callback, 500);
}

document.addEventListener('DOMContentLoaded', (e: Event) => {
    const modal: Modal = new Modal('sampleModal');

    $('#sampleModalOpenButton').on('click', () => {
        modal.open();
    });

    $('#sampleModalNext').on('click', () => {
        modal.nextScene();
    });

    $('#sampleModalAdd').on('click', () => {
        const $name: JQuery = $('#name');
        const $age: JQuery = $('#age');

        modal.showLoading();

        doSomethingAsync(() => {
            $('#userList').append($('<li class="userList__item">' + escapeHTML($name.prop('value')) + '（' + escapeHTML($age.prop('value')) + '）' + '</li>'));
            $name.prop('value', '');
            $age.prop('value', '');
            modal.close();
        });
    });
});