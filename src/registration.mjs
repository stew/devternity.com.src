import { createApp } from 'vue/dist/vue.esm-bundler.js';
import { v4 as uuid } from 'uuid';
import $ from "cash-dom";
import { object, string, array, number } from 'yup';
import ky from 'ky';
import dayjs from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat.js'
dayjs.extend(advancedFormat)

import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";

const countries = {
    "AF": "Afghanistan",
    "AX": "Aland Islands",
    "AL": "Albania",
    "DZ": "Algeria",
    "AS": "American Samoa",
    "AD": "Andorra",
    "AO": "Angola",
    "AI": "Anguilla",
    "AQ": "Antarctica",
    "AG": "Antigua And Barbuda",
    "AR": "Argentina",
    "AM": "Armenia",
    "AW": "Aruba",
    "AU": "Australia",
    "AT": "Austria",
    "AZ": "Azerbaijan",
    "BS": "Bahamas",
    "BH": "Bahrain",
    "BD": "Bangladesh",
    "BB": "Barbados",
    "BY": "Belarus",
    "BE": "Belgium",
    "BZ": "Belize",
    "BJ": "Benin",
    "BM": "Bermuda",
    "BT": "Bhutan",
    "BO": "Bolivia",
    "BA": "Bosnia And Herzegovina",
    "BW": "Botswana",
    "BV": "Bouvet Island",
    "BR": "Brazil",
    "IO": "British Indian Ocean Territory",
    "BN": "Brunei Darussalam",
    "BG": "Bulgaria",
    "BF": "Burkina Faso",
    "BI": "Burundi",
    "KH": "Cambodia",
    "CM": "Cameroon",
    "CA": "Canada",
    "CV": "Cape Verde",
    "KY": "Cayman Islands",
    "CF": "Central African Republic",
    "TD": "Chad",
    "CL": "Chile",
    "CN": "China",
    "CX": "Christmas Island",
    "CC": "Cocos (Keeling) Islands",
    "CO": "Colombia",
    "KM": "Comoros",
    "CG": "Congo",
    "CD": "Congo, Democratic Republic",
    "CK": "Cook Islands",
    "CR": "Costa Rica",
    "CI": "Cote D\"Ivoire",
    "HR": "Croatia",
    "CU": "Cuba",
    "CY": "Cyprus",
    "CZ": "Czech Republic",
    "DK": "Denmark",
    "DJ": "Djibouti",
    "DM": "Dominica",
    "DO": "Dominican Republic",
    "EC": "Ecuador",
    "EG": "Egypt",
    "SV": "El Salvador",
    "GQ": "Equatorial Guinea",
    "ER": "Eritrea",
    "EE": "Estonia",
    "ET": "Ethiopia",
    "FK": "Falkland Islands (Malvinas)",
    "FO": "Faroe Islands",
    "FJ": "Fiji",
    "FI": "Finland",
    "FR": "France",
    "GF": "French Guiana",
    "PF": "French Polynesia",
    "TF": "French Southern Territories",
    "GA": "Gabon",
    "GM": "Gambia",
    "GE": "Georgia",
    "DE": "Germany",
    "GH": "Ghana",
    "GI": "Gibraltar",
    "GR": "Greece",
    "GL": "Greenland",
    "GD": "Grenada",
    "GP": "Guadeloupe",
    "GU": "Guam",
    "GT": "Guatemala",
    "GG": "Guernsey",
    "GN": "Guinea",
    "GW": "Guinea-Bissau",
    "GY": "Guyana",
    "HT": "Haiti",
    "HM": "Heard Island & Mcdonald Islands",
    "VA": "Holy See (Vatican City State)",
    "HN": "Honduras",
    "HK": "Hong Kong",
    "HU": "Hungary",
    "IS": "Iceland",
    "IN": "India",
    "ID": "Indonesia",
    "IR": "Iran, Islamic Republic Of",
    "IQ": "Iraq",
    "IE": "Ireland",
    "IM": "Isle Of Man",
    "IL": "Israel",
    "IT": "Italy",
    "JM": "Jamaica",
    "JP": "Japan",
    "JE": "Jersey",
    "JO": "Jordan",
    "KZ": "Kazakhstan",
    "KE": "Kenya",
    "KI": "Kiribati",
    "KR": "Korea",
    "KP": "North Korea",
    "KW": "Kuwait",
    "KG": "Kyrgyzstan",
    "LA": "Lao People\"s Democratic Republic",
    "LV": "Latvia",
    "LB": "Lebanon",
    "LS": "Lesotho",
    "LR": "Liberia",
    "LY": "Libyan Arab Jamahiriya",
    "LI": "Liechtenstein",
    "LT": "Lithuania",
    "LU": "Luxembourg",
    "MO": "Macao",
    "MK": "Macedonia",
    "MG": "Madagascar",
    "MW": "Malawi",
    "MY": "Malaysia",
    "MV": "Maldives",
    "ML": "Mali",
    "MT": "Malta",
    "MH": "Marshall Islands",
    "MQ": "Martinique",
    "MR": "Mauritania",
    "MU": "Mauritius",
    "YT": "Mayotte",
    "MX": "Mexico",
    "FM": "Micronesia, Federated States Of",
    "MD": "Moldova",
    "MC": "Monaco",
    "MN": "Mongolia",
    "ME": "Montenegro",
    "MS": "Montserrat",
    "MA": "Morocco",
    "MZ": "Mozambique",
    "MM": "Myanmar",
    "NA": "Namibia",
    "NR": "Nauru",
    "NP": "Nepal",
    "NL": "Netherlands",
    "AN": "Netherlands Antilles",
    "NC": "New Caledonia",
    "NZ": "New Zealand",
    "NI": "Nicaragua",
    "NE": "Niger",
    "NG": "Nigeria",
    "NU": "Niue",
    "NF": "Norfolk Island",
    "MP": "Northern Mariana Islands",
    "NO": "Norway",
    "OM": "Oman",
    "PK": "Pakistan",
    "PW": "Palau",
    "PS": "Palestinian Territory, Occupied",
    "PA": "Panama",
    "PG": "Papua New Guinea",
    "PY": "Paraguay",
    "PE": "Peru",
    "PH": "Philippines",
    "PN": "Pitcairn",
    "PL": "Poland",
    "PT": "Portugal",
    "PR": "Puerto Rico",
    "QA": "Qatar",
    "RE": "Reunion",
    "RO": "Romania",
    "RU": "Russian Federation",
    "RW": "Rwanda",
    "BL": "Saint Barthelemy",
    "SH": "Saint Helena",
    "KN": "Saint Kitts And Nevis",
    "LC": "Saint Lucia",
    "MF": "Saint Martin",
    "PM": "Saint Pierre And Miquelon",
    "VC": "Saint Vincent And Grenadines",
    "WS": "Samoa",
    "SM": "San Marino",
    "ST": "Sao Tome And Principe",
    "SA": "Saudi Arabia",
    "SN": "Senegal",
    "RS": "Serbia",
    "SC": "Seychelles",
    "SL": "Sierra Leone",
    "SG": "Singapore",
    "SK": "Slovakia",
    "SI": "Slovenia",
    "SB": "Solomon Islands",
    "SO": "Somalia",
    "ZA": "South Africa",
    "GS": "South Georgia And Sandwich Isl.",
    "ES": "Spain",
    "LK": "Sri Lanka",
    "SD": "Sudan",
    "SR": "Suriname",
    "SJ": "Svalbard And Jan Mayen",
    "SZ": "Swaziland",
    "SE": "Sweden",
    "CH": "Switzerland",
    "SY": "Syrian Arab Republic",
    "TW": "Taiwan",
    "TJ": "Tajikistan",
    "TZ": "Tanzania",
    "TH": "Thailand",
    "TL": "Timor-Leste",
    "TG": "Togo",
    "TK": "Tokelau",
    "TO": "Tonga",
    "TT": "Trinidad And Tobago",
    "TN": "Tunisia",
    "TR": "Turkey",
    "TM": "Turkmenistan",
    "TC": "Turks And Caicos Islands",
    "TV": "Tuvalu",
    "UG": "Uganda",
    "UA": "Ukraine",
    "AE": "United Arab Emirates",
    "GB": "United Kingdom",
    "US": "United States",
    "UM": "United States Outlying Islands",
    "UY": "Uruguay",
    "UZ": "Uzbekistan",
    "VU": "Vanuatu",
    "VE": "Venezuela",
    "VN": "Vietnam",
    "VG": "Virgin Islands, British",
    "VI": "Virgin Islands, U.S.",
    "WF": "Wallis And Futuna",
    "EH": "Western Sahara",
    "YE": "Yemen",
    "ZM": "Zambia",
    "ZW": "Zimbabwe"
}


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
        country: string().required().default(undefined),
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
            countries,
            errors: [],
            tickets: [],
            promo: '',
            billing: {
                name: '',
                email: '',
                company: undefined,
                country: "",
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

Sentry.init({
    app,
    dsn: "https://623d5f87c6b14ea1ad82cba7afc5fb21@o4504854084255744.ingest.sentry.io/4504854087139328",
    tracesSampleRate: 1.0,
  });

app.config.globalProperties.$product = window.product
app.config.globalProperties.$ticketOptions = window.ticketOptions
app.config.globalProperties.$prices = window.prices
app.mount('#app')