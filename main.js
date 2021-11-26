
const delay = 1000
const main = document.getElementsByTagName("main")[0]
main.scrollTop = 0
let readyToLoad = true

const sleep = (t) => {
  console.log("sleeping")
  return new Promise((resolve, reject) => {
    window.setTimeout(() => resolve(), t)
    console.log("done")
  })
}

const elem = (tagName, children) => {
  let out = document.createElement(tagName)
  if (children !== undefined) {
    for (var child of children) {
      if (!(child instanceof HTMLElement)) {
        child = elem(child)
      }
      out.appendChild(child)
    }
  }
  return out
}


const getThing = () => window.location.search.substring(1, 65)

class Queue {
  constructor() {
    this._queue = []
  }
  enqueue(item) {
    this._queue.push(item)
  }
  dequeue() {
    return this._queue.shift()
  }
  peek() {
    return this._queue.at(-1)
  }
  get length() {
    return this._queue.length;
  }
}
class AsyncQueue extends Queue {
  constructor(minBuffer) {
    super()
    this._minBuffer = minBuffer
  }
  enqueue(item) {
    this._queue.push(item)
  }
  dequeue() {
    return new Promise((resolve, reject) => {
      while (this.length < this._minBuffer) {
        this.enqueue(this.getNewItem())
      }
      console.log(super.dequeue)
      var elem = super.dequeue()
      elem.then(resolve)
    })

  }
}

class ImageQueue extends AsyncQueue {
  constructor(minBuffer, searchTerm) {
    super(minBuffer)
    this._searchTerm = searchTerm
  }
  async getNewItem() {
    let res = await fetch("https://source.unsplash.com/random/1600x900?" + this._searchTerm)
    let img = await res.blob()
    let bloburl = URL.createObjectURL(img)
    return bloburl
  }
}

const imageQueue = new ImageQueue(1, getThing())

const addNewSection = async () => {
  let section = elem("section", ["img"])
  main.appendChild(section)

  let blobUrl = await imageQueue.dequeue()
  section.querySelector("img").src = blobUrl
}

const addNewSections = async () => {
  await addNewSection()
  while (main.scrollTop >= (main.scrollHeight - window.innerHeight) - (window.innerHeight / 10)) {
    // await sleep(delay) // rate limiting lol
    await addNewSection()
  }
  // await sleep(delay)
  readyToLoad = true
}

const initPics = () => {
  readyToLoad = true
  main.textContent = '' // clear children
  main.addEventListener("scroll", (e) => {
    if (readyToLoad && main.scrollTop >= (main.scrollHeight - window.innerHeight) - (window.innerHeight / 2)) {
      readyToLoad = false
      addNewSections();
    }
  })
  addNewSections();
}


if (getThing() == "") {
  document.getElementsByTagName("input")[0].focus();
  document.getElementsByTagName("form")[0].addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(document.getElementsByTagName("input")[0].value);
    this.location.search = "?" + document.getElementsByTagName("input")[0].value
  })
} else {
  initPics()
}