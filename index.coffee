request = require 'request'
twitter = require 'simple-twitter'
config = require './config'
t = new twitter(config.twitter.consumerKey,config.twitter.consumerSecret,config.twitter.token,config.twitter.tokenSecret)
params = 
	qs:
		api_key:config.key
	url : 'http://realtime.mbta.com/developer/api/v1/alerts'
	json:true

dcb = (err,resp)->
	console.log([err,resp])

tweet = (msg,cb=dcb)->
	if msg.length > 140
		msg = msg.slice 0,140
	t.post('statuses/update',{status:msg},cb)

i = 0

start = ()->
	console.log 'running it time ', ++i
	request params, (e,r,b)->
		alerts = b.alerts.forEach (v)->
			v['_id']=v['alert_id'].toString()
			nParams = 
				url:"http://calvin.iriscouch.com/mbta/#{v._id}"
				json:true
			request nParams,(e,r,b)->
				if r.statusCode == 200
					v._rev=b._rev
					nParams.method='put'
				else
					console.log 'tweeting ',v.header_text 
					tweet v.header_text
					nParams.method='post'
					nParams.url = "http://calvin.iriscouch.com/mbta"
				nParams.body=v
				request nParams,(e,r,b)->
					true
				true
			true
		true
	true

timer = undefined

exports.start = start

exports.tweet = tweet

exports.startup = ()->
	start()
	timer=setInterval(start,60000)

exports.stopit = ()->
	clearTimeout timer

