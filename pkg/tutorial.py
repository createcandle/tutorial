"""Tutorial API handler."""


import os
import sys
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'lib'))
import json
import socket
#from time import sleep
#import datetime
import functools
#import subprocess

try:
    from gateway_addon import APIHandler, APIResponse
    #print("succesfully loaded APIHandler and APIResponse from gateway_addon")
except:
    print("Import APIHandler and APIResponse from gateway_addon failed. Use at least WebThings Gateway version 0.10")

print = functools.partial(print, flush=True)



_TIMEOUT = 3

_CONFIG_PATHS = [
    os.path.join(os.path.expanduser('~'), '.webthings', 'config'),
]

if 'WEBTHINGS_HOME' in os.environ:
    _CONFIG_PATHS.insert(0, os.path.join(os.environ['WEBTHINGS_HOME'], 'config'))



class TutorialAPIHandler(APIHandler):
    """Tutorial API handler."""

    def __init__(self, verbose=False):
        """Initialize the object."""
        #print("INSIDE API HANDLER INIT")
        try:
            manifest_fname = os.path.join(
                os.path.dirname(__file__),
                '..',
                'manifest.json'
            )            

            self.addon_name = 'tutorial'
            self.DEBUG = False
            #self.adapter = adapter
            #print("ext: self.adapter = " + str(self.adapter))
            self.ip_address = " ERROR!"
            try:
                self.ip_address = get_ip()
            except:
                print("Error, could not get actual own IP address")
                
            self.hostname = "candle"
            try:
                self.hostname = socket.gethostname()
            except:
                print("Error, could not get hostname")
                
            try:
                with open(manifest_fname, 'rt') as f:
                    manifest = json.load(f)
                    self.addon_name = manifest['id']
            except Exception as ex:
                print("Error loading manifest.json: " + str(ex))
                
            APIHandler.__init__(self, self.addon_name)
            self.manager_proxy.add_api_handler(self)
            
            self.persistent_data = {'show':True}
            self.persistence_file_path = os.path.join(self.user_profile['dataDir'], self.addon_name, 'persistence.json')
            
            # Get persistent data
            try:
                with open(self.persistence_file_path) as f:
                    self.persistent_data = json.load(f)
                    if self.DEBUG:
                        print('self.persistent_data loaded from file: ' + str(self.persistent_data))
                    
            except:
                if self.DEBUG:
                    print("Could not load persistent data (if you just installed the add-on then this is normal)")
                self.save_persistent_data()
                
            
        except Exception as e:
            print("Failed to init UX extension API handler: " + str(e))
        
        
    
    def save_persistent_data(self):
        if self.DEBUG:
            print("Saving to persistence data store")

        try:
            if not os.path.isfile(self.persistence_file_path):
                open(self.persistence_file_path, 'a').close()
                if self.DEBUG:
                    print("Created an empty persistence file")
            else:
                if self.DEBUG:
                    print("Persistence file existed. Will try to save to it.")

            with open(self.persistence_file_path) as f:
                if self.DEBUG:
                    print("saving: " + str(self.persistent_data))
                try:
                    json.dump( self.persistent_data, open( self.persistence_file_path, 'w+' ) )
                except Exception as ex:
                    print("Error saving to persistence file: " + str(ex))
                return True
            #self.previous_persistent_data = self.persistent_data.copy()

        except Exception as ex:
            if self.DEBUG:
                print("Error: could not store data in persistent store: " + str(ex) )
            return False
    
        

    def handle_request(self, request):
        """
        Handle a new API request for this handler.

        request -- APIRequest object
        """
        
        try:
        
            if request.method != 'POST':
                return APIResponse(status=404)
            
            if request.path == '/ajax':


                action = str(request.body['action']) 
                
                

                try:
                    
                    if action == 'init':
                        if self.DEBUG:
                            print("in init")
                    
                        return APIResponse(
                          status=200,
                          content_type='application/json',
                          content=json.dumps({'show' : self.persistent_data['show'],
                                              'ip_address':self.ip_address,
                                              'hostname':self.hostname
                                              }),
                        )
                        
                    elif action == 'hide':
                        if self.DEBUG:
                            print("in hide")
                    
                        self.persistent_data['show'] = False
                        self.save_persistent_data()
                    
                        return APIResponse(
                          status=200,
                          content_type='application/json',
                          content=json.dumps({'show' : False}),
                        )
                    
                    else:
                        return APIResponse(
                          status=404
                        )
                        
                except Exception as ex:
                    if self.DEBUG:
                        print("Tutorial server error: " + str(ex))
                    return APIResponse(
                      status=500,
                      content_type='application/json',
                      content=json.dumps({"state":"error"}),
                    )
                    
            else:
                return APIResponse(status=404)
                
        except Exception as e:
            if self.DEBUG:
                print("Failed to handle UX extension API request: " + str(e))
            return APIResponse(
              status=500,
              content_type='application/json',
              content=json.dumps({"state":"error"}),
            )


"""
def run_command(cmd, timeout_seconds=60):
    try:
        p = subprocess.run(cmd, timeout=timeout_seconds, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True, universal_newlines=True)

        if p.returncode == 0:
            return p.stdout  + '\n' + "Command success" #.decode('utf-8')
            #yield("Command success")
        else:
            if p.stderr:
                return "Error: " + str(p.stderr)  + '\n' + "Command failed"   #.decode('utf-8'))

    except Exception as e:
        print("Error running Arduino CLI command: "  + str(e))
        
"""
            

def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # doesn't even have to be reachable
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except:
        IP = ' ERROR!'
    finally:
        s.close()
    return IP
