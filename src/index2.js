let addToy = false;
const url = "http://localhost:3000/toys"
const toyCollection = document.querySelector('#toy-collection')
const addToyForm = document.querySelector('.add-toy-form')

addToyForm.addEventListener('submit', function(e) {
  e.preventDefault()
  postToy(e)
})



document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
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

function getToys() {
  fetch(url) 
  .then(res => res.json())
  .then(toys => toys.forEach(toy => buildCard(toy)))
}
getToys()

function postToy(toy) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type':'application/json'
    },
    body: JSON.stringify( {
      name: toy.target[0].value,
      image: toy.target[1].value,
      likes: "0"
    })
  })
  .then(res => res.json())
  .then(toy => buildCard(toy))
}


function buildCard(toy) {
  let div = document.createElement('div')
  let h2 = document.createElement('h2')
  let image = document.createElement('img')
  let p = document.createElement('p')
  let btn = document.createElement('button')
  let deleteBtn = document.createElement('button')
  deleteBtn.innerText = "Delete"
  div.className = "card"
  div.id = toy.id
  btn.className = "like-btn"
  image.className = "toy-avatar"
  image.src = toy.image 
  h2.innerText = toy.name
  p.innerText = toy.likes 
  btn.innerText = "Like <3"
  btn.addEventListener('click', () => handleBtn(toy))
  deleteBtn.addEventListener('click', () => deleteToy(toy, div))
  div.appendChild(h2)
  div.appendChild(image)
  div.appendChild(p)
  div.appendChild(btn)
  div.appendChild(deleteBtn)
  toyCollection.appendChild(div)
}

function handleBtn(toy) {
  // Grab the number from the DOM and just add one first
  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type':'application/json'
    },
    body: JSON.stringify( {
      likes: `${parseInt(toy.likes)+1}`
    })
  })
  .then(res => res.json())
  .then(toy => {
    // None of this would be needed
    document.getElementById(toy.id).querySelector('p').innerText = toy.likes
  })
}

function deleteToy(toy, div) {
  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type':'application/json'
    }
  })
  .then(res => res.json())
  .then(() => {
   div.remove()
   toyCollection = ''
   getToys(url)
  })
}