
import CryptoJS from "crypto-js";
import { Image } from "react-bootstrap";

const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

export default class UtilityFunctions {

    static DBDateToStringDate(dbDate) {
        let splitStringDate = new Date(dbDate).toUTCString().split(' ')
        let splitTime = splitStringDate[4].split(':')
        let hhmm = splitTime[0] + ':' + splitTime[1]
        let stringDate = `${splitStringDate[0]} ${splitStringDate[1]} ${splitStringDate[2]} ${splitStringDate[3]} ${hhmm}`
        return stringDate
    }

    static CookieToJson(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    static Encrypt(string) {
        try {
            var encryptedText = CryptoJS.AES.encrypt(string, import.meta.env.SECRET_KEY).toString()
            return encryptedText
        }
        catch (error) {
            return error.message
        }

    }

    static Decrypt(string) {
        try {
            var bytes = CryptoJS.AES.decrypt(string, import.meta.env.SECRET_KEY);
            var decryptedText = bytes.toString(CryptoJS.enc.Utf8);
            return decryptedText
        }
        catch (error) {
            return error.message
        }

    }

    static CreditCardType(cc) {
        let amex = new RegExp('^3[47][0-9]{13}$')
        let visa = new RegExp('^4[0-9]{12}(?:[0-9]{3})?$')
        let mastercard = new RegExp('^5[1-5][0-9]{14}$')
        let mastercard2 = new RegExp('^2[2-7][0-9]{14}$')

        if (visa.test(cc)) {
            return <img src="https://cdn-icons-png.flaticon.com/512/349/349221.png" alt="visa" width="32px" height="32px" />
        }
        if (amex.test(cc)) {
            return <img src="https://cdn-icons-png.flaticon.com/512/349/349228.png" alt="amex" width="32px" height="32px" />

        }
        if (mastercard.test(cc) || mastercard2.test(cc)) {
            return <img src="https://icons.iconarchive.com/icons/designbolts/credit-card-payment/128/Master-Card-Blue-icon.png" alt="mastercard" width="32px" height="32px" />

        }

        return <img src="https://cdn-icons-png.flaticon.com/512/4822/4822716.png" alt="none" width="32px" height="32px" />
    }

    static RemoveNaN(input) {
        input = input.split("").filter(s => !isNaN(s)).join("")
        return input.replace(' ', '')
    }

    static RemoveNumber(input) {
        input = input.split("").filter(s => isNaN(s)).join("")
        return input
    }

    static getMonths() {
        return months
    }

    static IsValidExpiryDate(em, ey) {
        let today = new Date()
        let exp = new Date(`${em}-1-${ey}`)
        return exp > today
    }
}