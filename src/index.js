let addToy = false;
const toyTarget = 'http://localhost:3000/toys'
const toyContainer = document.getElementById('toy-collection')
const toyFormContainer = document.querySelector(".container");
const addBtn = document.querySelector("#new-toy-btn");
const toyForm = document.querySelector('form.add-toy-form')

const modal = document.getElementById("myModal");
const btn = document.getElementById("myBtn");
const span = document.getElementsByClassName("close")[0];

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
		submitForm(e)
	})
	getToys();
});

const submitForm = (e) => {
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
	div.querySelector('p').innerText = `${likeContent(toy.likes)}`
	div.querySelector('button').className = 'like-btn'
	div.querySelector('button').innerText = 'Like <3'
	div.querySelector('button').addEventListener('click', () => increaseLikes(toy.id))
//begin addition of container for edit & delete buttons
	buttonContainer = document.createElement('div')
//end of addition
//begin addition of delete button
	deleteButton = document.createElement('button')
	deleteButton.className = 'delete-btn'
	deleteButton.innerText = 'destroy'
	deleteButton.addEventListener('click', e => deleteToy(e))
	buttonContainer.appendChild(deleteButton)
//end of addition
//begin addition of edit button
	editButton = document.createElement('button')
	editButton.className = 'edit-btn'
	editButton.innerText = 'edit'
	editButton.addEventListener('click', e => editToy(e))
	buttonContainer.appendChild(editButton)
//end of addition
	div.appendChild(buttonContainer)
	toyContainer.appendChild(div)

}

const editToy = e => {
	id = e.target.parentElement.parentElement.id
	modal.style.display = "block";
	span.onclick = () => modal.style.display = "none"
	window.onclick = e => {if (e.target == modal) modal.style.display = "none"}
	form = document.getElementById('editForm')
	form.addEventListener('submit', e => {
		e.preventDefault()
		fetch(`${toyTarget}/${id}`, {
			method: 'PATCH',
			headers: {
				"Content-Type": "application/json",
				  Accept: "application/json"
			},
			body: JSON.stringify({
				name: e.target.name.value,
				image: e.target.image.value
			})
		}).then(r => r.json()).then(j => {
			card = document.getElementById(id)
			card.querySelector('h2').innerText = j.name
			card.querySelector('img').src = j.image
			likes = card.querySelector('p').innerText.split(' ')
			likes[0] = j.likes
			card.querySelector('p').innerText = likes.join(' ')
		})
		modal.style.display = "none";
	})
}

const deleteToy = (e) => {
	fetch(`${toyTarget}/${e.target.parentElement.parentElement.id}`, {
		method: 'DELETE',
	}).then(() => {
		document.getElementById(e.target.parentElement.parentElement.id).remove()
	})
}

const likeContent = (likes) => {
	if (likes == 0) {
		return 'No one likes this toy.'
	} else if (likes > 1) {
		return `${likes} likes`
	} else {
		return `${likes} like`
	}
}

const increaseLikes = id => {
	div = document.getElementById(id)
	likes = div.querySelector('p').innerText.split(' ')
	if (likes[0] == "No") {
		likes = []
		likes[0] = 0
		likes[1] = "like"
	}
	if (likes[0] == 'null') likes[0] = 0
	fetch(`${toyTarget}/${id}`, {
		method: "PATCH",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			likes: parseInt(likes[0]) + 1
		})
	}).then(resp => resp.json()).then(j  => {
		div.querySelector('p').innerText = likeContent(j.likes == 'null' ? 0 : j.likes)
	})
}

const getToys = () => {
  fetch(toyTarget).then(r => r.json()).then(j => {
	j.forEach(toy => renderToyCard(toy))
  })
}
