
require('./index')(
	//[1, 2],
	//["totalHeapExecutableSize", "usedHeapSize"]
)

const express = require('express')
const app = express()

app.get('/', function (req, res) {
	var d = new Date();
	res.send('Hello World!')
})

app.listen(3000, function () {
	console.log('Example app listening on port 3000!')
})