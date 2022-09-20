const Upload = require("../Upload");
const path = require('path')

class ProductUpload extends Upload
{
          constructor() {
                    super()
                    this.destinationPath = path.resolve('./') + path.sep + 'public' + path.sep + 'uploads' + path.sep + 'product'
          }
}
module.exports = ProductUpload