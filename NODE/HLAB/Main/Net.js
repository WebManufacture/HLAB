if (!UsingDOM("KLabNet")){
	KLabNet = {};
	
	KLabNet.Init = function(){
		
	};
	
	KLabNet.GetTunnel = function(serverUrl){		
		return new KLabTunnel(serverUrl);	
	}
	
	function KLabTunnel(serverUrl){
		if (!serverUrl){
			this.ServerUrl = null; //Url.Resolve(window.location.protocol + "//" + window.location.host);
		}
		else{
			this.ServerUrl = new Url(serverUrl, true);
			this.crossDomain = this.ServerUrl.hostname != window.location.hostname;	
		}
	};
	
	KLabTunnel.prototype = {
		_endRequest : function(){		
			if (this.callback){
				if (typeof(this.callback) == "function"){
					this.callback(this.responseText, this.status);
					return;
				}
				if (this.callback.add){
					if (DOM){
						this.callback.add(DOM.Wrap(this.responseText));
					}
					else{
						this.callback.add(this.responseText);
					}
					return;
				}
				delete this.callback;
			}
		},
		
		
		_errorRequest : function(){		
			if (this.callback){
				if (typeof(this.callback) == "function"){
					this.callback(this.responseText, this.status);
					return;
				}
			}
		},
		
		_getRequest : function(method, url, callback){
			var rq = new XMLHttpRequest();
			if (this.ServerUrl){
				if (typeof url == "string"){
					url = new Url(url);
				}
				url.rebase(this.ServerUrl);
				url = url.toString();
			}
			rq.open(method, url + "", true);
			rq.callback = callback;
			rq.onload = this._endRequest;
			rq.onerror = this._errorRequest;
			return rq;
		},
		
		_sendRequest : function(method, url, data, callback){
			var rq = this._getRequest(method, url, callback);
			if (callback){
				rq.send(data);
			}
			return rq;
		},
		
		
		get : function(url, callback){
			return this._sendRequest("GET", url, null, callback);
		},
		
		all : function(url, callback){
			return this._sendRequest("SEARCH", url, null, callback);
		},
		
		add : function(url, text, callback){
			return this._sendRequest("POST", url, text, callback);
		},
		
		set : function(url, text, callback){
			return this._sendRequest("PUT", url, text, callback);
		},
		
		del : function(url, callback){
			return this._sendRequest("DELETE", url, null, callback);
		}	
	};
		
	WS.DOMload(KLabNet.Init);
}
