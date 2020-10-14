let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.querySelector("#new-toy-btn");
    const toyFormContainer = document.querySelector(".container");
    const toyCollection = document.querySelector('#toy-collection')
    const form = document.querySelector('.add-toy-form')

    form.addEventListener('submit', (e) => handleFormSubmit(e))

    function handleFormSubmit(e) {
        e.preventDefault()
        let toy = {
            name: e.target.name.value,
            image: e.target.image.value,
            likes: 0
        }
        postToy(toy);
    }

    // Fetch
    function fetchToys() {
        fetch('http://localhost:3000/toys')
            .then(res => res.json())
            .then(toys => toys.forEach(toy => buildToy(toy)))
    }
    fetchToys()

    function postToy(toy) {
        fetch('http://localhost:3000/toys'), {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(toy)

        }
    }

    // DOM Events
    function buildToy(toy) {
        let div = document.createElement('div')
        let btn = document.createElement('button')

        div.id = toy.id
        div.className = 'card'
        div.innerHTML =
            `
              <h2>${toy.name}</h2>
              <img src=${toy.image} class="toy-avatar" />
              <p>${toy.likes} Likes </p>
            `

        btn.textContent = 'Like <3'
        btn.className = 'like-btn'
        btn.addEventListener('click', () => updateLikes(toy))

        div.appendChild(btn)
        toyCollection.appendChild(div)
    }

    function updateLikes(toy) {
        toy.likes++
            fetch(`http://localhost:3000/toys/${toy.id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(toy)
            })
            .then(res => res.json())
            .then(updatedToy => {
                let oldToy = document.getElementById(toy.id)
                let btn = document.createElement('button')
                oldToy.innerHTML =
                    `
                <h2>${updatedToy.name}</h2>
                <img src=${updatedToy.image} class="toy-avatar" />
                <p>${updatedToy.likes} Likes </p>
                `
                btn.textContent = 'Like <3'
                btn.className = 'like-btn'
                btn.addEventListener('click', () => updateLikes(toy))

                oldToy.appendChild(btn)
            })
    }


    addBtn.addEventListener("click", () => {
        // hide & seek with the form
        addToy = !addToy;
        if (addToy) {
            toyFormContainer.style.display = "block";
        } else {
            toyFormContainer.style.display = "none";
        }
    });
});