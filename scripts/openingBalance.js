import {
    db
} from "./firebase.js"

import {
    auth
} from "./firebase.js"

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

const OpeningBalance = {

    value: 0,

    monthlyBalances: {},

    async load() {
        const user =
            auth.currentUser

        if (!user) return

        const docRef = doc(
            db,
            "users",
            user.uid
        )

        const docSnap =
            await getDoc(docRef)

        if (docSnap.exists()) {
            const data =
                docSnap.data()

            OpeningBalance.monthlyBalances =
                data.monthlyBalances || {}
        }

        OpeningBalance.calculate()
    },

    getMonthIndex(month, year) {
        return year * 12 + month
    },

    getPreviousMonth(month, year) {
        if (month === 0) {
            return {
                month: 11,
                year: year - 1
            }
        }

        return {
            month: month - 1,
            year
        }
    },

    getManualBalance(month, year) {
        const key =
            `${month + 1}-${year}`

        if (
            OpeningBalance.monthlyBalances[key] !== undefined
        ) {
            return Number(
                OpeningBalance.monthlyBalances[key]
            )
        }

        return null
    },

    getFirstRelevantIndex() {
        const indexes = []

        Object.keys(OpeningBalance.monthlyBalances)
            .forEach(key => {
                const [month, year] = key.split("-")

                indexes.push(
                    OpeningBalance.getMonthIndex(
                        Number(month) - 1,
                        Number(year)
                    )
                )
            })

        Transaction.all.forEach(transaction => {
            if (!transaction.date) return

            const parts =
                transaction.date.split("/")

            indexes.push(
                OpeningBalance.getMonthIndex(
                    Number(parts[1]) - 1,
                    Number(parts[2])
                )
            )
        })

        if (indexes.length === 0) return null

        return Math.min(...indexes)
    },

    monthOpeningBalance(month, year) {
        const manualBalance =
            OpeningBalance.getManualBalance(month, year)

        if (manualBalance !== null) {
            return manualBalance
        }

        const currentIndex =
            OpeningBalance.getMonthIndex(month, year)

        const firstRelevantIndex =
            OpeningBalance.getFirstRelevantIndex()

        if (
            firstRelevantIndex === null ||
            currentIndex < firstRelevantIndex
        ) {
            return 0
        }

        const previous =
            OpeningBalance.getPreviousMonth(month, year)

        const previousOpening =
            OpeningBalance.monthOpeningBalance(
                previous.month,
                previous.year
            )

        const previousIncomes =
            Transaction.incomes(
                previous.month,
                previous.year
            )

        const previousExpenses =
            Transaction.expenses(
                previous.month,
                previous.year
            )

        return (
            previousOpening +
            previousIncomes +
            previousExpenses
        )
    },

    calculate() {
        OpeningBalance.value =
            OpeningBalance.monthOpeningBalance(
                Calendar.currentMonth,
                Calendar.currentYear
            )
    },

    async save(value) {
        const user =
            auth.currentUser

        if (!user) return

        const month =
            Calendar.currentMonth

        const year =
            Calendar.currentYear

        const key =
            `${month + 1}-${year}`

        OpeningBalance.monthlyBalances[key] =
            Number(value)

        await setDoc(
            doc(
                db,
                "users",
                user.uid
            ),
            {
                monthlyBalances:
                    OpeningBalance.monthlyBalances
            },
            {
                merge: true
            }
        )

        OpeningBalance.calculate()

        App.render()

        OpeningBalanceModal.close()
    }

}

window.OpeningBalance = OpeningBalance

export {
    OpeningBalance
}