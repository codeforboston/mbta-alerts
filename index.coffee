request = require 'request'
config = require './config'
params = 
	qs:
		api_key:config.key
	url : 'http://realtime.mbta.com/developer/api/v1/alerts'
	json:true
module.exports = ()->
	request params, (e,r,b)->
		alerts = b.alerts.forEach (v)->
			v['_id']=v['alert_id'].toString()
			nParams = 
				url:"http://calvin.iriscouch.com/mbta/#{v._id}"
				json:true
			request nParams,(e,r,b)->
				if r.statusCode == 200
					v._rev=b.rev
				else
					console.log v.header_text
				nParams.body=v
				nParams.method='put'
				request nParams,()->true
				true
			true
		true
		

