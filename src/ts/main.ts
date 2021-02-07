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

    $('.sampleModalPrev').on('click', () => {
        modal.prevScene();
    });

    $('.sampleModalNext').on('click', () => {
        modal.nextScene();
    });

    $('.sampleModalNext2').on('click', () => {
        modal.showLoading();

        doSomethingAsync(() => {
            modal.hideLoading();
            modal.nextScene();
        });
    });

    $('.sampleModalClose').on('click', () => {
        modal.close();
    });
});