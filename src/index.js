let addToy = false;
const toyTarget = 'http://localhost:3000/toys'
const toyContainer = document.getElementById('toy-collection')
const toyFormContainer = document.querySelector(".container");
const addBtn = document.querySelector("#new-toy-btn");
const toyForm = document.querySelector('form.add-toy-form')

document.addEventListener("DOMContentLoaded", () => {
	addBtn.addEventListener("click", () => {
		// hide & seek with the form
		addToy = !addToy;
		if (addToy) {
			toyFormContainer.style.display = "block";
			addBtn.innerText = "...or don't add a toy?"
		} else {
			addBtn.innerText = "Add a new toy!"
			toyFormContainer.style.display = "none";
		}
	});
	toyForm.addEventListener('submit', e => {
		e.preventDefault()
		handleForm(e)
	})
	getToys();
});

const handleForm = (e) => {
	addToy = !addToy
	addBtn.innerText = "Add a new toy!"
	e.target.parentElement.style = 'none'
	fetch(toyTarget, {
		method: 'POST',
		headers: {
			"Content-Type": "application/json",
  			Accept: "application/json"
		},
		body: JSON.stringify({
			name: e.target.name.value,
			image: e.target.image.value,
			likes: 0
		})
	}).then(resp => resp.json()).then(json => {
		renderToyCard(json)
	})//end of fetch
}

const createToyCard = () => {
	div = document.createElement('div')
	elements = ['h2', 'img', 'p', 'button']
	for (let i=0; i < elements.length; i++) {
		div.appendChild(document.createElement(elements[i]))
	}
	return div
}

const renderToyCard = (toy) => {
	div = createToyCard()
	div.id = toy.id
	div.className = "card"
	div.querySelector('h2').innerText = toy.name
	div.querySelector('img').src = toy.image
	div.querySelector('img').className = "toy-avatar"
	div.querySelector('p').innerText = `${toy.likes} ${toy.likes > 1 ? "likes" : "like"}`
	div.querySelector('button').className = 'like-btn'
	div.querySelector('button').innerText = 'Like <3'
	div.querySelector('button').addEventListener('click', () => increaseLikes(toy.id))
//begin addition of delete button
	deleteButton = document.createElement('button')
	deleteButton.className = 'delete-btn'
	deleteButton.innerText = 'destroy'
	deleteButton.addEventListener('click', e => {
		deleteToy(e)
	})
	div.appendChild(deleteButton)
//end of addition
	toyContainer.appendChild(div)

}

const deleteToy = (e) => {
	fetch(`${toyTarget}/${e.target.parentElement.id}`, {
		method: 'DELETE',
	}).then(r => r.json()).then(j => {
		document.getElementById(e.target.parentElement.id).remove()
	})
}

const increaseLikes = id => {
	div = document.getElementById(id)
	likes = div.querySelector('p').innerText.split(' ')
	if (likes[0] == 'null') likes[0] = 0
	fetch(`${toyTarget}/${id}`, {
		method: "PATCH",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			likes: parseInt(likes[0]) + 1
		})
	}).then(resp => resp.json()).then(json  => {
		likes[0] = json.likes
		likes[0] > 1 ? likes[1] = 'likes' : likes[1] = 'like'
		div.querySelector('p').innerText = likes.join(' ')
	})//end of fetch
}

const getToys = () => {
  fetch(toyTarget).then(r => r.json()).then(j => {
	j.forEach(toy => renderToyCard(toy))
  })
}
