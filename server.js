#!/bin/env node
var exec = require('child_process').exec;
exec('forever stop index.coffee');
exec('forever -c coffee index.coffee');
