const Upload = require("../Upload");
const path = require('path')

class PartenaireUpload extends Upload
{
          constructor() {
                    super()
                    this.destinationPath = path.resolve('./') + path.sep + 'public' + path.sep + 'uploads' + path.sep + 'partenaire'
          }
}
module.exports = PartenaireUpload