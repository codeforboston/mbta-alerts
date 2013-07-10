request = require 'request'
Twitter = require 'simple-twitter'
config = require './config'
crypto = require 'crypto'

twitter = new Twitter(config.twitter.consumerKey,config.twitter.consumerSecret,config.twitter.token,config.twitter.tokenSecret)

params = 
	qs:
		api_key:config.key
	url : 'http://realtime.mbta.com/developer/api/v1/alerts'
	json:true

defaultCallback = (err)->
	console.log(err) if err

cleanForTweet=(msg)->
	if msg.length > 132
		msg = msg.slice(0,132)+'...'
	msg = msg+' #mbta'
	msg.replace /\b\w+?\b [Ll]ine/g,(a)->
		'#'+a.replace(/\ /,"")
	
tweet = (msg,cb=defaultCallback)->
	twitter.post('statuses/update',{status:cleanForTweet(msg)},cb)

filterEl = (headerText)->
	/elevator/.test(headerText.toLowerCase()) or /escalator/.test(headerText.toLowerCase())

eachAlert = (v)->
	v['_id']=v['alert_id'].toString()
	nParams = 
		url:"https://#{config.couch.user}:#{config.couch.pw}@#{config.couch.server}/#{config.couch.db}/#{v._id}"
		json:true
	request nParams,(e,r,b)->
		if e
			console.log e
		else if r.statusCode == 200
			v._rev = b._rev
			callback = defaultCallback
		else
			callback = (e,r,b)->
				if r.statusCode == 201
					console.log 'tweeting ',v.header_text 
					tweet v.header_text
		nParams.method='put'
		nParams.body=v
		request nParams, callback
		true
	true

lastHash = false

dumbCache = (alerts,cb)->
	hash = crypto.createHash 'sha512'
	hash.update JSON.stringify(alerts), 'utf8'
	newHash = hash.digest 'base64'
	if lastHash == newHash
		console.log 'no change'
	else
		lastHash=newHash
		cb alerts
	true
	
i = 0

start = ()->
	console.log 'run number #', ++i
	request params, (e,r,b)->
		if b and b.alerts
			dumbCache b.alerts, (alerts)->
				alerts.forEach eachAlert
		else
			console.log e,r,b
		true
	true

start()
timer=setInterval(start,60000)
