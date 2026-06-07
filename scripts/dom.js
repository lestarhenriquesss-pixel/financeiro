const DOM = {

    transactionsContainer:
        document.querySelector("#data-table tbody"),

    addTransaction(transaction) {
        const tr =
            document.createElement("tr")

        tr.innerHTML =
            DOM.innerHTMLTransaction(transaction)

        if (transaction.recurringGenerated) {
            tr.classList.add("recurring-generated")
        }

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction) {
        const CSSclass =
            Number(transaction.amount) > 0
                ? "income"
                : "expense"

        const amount =
            Utils.formatCurrency(
                Number(transaction.amount)
            )

        const recurrenceLabel =
            transaction.recurring || transaction.recurringGenerated
                ? "<small>Recorrente</small>"
                : ""

        return `
            <td onclick="UpdateTransactionModal.open('${transaction.sourceId || transaction.id}')">
                ${transaction.description}
                <br>
                <small>${transaction.category || ""}</small>
                <br>
                ${recurrenceLabel}
            </td>

            <td
                class="${CSSclass}"
                onclick="UpdateTransactionModal.open('${transaction.sourceId || transaction.id}')"
            >
                ${amount}
            </td>

            <td onclick="UpdateTransactionModal.open('${transaction.sourceId || transaction.id}')">
                ${transaction.date}
            </td>

            <td>
                <img
                    onclick="Transaction.remove('${transaction.sourceId || transaction.id}')"
                    src="./assets/minus.svg"
                    class="remove"
                >
            </td>
        `
    },

    updateBalance() {

        const month =
            Calendar.currentMonth

        const year =
            Calendar.currentYear

        const openingBalance =
            OpeningBalance.monthOpeningBalance(
                month,
                year
            )

        OpeningBalance.value =
            openingBalance

        const income =
            Transaction.incomes(
                month,
                year
            )

        const expense =
            Transaction.expenses(
                month,
                year
            )

        const totalMonth =
            openingBalance
            +
            income
            +
            expense

        const totalBalance =
            totalMonth

        const totalMonthCard =
            document.querySelector("#total-month-card")

        const totalBalanceCard =
            document.querySelector("#total-balance-card")

        if (totalMonthCard) {

            totalMonthCard.classList.remove(
                "positive",
                "negative"
            )

            totalMonthCard.classList.add(
                totalMonth >= 0
                    ? "positive"
                    : "negative"
            )

        }

        if (totalBalanceCard) {

            totalBalanceCard.classList.remove(
                "positive",
                "negative"
            )

            totalBalanceCard.classList.add(
                totalBalance >= 0
                    ? "positive"
                    : "negative"
            )

        }

        document.querySelector("#incomeDisplay").innerHTML =
            Utils.formatCurrency(income)

        document.querySelector("#expenseDisplay").innerHTML =
            Utils.formatCurrency(expense)

        document.querySelector("#totalMonthDisplay").innerHTML =
            Utils.formatCurrency(totalMonth)

        document.querySelector("#totalBalanceDisplay").innerHTML =
            Utils.formatCurrency(totalBalance)

        document.querySelector("#openingBalanceDisplay").innerHTML =
            Utils.formatCurrency(openingBalance)

    },

    updateCategoryDashboard() {

        const container =
            document.querySelector("#category-dashboard-list")

        if (!container) return

        const transactions =
            Transaction.filtered()

        const categories = {}

        transactions.forEach(transaction => {

            const category =
                transaction.category || "Sem categoria"

            if (!categories[category]) {
                categories[category] = 0
            }

            categories[category] +=
                Number(transaction.amount)

        })

        container.innerHTML = ""

        const categoryNames =
            Object.keys(categories)

        if (categoryNames.length === 0) {

            container.innerHTML = `
                <div class="category-dashboard-empty">
                    Nenhum lançamento neste mês
                </div>
            `

            return
        }

        categoryNames.forEach(category => {

            const total =
                categories[category]

            const type =
                total >= 0
                    ? "income"
                    : "expense"

            container.innerHTML += `
                <div class="category-dashboard-item ${type}">
                    <strong>${category}</strong>
                    <span>${Utils.formatCurrency(total)}</span>
                </div>
            `

        })

    },

   updateMonthVisualSummary() {

        const pieChart =
            document.querySelector("#month-pie-chart")

        if (!pieChart) return

        const month =
            Calendar.currentMonth

        const year =
            Calendar.currentYear

        const income =
            Math.abs(
                Transaction.incomes(
                    month,
                    year
                )
            )

        const expense =
            Math.abs(
                Transaction.expenses(
                    month,
                    year
                )
            )

        const total =
            income + expense

        if (total === 0) {

            pieChart.style.background =
                "#e5e5e5"

        } else {

            const incomePercent =
                (income / total) * 100

            pieChart.style.background =
                `
                    conic-gradient(
                        var(--normal-green) 0% ${incomePercent}%,
                        var(--normal-red) ${incomePercent}% 100%
                    )
                `

        }

        const shareDisplay =
            document.querySelector("#summary-share-per-member")

        const summaryShare =
            document.querySelector(".summary-share")

        if (shareDisplay && summaryShare) {

            summaryShare.classList.remove(
                "positive",
                "negative"
            )

            if (!window.Groups || !Groups.activeGroup) {

                shareDisplay.innerHTML =
                    "--"

                return

            }

            const totalBalance =
                Transaction.totalBalance()

            const members =
                Groups.getMemberCount()

            const share =
                totalBalance / members

            shareDisplay.innerHTML =
                Utils.formatCurrency(share)

            summaryShare.classList.add(
                share >= 0
                    ? "positive"
                    : "negative"
            )

        }

    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }

}

window.DOM = DOM