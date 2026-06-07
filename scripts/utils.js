const Utils = {

    formatAmount(value) {

        return Number(value)

    },

    formatCurrency(value) {

        const signal =
            Number(value) < 0
                ? "-"
                : ""

            value =
                Number(value || 0)

                .toFixed(2)

                .replace(".", ",")

        return `
            ${signal}
            R$ ${value}
        `
    },

    formatDate(date) {

        const splittedDate =
            date.split("-")

        return `
            ${splittedDate[2]}/
            ${splittedDate[1]}/
            ${splittedDate[0]}
        `.replace(/\s/g, "")

    },

    unFormatDate(date) {

        const splittedDate =
            date.split("/")

        return `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`

    }

}

window.Utils = Utils