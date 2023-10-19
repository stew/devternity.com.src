import { createApp } from 'vue/dist/vue.esm-bundler.js';
import ky from 'ky';
import $ from "cash-dom";
import dayjs from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat.js'
dayjs.extend(advancedFormat)

const app = createApp({
    data() {
        return {
            holder: {
                name: '',
                email: ''
            },
            ticket: {},
            ticketHttpUrl: '',
            isTextCopied: false,
            textForSharing: "🤩 Just got my ticket to DevTernity conference: https://devternity.com"
        }
    },
    created() {
        const params = new URLSearchParams(window.location.search);
        const appId = params.get('app')
        const ticketId = params.get('ticket');
        if (!appId || !ticketId) {
            this.doneLoading();
            return;
        }

        this.ticketHttpUrl = `https://api.devternity.com/applications/${appId}/${ticketId}`
        ky.get(this.ticketHttpUrl).json().then(ticket => {
            this.ticket = ticket;
            this.holder.name = ticket.name;
            this.holder.email = ticket.email;
        }).finally(() => {
            this.doneLoading();
        });
    },
    computed: {
        isHolderModified() {
            return this.holder.name !== this.ticket.name || this.holder.email !== this.ticket.email;
        },
        isUpdateEnabled() {
            const isHolderInfoValid = this.holder.name && this.holder.email && this.holder.email.includes("@");
            return isHolderInfoValid && this.isHolderModified;
        },
        isCancelVisible() {
            return this.isHolderModified;
        }
    },
    methods: {
        cancel() {
            this.holder.name = this.ticket.name;
            this.holder.email = this.ticket.email;
        },
        update() {
            const holder = this.holder;
            ky.post(this.ticketHttpUrl, { json: holder })
                .then(() => {
                    this.ticket.name = holder.name;
                    this.ticket.email = holder.email;
                }).catch(() => {
                    alert("Something went wrong. Please report to hello@devternity.com")
                })
        },
        doneLoading() {
            $('body').removeClass('opacity-0').addClass('opacity-100');
        },
        copy(text) {
            navigator.clipboard.writeText(text).finally(() => {
                this.isTextCopied = true;
            })
        },
        formatted(date) {
            return dayjs(date).format("dddd, Do MMMM")
        },
    }
})
app.mount('#app')
