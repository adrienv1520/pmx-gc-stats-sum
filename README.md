pmx-gc-stats-sum
================

gc stats sums by gc type through pm2/pmx

Test
----
```
npm i pm2 -g
npm install
pm2 start -i max example.js
pm2 monit
```

Usage
-----
```javascript
require('pmx-gc-stats-sum')()
or
require('pmx-gc-stats-sum')(
	{ 
		gcTypes: [1, 2],
		gcDiffProps: [
			"totalHeapExecutableSize",
			"usedHeapSize"
		]
	}
)
// your app here
```