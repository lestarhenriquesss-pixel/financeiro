const Categories = {

    storageKey:
        "controle.financeiro:categories",

    defaultCategories: [
        "Casa",
        "Lazer",
        "Comida",
        "Transporte",
        "Trabalho"
    ],

    all: [],

    load() {

        const savedCategories =
            localStorage.getItem(
                Categories.storageKey
            )

        if (savedCategories) {

            Categories.all =
                JSON.parse(savedCategories)

        } else {

            Categories.all =
                Categories.defaultCategories

            Categories.save()

        }

        Categories.render()

    },

    save() {

        localStorage.setItem(
            Categories.storageKey,
            JSON.stringify(
                Categories.all
            )
        )

    },

    add(category) {

        const normalizedCategory =
            category.trim()

        if (!normalizedCategory) {
            alert("Informe uma categoria.")
            return
        }

        const alreadyExists =
            Categories.all.some(item => {
                return item.toLowerCase() ===
                    normalizedCategory.toLowerCase()
            })

        if (alreadyExists) {
            alert("Essa categoria já existe.")
            return
        }

        Categories.all.push(
            normalizedCategory
        )

        Categories.save()

        Categories.render()

    },

    render() {

        const selects = [
            document.querySelector("#category"),
            document.querySelector("#update-category")
        ]

        selects.forEach(select => {

            if (!select) return

            select.innerHTML = `
                <option value="">
                    Categoria
                </option>
            `

            Categories.all.forEach(category => {

                select.innerHTML += `
                    <option value="${category}">
                        ${category}
                    </option>
                `

            })

        })

    }

}

window.Categories = Categories

Categories.load()