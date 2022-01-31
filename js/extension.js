(function() {
    class Welcome extends window.Extension {
        constructor() {
            super('welcome');
            this.addMenuEntry('Welcome');

            const getUrl = window.location;
            this.baseUrl = getUrl.protocol + "//" + getUrl.host + "/things";

            this.show_at_start = false;
            this.content = '';
            fetch(`/extensions/${this.id}/views/content.html`)
                .then((res) => res.text())
                .then((text) => {
                    this.content = text;
                    this.show();
                    
                    window.API.postJson(
                        `/extensions/${this.id}/api/ajax`, {
                            'action': 'init'
                        }
                    ).then((body) => {
                        console.log('Welcome init complete. body: ', body);
                        this.show_at_start = body.show;
                        if(body.show){
                            document.getElementById('extension-welcome-menu-item').click(); // dispatchEvent(clickEvent);
                        }
                        
                        
                    }).catch((e) => {
                        console.log("welcome error: ", e);
                    });
                    
                    
                    /*
                    var clickEvent = new MouseEvent("click", {
                        "view": window,
                        "bubbles": false,
                        "cancelable": true
                    });
                    */
                    
                    //document.getElementById('extension-welcome-menu-item').click(); // dispatchEvent(clickEvent);
                })
                .catch((e) => console.error('Failed to fetch content:', e));
        }

        show() {
            if (this.content == '') {
                return;
            }
            this.view.innerHTML = this.content;
            
            if(this.show_at_start == false){
                document.getElementById('extension-welcome-hide-button').style.display = 'none';
            }
            
            document.getElementById('extension-welcome-hide-button').addEventListener('click', () => {
                
				window.API.postJson(
					`/extensions/${this.id}/api/ajax`,
					{'action':'hide'}
				).then((body) => { 
					console.log(body);
                    document.getElementById('extension-welcome-hide-button').style.display = 'none';

				}).catch((e) => {
					console.log("error saving preference");
				});
                
            });
            
        }
        
    }

    new Welcome();

})();