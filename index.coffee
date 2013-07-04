request = require 'request'
Twitter = require 'simple-twitter'
config = require './config'
twitter = new Twitter(config.twitter.consumerKey,config.twitter.consumerSecret,config.twitter.token,config.twitter.tokenSecret)
params = 
	qs:
		api_key:config.key
	url : 'http://realtime.mbta.com/developer/api/v1/alerts'
	json:true

dcb = (err)->
	console.log(err)

cleanForTweet=(msg)->
	if msg.length > 132
		msg = msg.slice(0,132)+'...'
	msg = msg+' #mbta'
	msg.replace /\b\w+?\b Line/g,(a)->
		'#'+a.replace(/\ /,"")
	
tweet = (msg,cb=dcb)->
	twitter.post('statuses/update',{status:cleanForTweet(msg)},cb)

i = 0
eachAlert = (v)->
	v['_id']=v['alert_id'].toString()
	nParams = 
		url:"https://#{config.couch.user}:#{config.couch.pw}@#{config.couch.server}/#{config.couch.db}/#{v._id}"
		json:true
	request nParams,(e,r,b)->
		if r.statusCode == 200
			v._rev=b._rev
			nParams.method='put'
		else
			console.log 'tweeting ',v.header_text 
			tweet v.header_text
			nParams.method='post'
			nParams.url = "https://#{config.couch.user}:#{config.couch.pw}@#{config.couch.server}/#{config.couch.db}"
		nParams.body=v
		request nParams,(e,r,b)->
			true
		true
	true
start = ()->
	console.log 'running it time ', ++i
	request params, (e,r,b)->
		if b and b.alerts
			b.alerts.forEach eachAlert
		else
			console.log e,r,b
		true
	true




start()
timer=setInterval(start,60000)


