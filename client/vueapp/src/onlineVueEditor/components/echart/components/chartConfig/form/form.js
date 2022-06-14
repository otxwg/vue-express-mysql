const requireComponent = require.context('./', true, /\w+\.vue$/) //遍历当前目录和子目录

let comps = {}

requireComponent.keys().map((fileName) => {
  let comp = requireComponent(fileName).default
  let cname = comp.name.charAt(0).toUpperCase() + comp.name.slice(1)
  comps[`Echart${cname}`] = comp
})

export default comps
