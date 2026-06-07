const Calendar = {

    months: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ],

    currentMonth: new Date().getMonth(),

    currentYear: new Date().getFullYear(),

    update() {

        document.querySelector("#current-month").innerHTML =
            Calendar.months[Calendar.currentMonth]

        document.querySelector("#year-calendar").innerHTML =
            Calendar.currentYear

        const previousMonth =
            Calendar.currentMonth === 0
                ? 11
                : Calendar.currentMonth - 1

        const nextMonth =
            Calendar.currentMonth === 11
                ? 0
                : Calendar.currentMonth + 1

        document.querySelector("#previous-month").innerHTML =
            Calendar.months[previousMonth]

        document.querySelector("#next-month").innerHTML =
            Calendar.months[nextMonth]

    },

    switchMonth(direction) {

        if (direction === "previous") {

            Calendar.currentMonth--

            if (Calendar.currentMonth < 0) {

                Calendar.currentMonth = 11

                Calendar.currentYear--

            }

        }

        if (direction === "next") {

            Calendar.currentMonth++

            if (Calendar.currentMonth > 11) {

                Calendar.currentMonth = 0

                Calendar.currentYear++

            }

        }

        OpeningBalance.calculate()
        App.render()

    }

}

window.Calendar = Calendar