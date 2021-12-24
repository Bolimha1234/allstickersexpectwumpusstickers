/**
 * @name allstickersexpectwumpusstickers
 */

 module.exports = (() => {
    const config = {
        "info": {
          "name": "allstickersexpectwumpusstickers",
          "authors": [
            {
              "name": "b0limh4",
            },
          ],
          "version": "1.0.0",
          "description": "All discord stickers expect wumpus stickers.",
        },
        "credits": 
            {
                "Magane plugin": "https://magane.moe/",
                "FreeCommunityStickers": "https://github.com/discord-stickers/FreeCommunitySticker"
            }
        ,
        "server": "https://f0e2489e-1fc2-4bee-af23-0e324da857d1.id.repl.co/",
        "main": "index.js"
      }
    
        return !global.ZeresPluginLibrary ? class {
            constructor() {this._config = config;}
            getName() {return config.info.name;}
            getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
            getDescription() {return config.info.description;}
            getVersion() {return config.info.version;}
            load() {
                BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                    confirmText: "Download Now",
                    cancelText: "Cancel",
                    onConfirm: () => {
                        require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                            if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                            await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                        });
                    }
                });
            }
            start() {}
            stop() {}
        } : (([Plugin, Api]) => {
            const plugin = (Plugin, Library) => {
    
        const {Patcher, WebpackModules, DiscordAPI, Toasts} = Library,
            { closeExpressionPicker } =  WebpackModules.getByProps("closeExpressionPicker"),
            { input, disabled } = WebpackModules.getByProps("disabled", "tagLabel"),
            { stickerUnsendable } = WebpackModules.getByProps("stickerUnsendable"),
            sticker = WebpackModules.find((m) => m?.default?.displayName === "Sticker")
            unpatch = [];
    
        return class allstickersexpectwumpusstickers extends Plugin {
            constructor() {
                super();
                this.onStart()
            }
            
            onStart() {
                if (DiscordAPI.currentUser.discordObject.premiumType == 2) return Toasts.error("Already have nitro.");
                BdApi.injectCSS("clean", `.${stickerUnsendable} {
                    webkit-filter: grayscale(0%) !important;
                    filter: grayscale(0%) !important;
                }`);
                let storage = null;
                const getLocalStorage = async () => {
                    const localStorageIframe = document.createElement('iframe');
                    localStorageIframe.id = 'localStorageIframe';
                    storage = document.body.appendChild(localStorageIframe).contentWindow.frames.localStorage;
                };
                
                unpatch.push(Patcher.before(sticker, "default", (_, [args]) => {
                    if (args?.sticker?.id && document.querySelector(`img[src*='${args?.sticker?.id}']`)) {
                        document.addEventListener('click', function(e) {
                            try {
                                document.getElementsByClassName("upsellWrapper-1utsSD")[0].style = 'display: none;'
                            } catch(err) {}
                        })
                        let img = document.querySelector(`img[src*='${args?.sticker?.id}']`);
                        document.querySelector(`.${input}`)?.removeAttribute("disabled");
                        document.querySelector(`.${input}`).placeholder = "Search for stickers";
                        document.querySelector(`.${disabled}`)?.classList.remove(disabled);
                        
                        img.onclick = async () => {
                        closeExpressionPicker();
                        let imglink = ''
                        let id = ''
    
                        async function definestuff (){
                            try {
                                if(img.src.includes(".webp")) {
                                    imglink = img.src.replace(".webp", ".png").split("?")[0]
                                    id = img.src.split('/stickers/')[1].split(".webp")[0] + '.png'
                                  }
                                  if(img.src.includes(".png")) {
                                      imglink = config.server + img.src.split("https://media.discordapp.net/stickers/")[1].split(".png")[0] + '.gif'
                                      id = img.src.split('/stickers/')[1].split(".png")[0] + '.gif'
                                  }
                            } catch(err) {
    
                            }
                        }
    
                        async function sendsticker() {
                            try {
                                definestuff();
                                if(imglink === '' || id === '') return;
                                BdApi.showToast("Sendinnng!",  {type: "success"})
                                let data = await fetch(imglink, {
                                    method: 'GET',
                                    mode: 'cors'
                                })
                                if(data) {
                                    let blob = await data.blob();
                                    const formData = new FormData();
                                    formData.append('file', blob, id)
    
                                    getLocalStorage();
    
                                    const channel = window.location.href.split('/').slice(-1)[0];
                                    let token = storage.token
                                    token = token.replace(/"/ig, '');
                                    token = token.replace(/^Bot\s*/i, '');
                                    const res = await fetch(`https://discordapp.com/api/channels/${channel}/messages`, {
                                        headers: { Authorization: token },
                                        method: 'POST',
                                        body: formData
                                        });
                                        if(res) {
                                            BdApi.showToast("Reaaaadyyyy! ✨",  {type: "info"})
                                        } else {
                                            BdApi.showToast("errorrrr >:(((( ❌", {type: "error"})
                                        }
                                } else if(!data) {
                                    BdApi.showToast("errorrrr >:(((( ❌",  {type: "error"})
                                }
                            } catch(err) {
                                console.log(err)
                                BdApi.showToast("errorrrr >:(((( ❌",  {type: "error"})
                            }
                        }
                    sendsticker();
                    }
                }
            }));
        }
    
            onStop() {
                unpatch.forEach(patch => {
                    patch();
                });
                BdApi.clearCSS("clean");
            }
        }
    };
            return plugin(Plugin, Api);
        })(global.ZeresPluginLibrary.buildPlugin(config));
    })();
