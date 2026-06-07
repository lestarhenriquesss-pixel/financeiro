const Storage = {
getTransactions() {
return JSON.parse(
localStorage.getItem("dev.finances:transactions")
) || []
},

setTransactions(transactions) {
    localStorage.setItem(
        "dev.finances:transactions",
        JSON.stringify(transactions)
    )
}


}
