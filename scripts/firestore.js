import {
    db
} from "./firebase.js"

import {
    auth
} from "./firebase.js"

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

const Firestore = {

    getTransactionsCollection() {

        const user =
            auth.currentUser

        if (!user) return null

        if (window.Groups && Groups.activeGroup) {

            return collection(
                db,
                "groups",
                Groups.activeGroup.id,
                "transactions"
            )

        }

        return collection(
            db,
            "users",
            user.uid,
            "transactions"
        )

    },

    getTransactionDoc(id) {

        const user =
            auth.currentUser

        if (!user) return null

        if (window.Groups && Groups.activeGroup) {

            return doc(
                db,
                "groups",
                Groups.activeGroup.id,
                "transactions",
                id
            )

        }

        return doc(
            db,
            "users",
            user.uid,
            "transactions",
            id
        )

    },

    async addTransaction(transaction) {

        const transactionsRef =
            Firestore.getTransactionsCollection()

        if (!transactionsRef) return

        await addDoc(
            transactionsRef,
            transaction
        )

    },

    async getTransactions() {

        const transactionsRef =
            Firestore.getTransactionsCollection()

        if (!transactionsRef) return []

        const querySnapshot =
            await getDocs(transactionsRef)

        const transactions = []

        querySnapshot.forEach(doc => {

            transactions.push({
                id: doc.id,
                ...doc.data()
            })

        })

        return transactions

    },

    async removeTransaction(id) {

        const transactionRef =
            Firestore.getTransactionDoc(id)

        if (!transactionRef) return

        await deleteDoc(transactionRef)

    },

    async updateTransaction(id, transaction) {

        const transactionRef =
            Firestore.getTransactionDoc(id)

        if (!transactionRef) return

        await updateDoc(
            transactionRef,
            transaction
        )

    }

}

export {
    Firestore
}