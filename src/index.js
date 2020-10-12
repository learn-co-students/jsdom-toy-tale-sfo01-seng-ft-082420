let addToy = false;

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
  }); //end of addBtn event listener
  getToys()
});
//Query selectors
let toyCollection = document.querySelector('#toy-collection')
let form = document.querySelector('form')
form.addEventListener('submit', (e)=> postToy(e))








//Fetch

function getToys() {
  fetch('http://localhost:3000/toys')
          .then(res => res.json())
          .then(data => {
            data.forEach(toy => buildCard(toy))
          })
}

function buildCard (toy) {
  let div = document.createElement('div')
  div.className = 'card'
  let h2 = document.createElement('h2')
  h2.innerHTML = `${toy.name}`
  let img = document.createElement('img')
  img.src = `${toy.image}`
  img.className = 'toy-avatar'
  let p = document.createElement('p')
  p.innerHTML = `${toy.likes}`
  let button = document.createElement('button')
  button.className = 'like-btn'
  button.innerText = '<3'
  

  div.appendChild(h2)
  div.appendChild(img)
  div.appendChild(p)
  button = div.appendChild(button)
  toyCollection.appendChild(div)

  button.addEventListener('click', (e) => likeBtn(e, toy)) 
  
}

function likeBtn(e, toy) {
  toy.likes = toy.likes++ 
  fetch(`http://localhost:3000/toys/${toy.id}`, {
  method: 'PATCH',
  headers:
  {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify(toy)
  

  })
  .then(res => res.json())
  .then(() => {
    console.log(e)
    e.target.parentElement.children[2].textContent = `${toy.likes++}`
    console.log(e.target.parentElement.children[2].textContent)

  })

}


function postToy(e) {
  e.preventDefault()
  console.log(e.target.name.value, e.target.image.value)
  let toy= {
    name: e.target.name.value,
    image: e.target.image.value,
    likes: 0
  }
  fetch('http://localhost:3000/toys',{
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
      },
      body: JSON.stringify(toy)
  })
      .then(res => res.json())
      .then(toy => {
    
      buildCard(toy)

      console.log(toy)
  
  })
    .catch(error => {
      console.error('Errors: ', error)

  })
}

  

