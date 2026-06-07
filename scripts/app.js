import {
    auth
} from "./firebase.js"

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"

import {
    Transaction
} from "./transactions.js"

import {
    OpeningBalance
} from "./openingBalance.js"

import {
    Profile
} from "./profile.js"

import {
    Groups
} from "./groups.js"

const App = {

    async init() {

        try {
            await Profile.load()
        } catch(error) {
            console.error("Erro no Profile.load:", error)
        }

        try {
            await Groups.loadActiveGroup()
        } catch(error) {
            console.error("Erro no Groups.loadActiveGroup:", error)

            Groups.activeGroup = null

            localStorage.removeItem(
                "controle.financeiro:activeGroupId"
            )
        }

        try {
            await Transaction.load()
        } catch(error) {
            console.error("Erro no Transaction.load:", error)
        }

        try {
            await OpeningBalance.load()
        } catch(error) {
            console.error("Erro no OpeningBalance.load:", error)
        }

        App.render()

    },

    render() {

        Calendar.update()

        DOM.clearTransactions()

        Transaction.filtered().forEach(transaction => {
            DOM.addTransaction(transaction)
        })

        DOM.updateBalance()

        DOM.updateCategoryDashboard()

        DOM.updateMonthVisualSummary()

    }

}

window.App = App

onAuthStateChanged(auth, async (user) => {

    if (!user) return

    await App.init()

})