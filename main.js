
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
const getThing = () => window.location.search.substring(1, 65)

const getUrl = async () => {
  let res = await fetch("https://source.unsplash.com/random/1600x900?" + getThing())
  // console.log(res)
  let img = await res.blob()
  let bloburl = URL.createObjectURL(img)
  return bloburl
}
const addNewSection = async () => {
  let section = document.createElement("section")
  let img = document.createElement("img")
  // img.src = "https://source.unsplash.com/random/1600x900?Dog"
  let bloburl = await getUrl()
  img.src = bloburl
  section.appendChild(img)
  main.appendChild(section)
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