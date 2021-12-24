const express = require('express'),
request = require('request'),
fs = require('fs'),
app = new express(),
cors = require('cors'),
rimraf = require('rimraf');
const path = './*.gif'
const spawn = require("child_process").spawnSync;
try {
  rimraf('./*.gif', function () { console.log('Deleted.'); });
  } catch(err) {
    console.log('No files!')
    }

    app.listen(3000)
    app.use(cors())
    app.get('/:sticker', async function(req,res) {
      if(req.params && req.params['sticker'] && req.params['sticker'] && req.params['sticker'].includes(".gif")) {
          let sticker = req.params['sticker'].split('.gif')[0] /* Has .gif */
              request('https://media.discordapp.net/stickers/' + sticker + '.png')
                  .pipe(fs.createWriteStream(sticker + '.png'))
                      .on('finish', async function() {
                            let process = await spawn('python',["main.py", `./${sticker}.png`])
                                  res.download(sticker + '.gif')
                                      })
                                        } else {
                                            return res.sendStatus(200)
                                              }
                                              });

                                              app.use('*', function (req, res, next) {
                                                res.sendStatus(200)
                                                });