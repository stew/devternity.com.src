import $ from "cash-dom";

export class Modal {
    constructor(selector) {
        this.modal = $(selector);
    }

    open() {
        this.modal.removeClass('hidden').addClass('block');
        // remember scroll position
        this.scrollY = window.scrollY;
        this.listenToEsc();
        this.listenToCloseClick();
        this.takeOverTabControl();
        $('html, body').addClass('overflow-hidden h-screen');

    }

    listenToEsc() {
        $(window).on('keyup', (e) => {
            if (e.key == "Escape") {
                this.close();
            }
        });
    }

    listenToCloseClick() {
        this.modal.find('.close').on('click', () => {
            this.close();
        });
    }

    takeOverTabControl() {
        $('a, button').attr('tabindex', '-1');
        this.modal.find('.close').removeAttr('tabindex');
    }

    close() {
        this.modal.addClass('hidden').removeClass('block');
        this.unlistenEsc();
        this.unlistenCloseClick();
        this.restoreTabControl();
        $('html, body').removeClass('overflow-hidden h-screen');
        // restore scroll position
        window.scrollTo({
            top: this.scrollY, behavior: 'instant'
        });
    }

    unlistenEsc() {
        $(window).off('keyup');
    }

    unlistenCloseClick() {
        this.modal.find('.close').off('click');
    }

    restoreTabControl() {
        $('a, button').removeAttr('tabindex');
        $('.close').attr('tabindex', '-1');
    }
}



