(function() {
    class Tutorial extends window.Extension {
        constructor() {
            super('tutorial');
            this.addMenuEntry('Tutorial');

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
                        console.log('Tutorial init complete. body: ', body);
                        this.show_at_start = body.show;
                        try{
                            if(body.show){
                                document.getElementById('extension-tutorial-menu-item').click(); // dispatchEvent(clickEvent);
                            }
                
                            if(typeof body.ip_address != 'undefined'){
                                if(document.getElementById('extension-tutorial-ip-address') != null){
                                    document.getElementById('extension-tutorial-ip-address').innerText = body.ip_address;
                                }
                            }
                
                            if(typeof body.hostname != 'undefined'){
                                if(document.getElementById('extension-tutorial-hostname') != null){
                                    document.getElementById('extension-tutorial-hostname').innerText = body.hostname;
                                    document.getElementById('extension-tutorial-hostname2').innerText = body.hostname;
                                }
                            }
                        }
                        catch(e){
                            console.log("general init error: ", e);
                        }
                
                
                    }).catch((e) => {
                        console.log("Tutorial init error: ", e);
                    });
                    
                    /*
                    var clickEvent = new MouseEvent("click", {
                        "view": window,
                        "bubbles": false,
                        "cancelable": true
                    });
                    */
                    
                    //document.getElementById('extension-tutorial-menu-item').click(); // dispatchEvent(clickEvent);
                })
                .catch((e) => console.error('Failed to fetch content:', e));
        }

        show() {
            if (this.content == '') {
                return;
            }
            this.view.innerHTML = this.content;
            
            
            window.API.postJson(
                `/extensions/${this.id}/api/ajax`, {
                    'action': 'init'
                }
            ).then((body) => {
                //console.log('Tutorial init complete. body: ', body);
                //this.show_at_start = body.show;
                try{
        
                    if(typeof body.ip_address != 'undefined'){
                        if(document.getElementById('extension-tutorial-ip-address') != null){
                            document.getElementById('extension-tutorial-ip-address').innerText = body.ip_address;
                        }
                    }
        
                    if(typeof body.hostname != 'undefined'){
                        if(document.getElementById('extension-tutorial-hostname') != null){
                            document.getElementById('extension-tutorial-hostname').innerText = body.hostname;
                            document.getElementById('extension-tutorial-hostname2').innerText = body.hostname;
                        }
                    }
                }
                catch(e){
                    console.log("general init error: ", e);
                }
        
        
            }).catch((e) => {
                console.log("Tutorial init error: ", e);
            });
            
            
            if(this.show_at_start == false){
                document.getElementById('extension-tutorial-hide-button').style.display = 'none';
            }
            
            // Do not show on startup button
            document.getElementById('extension-tutorial-hide-button').addEventListener('click', () => {
                
				window.API.postJson(
					`/extensions/${this.id}/api/ajax`,
					{'action':'hide'}
				).then((body) => { 
					//console.log(body);
                    document.getElementById('extension-tutorial-hide-button').style.display = 'none';

				}).catch((e) => {
					//console.log("error saving preference");
				});
                
            });
            
            
            // Back button
            document.getElementById('extension-tutorial-back-button').addEventListener('click', () => {
                document.getElementById('extension-tutorial-pages-container').style.display = 'none';
                document.getElementById('extension-tutorial-view').style.zIndex = 'auto';
            });
            
            
            
            
            document.querySelectorAll('.extension-tutorial-option').forEach(item => {
                item.addEventListener('click', event => {
                    //console.log(event);
                    //console.log(event.srcElement.getAttribute('data-page'));
                    const target_page = event.target.getAttribute('data-page');
                    
                    document.querySelectorAll('#extension-tutorial-pages > div').forEach(page => {
                        //console.log("target_page: ", target_page);
                        if(page.getAttribute('id').endsWith(target_page)){
                            page.style.display = 'block';
                        }
                        else{
                            page.style.display = 'none';
                        }
                        document.getElementById('extension-tutorial-pages-container').style.display = 'block';
                        
                    });
                    
                    document.getElementById('extension-tutorial-pages-container').scrollTop = 0;
                    document.getElementById('extension-tutorial-view').style.zIndex = '3';
                    
                })
            })
            
            
            
            
        }
        
    }

    new Tutorial();

})();