const MenuButton = {

    toggle() {
        document
            .querySelector(".add-transaction-button")
            .classList
            .contains("active")
            ? MenuButton.close()
            : MenuButton.open()
    },

    open() {
        document
            .querySelector(".add-transaction-button")
            .classList
            .add("active")

        document
            .querySelector(".add-category-button")
            .classList
            .add("active")

        document
            .querySelector(".profile-button")
            .classList
            .add("active")

        document
            .querySelector(".logout-button")
            .classList
            .add("active")

        document
            .querySelector(".group-button")
            .classList
            .add("active")
    },

    close() {
        document
            .querySelector(".add-transaction-button")
            .classList
            .remove("active")

        document
            .querySelector(".add-category-button")
            .classList
            .remove("active")

        document
            .querySelector(".profile-button")
            .classList
            .remove("active")

        document
            .querySelector(".logout-button")
            .classList
            .remove("active")

        document
            .querySelector(".group-button")
            .classList
            .remove("active")
    }

}

const CreateTransactionModal = {
    open() {
        document
            .querySelector("#create-transaction-modal")
            .classList
            .add("active")
    },

    close() {
        document
            .querySelector("#create-transaction-modal")
            .classList
            .remove("active")
    }
}

const UpdateTransactionModal = {

    open(id) {

        const transaction =
            Transaction.findById(id)

        if (!transaction) return

        document
            .querySelector("#update-transaction-modal")
            .classList
            .add("active")

        document
            .querySelector("#update-transaction-form")
            .setAttribute(
                "data-transaction-id",
                id
            )

        document.querySelector("#update-description").value =
            transaction.description

        document.querySelector("#update-amount").value =
            transaction.amount

        document.querySelector("#update-category").value =
            transaction.category

        document.querySelector("#update-date").value =
            Utils.unFormatDate(transaction.date)

        document.querySelector("#update-recurring").checked =
            transaction.recurring === true ||
            transaction.recurring === "true"

    },

    close() {

        document
            .querySelector("#update-transaction-modal")
            .classList
            .remove("active")

    }

}

window.UpdateTransactionModal =
    UpdateTransactionModal

const OpeningBalanceModal = {
    open() {
        document
            .querySelector("#opening-balance-modal")
            .classList
            .add("active")
    },

    close() {
        document
            .querySelector("#opening-balance-modal")
            .classList
            .remove("active")
    }
}

const CategoryModal = {
    open() {
        document
            .querySelector("#category-modal")
            .classList
            .add("active")
    },

    close() {
        document
            .querySelector("#category-modal")
            .classList
            .remove("active")
    }
}

const ProfileModal = {

    open() {
        document
            .querySelector("#profile-modal")
            .classList
            .add("active")

        Profile.render()
    },

    close() {
        document
            .querySelector("#profile-modal")
            .classList
            .remove("active")
    }

}

window.ProfileModal = ProfileModal

const GroupModal = {

    open() {
        document
            .querySelector("#group-modal")
            .classList
            .add("active")

        Groups.fillGroupForm()
    },

    close() {
        document
            .querySelector("#group-modal")
            .classList
            .remove("active")
    }

}

window.GroupModal = GroupModal