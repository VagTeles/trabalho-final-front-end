let cards = document.getElementById("cardsContainer");
let paginas = document.getElementById("pagination");

window.onload = () => {
	createCards();
};
const url = "https://rickandmortyapi.com/api";
const api = axios.create({
	baseURL: url,
});

async function listCharacter(page) {
	const data = await api.get(`/character/?page=${page ? page : 1}`);
	return data;
}

function groupThePages(pages, group) {
	const groupPages = [];
	let qtd = group - 1;

	for (let i = 1; i <= pages; i += group) {
		let array = [];
		for (let j = i; j <= i + qtd; j++) {
			if (j === pages + 1) {
				break;
			}
			array.push(j);
		}

		groupPages.push(array);
	}
	return groupPages;
}

async function createCards(pages) {
	const data = await listCharacter(pages);
	console.log(data);

	cards.innerHTML = "";
	data.data.results.forEach((character, index) => {
		cards.innerHTML += `<div class="cards">

                        <img src="${character.image}" >

                        <div class="textCards">
                            <h2>${character.name}</h2>
                            <p class="pTextStatus">
							<p>${cardStatus(character.status)}-${character.species}</p>
							
                            <p class="pTitulo">Última localização:</p>

                            <p class="pText">${character.location.name}</p>
                        </div>
                </div>
				${index % 2 !== 0 && index !== 19 ? `<span class="divisor"></span>` : ""}`;
	});
}
function cardStatus(status) {
	switch (status) {
		case "Alive":
			return `<span class="alive"></span> Alive`;
		case "Dead":
			return `<span class="dead"></span> Dead`;
		default:
			return `<span class="desconhecido"></span> Unknown`;
	}
}

async function oneCharacters() {
	const search = document.getElementById("pesquisar");
	const filter = search.value.toLowerCase();
	cards.innerHTML = "";
	try {
		const data = await api.get(`/character/?name=${search.value}`);

		data.data.results.forEach((character, index) => {
			cards.innerHTML += `<div class="cards">

                        <img src="${character.image}" >

                        <div class="textCards">
                            <h2>${character.name}</h2>
                            <p class="pTextStatus">
							<p>${cardStatus(character.status)}-${character.species}</p>
							
                            <p class="pTitulo">Última localização:</p>

                            <p class="pText">${character.location.name}</p>
                        </div>
                </div>
				${index % 2 !== 0 && index !== 19 ? `<span class="divisor"></span>` : ""}`;
		});
	} catch (error) {
		cards.innerHTML = `Personagem não encontrado`;
	}
}
async function renderBtn() {
	let counter = 0;
	let page = await listCharacter();
	console.log(page);
	const arrayBtns = groupThePages(page.data.info.pages, 5);
	const btnBack = document.createElement("button");
	const btnForward = document.createElement("button");
	const btns = document.createElement("div");

	btnBack.classList.add("main-homepagination-controllerbtn");
	btnForward.classList.add("main-homepagination-controllerbtn");
	btns.classList.add("main-homepagination-controllerbtn");

	btnBack.innerText = "Anterior";
	btnForward.innerText = "Próximo";

	paginas.appendChild(btnBack);
	paginas.appendChild(btns);
	paginas.appendChild(btnForward);

	function createBtns(counter) {
		let array = [];
		for (let i = 0; i < arrayBtns[counter].length; i++) {
			const btn = document.createElement("button");

			btn.setAttribute("id", `${arrayBtns[counter][i]}`);
			btn.innerText = arrayBtns[counter][i];
			btn.classList.add("controller__btn--length");
			btns.appendChild(btn);
			array.push(btn);

			btn.addEventListener("click", (e) => {
				for (let i = 0; i < array.length; i++) {
					array[i].removeAttribute("disabled");
				}

				let btnCurrent = document.getElementById(`${e.target.id}`);

				btnCurrent.setAttribute("disabled", true);

				console.log(btnCurrent);
				createCards(arrayBtns[counter][i]);
				scroll(0, 0);
			});
		}

		return true;
	}

	createBtns(counter);
	btnBack.addEventListener("click", (e) => {
		console.log(counter);
		if (counter >= 1) {
			counter--;
		}

		btns.innerHTML = "";
		createBtns(counter);
	});

	btnForward.addEventListener("click", (e) => {
		console.log(counter);
		if (counter < arrayBtns.length - 1) {
			counter++;
		}

		btns.innerHTML = "";
		createBtns(counter);
	});
}
renderBtn();
