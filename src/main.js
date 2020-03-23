const x = localStorage.getItem("x")
const xObject = JSON.parse(x)
const hashMap = xObject || []
let last = document.querySelector(".siteList li.last")

const simplifyUrl = url => {
  return url
    .replace("https://", "")
    .replace("http://", "")
    .replace("www.", "")
    .replace(/\/.*/, "") // 删除 / 开头的内容
}

let render = () => {
  document
    .querySelectorAll(".siteList li.newSite")
    .forEach(node => node.remove())
  hashMap.forEach((node, index) => {
    let newLi = document.createElement("li")
    newLi.classList.add("newSite")
    newLi.innerHTML = `
    <a href="${node.url}">
      <div class="site">
        <div class="logo">${node.logo}</div>
        <div class="link">${simplifyUrl(node.url)}</div>
        <button class="close">
          <svg class="icon">
            <use xlink:href="#icon-close1"></use>
          </svg>
        </button>
      </div>
    </a>
`
    last.parentNode.insertBefore(newLi, last)
    newLi.querySelector("a").addEventListener("click", event => {
      let close = event.target.closest(".close")
      if (!close) {
        return
      }
      let site = close.closest("li")
      site.remove()
      event.preventDefault()
      hashMap.splice(index, 1)
    })
  })
}

render()

document
  .querySelectorAll(".siteList a")
  .forEach(node => node.addEventListener("click", removeSite))

document.querySelector(".siteList li.last").addEventListener("click", addSite)

function removeSite() {
  let close = event.target.closest(".close")
  if (!close) {
    return
  }
  let site = close.closest("li")
  site.remove()
  event.preventDefault()
}

function addSite() {
  let url = window.prompt("请输入网址：")
  if (url.indexOf("http") !== 0) {
    url = "https://" + url
  }
  hashMap.push({
    logo: simplifyUrl(url)[0].toUpperCase(),
    url: url
  })
  render()
}

window.onbeforeunload = () => {
  const string = JSON.stringify(hashMap)
  localStorage.setItem("x", string)
}

document.addEventListener("keypress", e => {
  const { key } = e
  for (let i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key) {
      window.open(hashMap[i].url)
    }
  }
})
