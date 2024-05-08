class Context {
  constructor() {
    this.that = ""
  }

  addTemplate = function(template) {
    if (!template.hasOwnProperty('name')) {
      throw new Error('"name" is required')
    }
    return true
  }
}

export default Context