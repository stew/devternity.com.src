import { createApp } from 'vue/dist/vue.esm-bundler.js';
import { v4 as uuid } from 'uuid';
import $ from "cash-dom";
import { object, string, array, number } from 'yup';
import ky from 'ky';
import dayjs from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat.js'
dayjs.extend(advancedFormat)

$(window).on('pageshow', () => {
    $('body').removeClass('opacity-0').addClass('opacity-100');
})

export const applicationSchema = object({
    promo: string().ensure(),
    product: string().required(),
    total: number().positive().integer().required(),
    discount: number().integer().required(),
    tickets: array(object({
        name: string().required(),
        email: string().email().required(),
        id: string().uuid().required(),
        product: object({
            price: number().required(),
            title: string().required(),
            date: string().matches(/^(\d{4})-(\d{2})-(\d{2})$/).required(),
        }).required()
    })),
    billing: object({
        name: string().required(),
        currency: string().length(3).required(),
        email: string().email().required(),
        company: object({
            po: string().default(undefined),
            name: string().required(),
            vat: string().required(),
            address: string().required()
        }).default(undefined)
    })
});

export const app = createApp({
    data() {
        return {
            status: '',
            errors: [],
            tickets: [],
            promo: '',
            billing: {
                name: '',
                email: '',
                company: undefined,
                currency: this.resolveCurrency()
            },
            total: 0,
            discount: 0,
            product: this.$product,
            ticketOptions: this.$ticketOptions,
        }
    },
    created() {
        this.addMoreTickets();
    },
    methods: {
        resolveCurrency() {
            const urlParams = new URLSearchParams(window.location.search);
            const urlCurrency = urlParams.get('currency')
            const urlIncludesKnownCurrency = this.$prices[urlCurrency];
            return urlIncludesKnownCurrency ? urlCurrency : 'EUR'
        },
        formatted(date) {
            return dayjs(date).format("MMM Do")
        },
        recalculate() {
            const discounts = {
                '_UPSKILL': 5,
                '_SPONSORED': 100
            }

            const matchingCode = Object.keys(discounts).find(code => this.promo.endsWith(code));
            const discountPercents = discounts[matchingCode] || 0;

            const price = this.tickets.filter(it => !!it.product).map(it => it.product.price).reduce((it, that) => it + that, 0);
            const discount = Math.floor(price * discountPercents / 100);

            this.discount = discount;
            this.total = price - discount;
        },
        addMoreTickets() {
            this.tickets.push({ name: '', email: '', product: '', id: uuid() })
        },
        changeTicket(index) {
            this.tickets[index].product.price = this.$prices[this.billing.currency]
            this.recalculate()
        },
        deleteTicket(index) {
            this.tickets.splice(index, 1);
            this.recalculate();
        },
        changePromo() {
            this.recalculate();
        },
        toggleBillToCompany() {
            this.billing.company = this.billing.company ? undefined : {}
        },
        register() {
            const { total, discount, tickets, promo, product, billing } = this;
            const application = {
                product,
                billing,
                promo,
                total,
                discount,
                tickets
            }

            applicationSchema.validate(application, { strict: true, abortEarly: false }).then(app => {
                console.log(app)
                this.errors = []
                this.status = 'progress'
                ky.post('https://api.devternity.com/applications', { json: app })
                    .then(() => {
                        this.status = 'success'
                    }).catch(() => {
                        this.status = 'error'
                    })
            }).catch(errors => this.errors = errors.inner.map(e => e.path));



        }
    }
})
app.config.globalProperties.$product = window.product
app.config.globalProperties.$ticketOptions = window.ticketOptions
app.config.globalProperties.$prices = window.prices
app.mount('#app')