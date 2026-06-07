const Form = {

    description:
        document.querySelector("#description"),

    amount:
        document.querySelector("#amount"),

    date:
        document.querySelector("#date"),

    category:
        document.querySelector("#category"),

    getValues() {

        return {
            description:
                document.querySelector("#description").value,

            amount:
                document.querySelector("#amount").value,

            category:
                document.querySelector("#category").value,

            date:
                document.querySelector("#date").value,

            recurring:
                document.querySelector("#recurring").checked
        }

    },

    validateFields() {

        const {
            description,
            amount,
            date,
            category
        } = Form.getValues()

        if (
            description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "" ||
            category.trim() === ""
        ) {

            throw new Error(
                "Preencha todos os campos"
            )

        }

    },

    formatValues() {

        let {
            description,
            amount,
            category,
            date,
            recurring
        } = Form.getValues()

        amount =
            Utils.formatAmount(amount)

        date =
            Utils.formatDate(date)

        return {
            description,
            amount,
            category,
            date,
            recurring
        }

    },

    clearFields() {

        document.querySelector(
            "#description"
        ).value = ""

        document.querySelector(
            "#amount"
        ).value = ""

        document.querySelector(
            "#category"
        ).value = ""

        document.querySelector(
            "#date"
        ).value = ""

        document.querySelector(
            "#recurring"
        ).checked = false

    },

    async submit(event) {

        event.preventDefault()

        try {

            Form.validateFields()

            const transaction =
                Form.formatValues()

            await Transaction.add(
                transaction
            )

            Form.clearFields()

            CreateTransactionModal.close()

        } catch(error) {

            alert(error.message)

        }

    },
    

}

window.Form = Form

const UpdateTransactionForm = {

    getValues() {

        return {
            description:
                document.querySelector("#update-description").value,

            amount:
                document.querySelector("#update-amount").value,

            category:
                document.querySelector("#update-category").value,

            date:
                document.querySelector("#update-date").value,

            recurring:
                document.querySelector("#update-recurring").checked
        }

    },

    validateFields() {

        const {
            description,
            amount,
            category,
            date
        } = UpdateTransactionForm.getValues()

        if (
            description.trim() === "" ||
            amount.trim() === "" ||
            category.trim() === "" ||
            date.trim() === ""
        ) {

            throw new Error(
                "Preencha todos os campos"
            )

        }

    },

    formatValues() {

        let {
            description,
            amount,
            category,
            date,
            recurring
        } = UpdateTransactionForm.getValues()

        amount =
            Utils.formatAmount(amount)

        date =
            Utils.formatDate(date)

        return {
            description,
            amount,
            category,
            date,
            recurring
        }

    },

    async submit(event) {

        event.preventDefault()

        try {

            UpdateTransactionForm.validateFields()

            const id =
                document
                    .querySelector("#update-transaction-form")
                    .getAttribute("data-transaction-id")

            const transaction =
                UpdateTransactionForm.formatValues()

            await Transaction.update(
                id,
                transaction
            )

            UpdateTransactionModal.close()

        } catch(error) {

            alert(error.message)

        }

    }

}

window.UpdateTransactionForm =
    UpdateTransactionForm

const CreateCategoryForm = {

    input:
        document.querySelector("#create-category"),

    submit(event) {

        event.preventDefault()

        const category =
            CreateCategoryForm.input.value

        Categories.add(
            category
        )

        CreateCategoryForm.input.value = ""

        CategoryModal.close()

    }

}

window.CreateCategoryForm =
    CreateCategoryForm