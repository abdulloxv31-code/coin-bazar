let cards = document.querySelector('#cards')
let filters = document.querySelector('#filters')
let searchInput = document.querySelector('#searchInput')
let searchBtn = document.querySelector('#searchBtn')

let data = []
let loading = true
let categories = []
let details = null

const categoryNames = {
  "smartphones": "Telefonlar",
  "laptops": "Noutbuklar",
  "fragrances": "Atirlar",
  "skincare": "Teri parvarishi",
  "groceries": "Oziq-ovqatlar",
  "home-decoration": "Uy bezaklari",
  "furniture": "Mebel",
  "tops": "Ko‘ylaklar",
  "womens-dresses": "Ayollar kiyimlari",
  "womens-shoes": "Ayollar oyoq kiyimlari",
  "mens-shirts": "Erkaklar ko‘ylaklari",
  "mens-shoes": "Erkaklar oyoq kiyimlari",
  "mens-watches": "Erkaklar soatlari",
  "womens-watches": "Ayollar soatlari",
  "womens-bags": "Ayollar sumkalari",
  "womens-jewellery": "Ayollar taqinchoqlari",
  "sunglasses": "Quyosh ko‘zoynaklari",
  "automotive": "Avtomobil jihozlari",
  "motorcycle": "Mototsikl buyumlari",
  "lighting": "Yoritish vositalari"
}

async function getProducts() {
  try {
    let request = await fetch('https://dummyjson.com/products')
    let response = await request.json()
    data = response.products
    categories = [...new Set(data.map(p => p.category))]
    createFilterButtons(categories)
  } catch (error) {
    console.log(error)
  } finally {
    loading = false
    createCards(data)
  }
}

function createFilterButtons(cats) {
  filters.innerHTML = ''
  let allBtn = document.createElement('button')
  allBtn.textContent = 'Barchasi'
  allBtn.className = 'btn btn-outline btn-accent'
  allBtn.onclick = () => createCards(data)
  filters.append(allBtn)

  cats.forEach(cat => {
    let uzName = categoryNames[cat] || cat
    let btn = document.createElement('button')
    btn.textContent = uzName
    btn.className = 'btn btn-outline'
    btn.onclick = () => {
      let filtered = data.filter(item => item.category === cat)
      createCards(filtered)
    }
    filters.append(btn)
  })
}

function createCards(items) {
  cards.innerHTML = ''
  if (loading) {
    cards.className = 'flex justify-center'
    cards.innerHTML = `<span class="loading loading-spinner loading-primary loading-xl"></span>`
  } else {
    cards.className = 'flex flex-wrap gap-5 justify-center'
    items.map(item => {
      let card = document.createElement('div')
      card.className = 'w-60 bg-base-300 rounded-xl shadow-md hover:scale-105 transition cursor-pointer'
      card.innerHTML = `
        <div>
          <img src="${item.images[0]}" class="w-full h-48 object-cover rounded-t-xl" alt="">
        </div>
        <div class="p-3">
          <p class="font-bold text-lg">${item.title}</p>
          <p class="text-sm text-gray-500">${categoryNames[item.category] || item.category}</p>
          <p class="mt-2 text-orange-500 font-semibold">${item.price}$</p>
        </div>
      `
      card.onclick = () => showDetails(item)
      cards.append(card)
    })
  }
}

function showDetails(item) {
  if (!details) {
    details = document.createElement('div')
    details.id = 'details'
    details.className = 'mt-10'
    cards.after(details)
  }
  let similar = data.filter(i => i.category === item.category && i.id !== item.id)
  details.innerHTML = `
    <div class="bg-base-200 rounded-xl p-6">
      <div class="flex flex-col lg:flex-row gap-6">
        <div class="w-full lg:w-1/3">
          <img src="${item.images[0]}" class="w-full h-72 object-cover rounded-xl" alt="">
        </div>
        <div class="w-full lg:w-2/3">
          <h2 class="text-2xl font-bold mb-2">${item.title}</h2>
          <p class="text-sm text-gray-500 mb-3">${categoryNames[item.category] || item.category}</p>
          <p class="mb-4">${item.description}</p>
          <p class="text-xl font-semibold text-orange-500 mb-4">${item.price}$</p>
          <button id="backBtn" class="btn btn-outline">Orqaga</button>
        </div>
      </div>
      <div class="mt-6">
        <h3 class="text-xl font-semibold mb-3">Shunga o‘xshash mahsulotlar</h3>
        <div id="similar" class="flex flex-wrap gap-4"></div>
      </div>
    </div>
  `
  let backBtn = document.getElementById('backBtn')
  backBtn.onclick = () => { details.innerHTML = '' }

  let similarContainer = document.getElementById('similar')
  similar.slice(0, 6).forEach(s => {
    let simCard = document.createElement('div')
    simCard.className = 'w-44 bg-base-300 rounded-lg p-2 cursor-pointer'
    simCard.innerHTML = `
      <img src="${s.images[0]}" class="w-full h-28 object-cover rounded-md" alt="">
      <p class="mt-2 text-sm font-semibold truncate">${s.title}</p>
      <p class="text-orange-500 font-bold">${s.price}$</p>
    `
    simCard.onclick = () => showDetails(s)
    similarContainer.append(simCard)
  })
  window.scrollTo({ top: details.offsetTop - 20, behavior: 'smooth' })
}

searchBtn.onclick = () => {
  let query = searchInput.value.toLowerCase()
  let filtered = data.filter(item =>
    item.title.toLowerCase().includes(query)
  )
  createCards(filtered)
}

getProducts()
