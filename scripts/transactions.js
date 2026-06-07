import {
    Firestore
} from "./firestore.js"

const Transaction = {

    all: [],

    async load() {
        Transaction.all =
            await Firestore.getTransactions()
    },

    async add(transaction) {
        transaction.amount =
            Number(transaction.amount)

        transaction.recurring =
            transaction.recurring === true ||
            transaction.recurring === "true"

        await Firestore.addTransaction(transaction)

        await Transaction.load()

        App.render()

    },

    async remove(id) {
        await Firestore.removeTransaction(id)

        await Transaction.load()

        App.render()
    },

    getMonthIndex(month, year) {
        return year * 12 + month
    },

    getTransactionDateData(transaction) {
        const parts = transaction.date.split("/")

        return {
            day: parts[0],
            month: Number(parts[1]) - 1,
            year: Number(parts[2])
        }
    },

    isRecurring(transaction) {
        return (
            transaction.recurring === true ||
            transaction.recurring === "true"
        )
    },

    monthTransactions(month, year) {
        const result = []

        const currentIndex =
            Transaction.getMonthIndex(month, year)

        Transaction.all.forEach(transaction => {
            if (!transaction.date) return

            const {
                day,
                month: originalMonth,
                year: originalYear
            } = Transaction.getTransactionDateData(transaction)

            const originalIndex =
                Transaction.getMonthIndex(
                    originalMonth,
                    originalYear
                )

            const isOriginalMonth =
                originalMonth === month &&
                originalYear === year

            if (isOriginalMonth) {
                result.push(transaction)
                return
            }

            if (!Transaction.isRecurring(transaction)) return

            const isFutureMonth =
                currentIndex > originalIndex

            if (!isFutureMonth) return

            result.push({
                ...transaction,
                id: transaction.id,
                sourceId: transaction.id,
                recurringGenerated: true,
                date: `${day}/${String(month + 1).padStart(2, "0")}/${year}`
            })
        })

        return result
    },

    filtered() {
        return Transaction.monthTransactions(
            Calendar.currentMonth,
            Calendar.currentYear
        )
    },

    incomes(month = Calendar.currentMonth, year = Calendar.currentYear) {
        return Transaction
            .monthTransactions(month, year)
            .filter(transaction => Number(transaction.amount) > 0)
            .reduce((total, transaction) => {
                return total + Number(transaction.amount)
            }, 0)
    },

    expenses(month = Calendar.currentMonth, year = Calendar.currentYear) {
        return Transaction
            .monthTransactions(month, year)
            .filter(transaction => Number(transaction.amount) < 0)
            .reduce((total, transaction) => {
                return total + Number(transaction.amount)
            }, 0)
    },

    totalMonth(month = Calendar.currentMonth, year = Calendar.currentYear) {
        const opening =
            OpeningBalance.monthOpeningBalance(month, year)

        return (
            opening +
            Transaction.incomes(month, year) +
            Transaction.expenses(month, year)
        )
    },

    totalBalance() {
        return Transaction.totalMonth(
            Calendar.currentMonth,
            Calendar.currentYear
        )
    },

    findById(id) {

        return Transaction.all.find(transaction => {

            return transaction.id === id

        })

    },

    async update(id, transaction) {

        transaction.amount =
            Number(transaction.amount)

        transaction.recurring =
            transaction.recurring === true ||
            transaction.recurring === "true"

        await Firestore.updateTransaction(
            id,
            transaction
        )

        await Transaction.load()

        App.render()

    },

}

window.Transaction = Transaction

export {
    Transaction
}