import $ from "cash-dom";

export class Modal {
    constructor(selector) {
        this.modal = $(selector);
    }

    open() {
        this.modal.removeClass('out').addClass('visible');
        this.listenToEsc();
        this.listenToCloseClick();
        this.takeOverTabControl();
        $('body').addClass('overflow-hidden')
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
        this.modal.removeClass('visible').addClass('out');
        this.unlistenEsc();
        this.unlistenCloseClick();
        this.restoreTabControl();
        $('body').removeClass('overflow-hidden');
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



