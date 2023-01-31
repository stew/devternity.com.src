import $ from "cash-dom";

const TOGGLE = '.currencyToggle';
const toggleInputs = $(TOGGLE + ' input')

export class CurrencySwitcher {
    init() {
        $(toggleInputs).on('change', () => {
            console.log('Change triggered')
            const currency = $("input[name='currency']:checked").val();
            console.log('Current  currency is ' + currency)
            $('[data-pricing]').each((index, pricing) => {
                const pricingSection = $(pricing)
                if (pricingSection.attr('data-pricing') === currency) {
                    pricingSection.removeClass('hidden')
                } else {
                    pricingSection.addClass('hidden')
                }
            })
        })
    }
}


