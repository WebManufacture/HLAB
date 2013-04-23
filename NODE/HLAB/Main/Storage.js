if (!UsingDOM("KLabStorage")){
	
	KLabStorage = {};

	KLabStorage.Init = function(){
		
	};
	
	KLabStorage.GetStorage = function(url){
		return new KLabServerStorage(url);
	};
	
	function KLabServerStorage(url){
		this.tunnel = KLabNet.GetTunnel(url);
		this.url = Url.Resolve(url);
	};
	
	KLabServerStorage.prototype = {
		get : function(path){
			var klabObj = new KLabStorageAsyncObj(path);
			klabObj._parent = this;
			klabObj._state = KLabObjectStates.INPROGRESS;
			var rq = this.tunnel.get(this._baseUrl + path);
			rq.obj = this;
			rq.callback = function(result, status){
				if (result && result.length > 0){
					var res = JSON.parse(result);
					for (var item in res){
						if (item == "_id"){
							klabObj.id = res[item];	
						}
						else{
							klabObj[item] = res[item];
						}
					}
					klabObj._synchronize();
				}
			};
			rq.send();
			return klabObj;
		},
		
		all : function(path){
			return new KLabStorageAsyncObj(path);
		},
		
		add : function(obj){
			return new KLabStorageAsyncObj(obj);
		},
		
		set : function(obj){
			return new KLabStorageAsyncObj(obj);
		},
		
		del : function(obj){
			return new KLabStorageAsyncObj(obj);
		},
		
		each : function(func){
			
		}
	};
	
	KLabObjectStates = {
		CREATED : 0,
		INPROGRESS : 10,
		WAITING : 15,
		SYNCHRONIZED : 20,
	}
	
	function KLabStorageAsyncObj(path, syncFunc){
		this._path = path;
		this._syncFunc = syncFunc;
		this._state = KLabObjectStates.CREATED;
	};
	
	KLabStorageAsyncObj.prototype = {
		_synchronize : function(){
			this._state = KLabObjectStates.SYNCHRONIZED;
			if (typeof(this._onsync) == 'function'){
				this._onsync();	
			}
		},
		
		sync : function(func){
			//if (this._state < KLabObjectStates.SYNCHRONIZED
			this._onsync = func;
			this._syncFunc();
		},
		
		get : function(path){
			return new KLabStorageAsyncObj(path);
		},
		
		all : function(path){
			return new KLabStorageAsyncObj(path);
		},
		
		add : function(obj){
			return new KLabStorageAsyncObj(obj);
		},
		
		set : function(obj){
			return new KLabStorageAsyncObj(obj);
		},
		
		del : function(obj){
			return new KLabStorageAsyncObj(obj);
		},
		
		each : function(func){
			
		}
	};

	WS.DOMload(KLabStorage.Init);
}

