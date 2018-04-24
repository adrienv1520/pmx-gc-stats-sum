var probe = require('pmx').probe();
var gc = (require('gc-stats'))();

module.exports = function(options) {

	if (!options)
		options = {};

	var dfltGcDiffProps = [
		"totalHeapSize",
		"totalHeapExecutableSize",
		"usedHeapSize",
		"heapSizeLimit",
		"totalPhysicalSize",
		"totalAvailableSize",
		"mallocedMemory",
		"peakMallocedMemory"
	]
	var dfltGcTypes = [ 
		1, 
		2, 
		4, 
		8, 
		15 
	];

	var dfltProbeNameFn = function (gcType, gcProp) {
		return "Gc Type " + gcType  + " Sum " + gcProp.replace(/([A-Z])/g, ' $1').replace(/^ /, '').replace(/ $/, '');
	};

	var probeSumFn = function (probeNameFn, gcType, gcProp, unit) {
		var name = probeNameFn.apply(null, [ gcType, gcProp ]);
		return probe.histogram({
  			name : name,
  			unit : unit,
  			measurement : 'sum'
		});
	};

	var probesByType = {};
	for (var i = 0; i < dfltGcTypes.length; i++) {
		var gcType = dfltGcTypes[i];
		if (typeof options.gcTypes != 'undefined' && 
			options.gcTypes instanceof Array && 
			options.gcTypes.indexOf(gcType) == -1)
	  		continue; // exclude this gcType
	  	probesByType[gcType] = { 
	  		count: probeSumFn(dfltProbeNameFn, gcType, "", ""), 
	  		pause: probeSumFn(dfltProbeNameFn, gcType, "Pause", "ns"), 
	    	diff: {}
	  	};
		for (var j = 0; j < dfltGcDiffProps.length; j++) {
			var gcDiffProp = dfltGcDiffProps[j];
			if (typeof options.gcDiffProps != 'undefined' && 
				options.gcDiffProps instanceof Array && 
				options.gcDiffProps.indexOf(gcDiffProp) == -1)
				continue; // exclude this gcDiffProp 
			probesByType[gcType].diff[gcDiffProp] = probeSumFn(dfltProbeNameFn, gcType, "Diff" + gcDiffProp.replace(/^./, function(s){ return s.toUpperCase(); }), "B");
		}
	}

	gc.on('stats', function (stats) {
		if (stats) {
			probes = probesByType[stats.gctype];
			if (probes) {
				probes.count.update(1);
				probes.pause.update(stats.pause);
				if (stats.diff)
					for (var key in probes.diff) {
						var val = stats.diff[key]
						if (typeof val != 'undefined')
							probes.diff[key].update(val);
					}
			}
		}
	});
};