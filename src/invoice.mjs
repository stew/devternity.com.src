import { createApp } from 'vue/dist/vue.esm-bundler.js';
import $ from "cash-dom";
import ky from 'ky';
import dayjs from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat.js'
dayjs.extend(advancedFormat)

export const app = createApp({
    data() {
        return {
            invoiceId: new URLSearchParams(window.location.search).get('id'),
            showAed: new URLSearchParams(window.location.search).has('forex'),
            invoice: undefined,
            iban: undefined
        }
    },
    created() {
        this.fetchInvoice();
    },
    methods: {
        checkoutLink() {
            return 'https://api.devternity.com/checkout/' + this.invoiceId;
        },
        fetchInvoice() {
            ky("https://devternity-22e74.firebaseio.com/invoices/" + this.invoiceId + ".json").json()
                .then(response => {
                    this.invoice = { ...response, orders: response.orders.filter(it => !!it) };
                    const ibans = {
                        'AED': 'AE170860000009323162912',
                        'EUR': 'AE390860000009928994446',
                        'USD': 'AE090860000009820208710',
                        'GBP': 'AE160860000009548466285'
                    }
                    this.iamVatPayer = false
                    this.iban = ibans[this.invoice.billing.currency]
                }).finally(() => {
                    $('body').removeClass('opacity-0').addClass('opacity-100');
                })
        },
        dayjs
    }
})
app.mount('#app')
