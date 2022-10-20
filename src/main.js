import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

console.log(ccLogo)


function setCardType(type) {
    const colors = {
        visa: ["#2D57F2","#436D99"],
        mastercard: ["#C69347","#DF6F29"],
        amex: ["#2E77BB","#9BD4F5"],
        discover: ["#F58319","#CACCCD"],
        dinners: ["#004691","#FFFFFF"],
        default: ["black","gray"]
    }

    ccBgColor01.setAttribute("fill", colors[type][0])
    ccBgColor02.setAttribute("fill", colors[type][1])
    ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

// security code
const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
    mask: "000"
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

// expiration date
const expirationDate = document.querySelector('#expiration-date')
const expirationDatePattern = {
    mask: "MM{/}YY",
    blocks: {
        YY: {
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2),
        },
        MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12,
        },
    },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

// card number
const cardNumber = document.querySelector('#card-number')
const cardNumberPattern = {
    mask: [
        {
            mask: "0000 0000 0000 0000",
            regex: /^4\d{0,15}/,
            cardtype: "visa",
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardtype: "mastercard",
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /^3[4-7]\d{0,13}/,
            cardtype: "amex",
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /^(?:6011|65\d{0,2}64[4-9]\d?)\d{0,12}/,
            cardtype: "discover",
        },
        {
            mask: "0000 0000 0000 0000",
            cardtype: "default",
        },
    ],

    dispatch: function (appended, dynamicMasked) {
        const number = (dynamicMasked.value + appended).replace(/\D/g,"")
        const foundMask = dynamicMasked.compiledMasks.find(function (item) {
            return number.match(item.regex)
        })
        console.log(foundMask)

        return foundMask
    },
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButton = document.querySelector("#add-cart")
addButton.addEventListener("click", () => {
    alert("Cartão adicionado!")
})

document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
    const ccHolder = document.querySelector(".cc-holder .value")

    
    ccHolder.innerText = cardHolder.value.length === 0 ? "SEU NOME NO CARTÃO" : cardHolder.value
})

expirationDateMasked.on("accept", () => {
    updateExpirarionDate(expirationDateMasked.value)
}) 


function updateExpirarionDate(date) {
    const ccExpirationDate = document.querySelector(".cc-extra .value")
    ccExpirationDate.innerText = date.length === 0 ? "12/32" : date
}

securityCodeMasked.on("accept", () => {
    updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
    const ccSecurity = document.querySelector(".cc-security .value")

    ccSecurity.innerText = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept", () => {
    const cardType = cardNumberMasked.masked.currentMask.cardtype
    setCardType(cardType)
    updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
    const ccNumber = document.querySelector(".cc-info .cc-number")
    ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}