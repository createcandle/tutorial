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
                        //console.log('Welcome init complete. body: ', body);
                        this.show_at_start = body.show;
                        if(body.show){
                            document.getElementById('extension-welcome-menu-item').click(); // dispatchEvent(clickEvent);
                        }
                        
                        
                    }).catch((e) => {
                        //console.log("welcome error: ", e);
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
            
            // Do not show on startup button
            document.getElementById('extension-welcome-hide-button').addEventListener('click', () => {
                
				window.API.postJson(
					`/extensions/${this.id}/api/ajax`,
					{'action':'hide'}
				).then((body) => { 
					//console.log(body);
                    document.getElementById('extension-welcome-hide-button').style.display = 'none';

				}).catch((e) => {
					//console.log("error saving preference");
				});
                
            });
            
            
            // Back button
            document.getElementById('extension-welcome-back-button').addEventListener('click', () => {
                document.getElementById('extension-welcome-pages-container').style.display = 'none';
                document.getElementById('extension-welcome-view').style.zIndex = 'auto';
            });
            
            
            
            
            document.querySelectorAll('.extension-welcome-option').forEach(item => {
                item.addEventListener('click', event => {
                    //console.log(event);
                    //console.log(event.srcElement.getAttribute('data-page'));
                    const target_page = event.target.getAttribute('data-page');
                    
                    document.querySelectorAll('#extension-welcome-pages > div').forEach(page => {
                        //console.log("target_page: ", target_page);
                        if(page.getAttribute('id').endsWith(target_page)){
                            page.style.display = 'block';
                        }
                        else{
                            page.style.display = 'none';
                        }
                        document.getElementById('extension-welcome-pages-container').style.display = 'block';
                        
                    });
                    
                    document.getElementById('extension-welcome-pages-container').scrollTop = 0;
                    document.getElementById('extension-welcome-view').style.zIndex = '3';
                    
                })
            })
            
            
            
            
        }
        
    }

    new Welcome();

})();