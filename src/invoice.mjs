import { createApp } from 'vue/dist/vue.esm-bundler.js';
import { v4 as uuid } from 'uuid';
import $ from "cash-dom";
import { object, string, array, number } from 'yup';
import ky from 'ky';
import dayjs from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat.js'
dayjs.extend(advancedFormat)

export const app = createApp({
    data() {
        return {
            invoiceId: new URLSearchParams(window.location.search).get('id'),
            showAed: new URLSearchParams(window.location.search).has('forex'),
            invoice: undefined
        }
    },
    created() {
        this.fetchInvoice();
    },
    methods: {
        checkoutLink() {
            return 'https://sales.devternity.ee/checkout/' + this.invoiceId;
        },
        fetchInvoice() {
            ky("https://devternity-22e74.firebaseio.com/devplatforms-invoices/" + this.invoiceId + ".json").json()
            .then(response => {
                this.invoice = response
            }).finally(() => {
                $('body').removeClass('opacity-0').addClass('opacity-100');
            })
        },
        dayjs
    }
})
app.mount('#app')