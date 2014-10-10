ValueEditor = {};

ValueEditor.Init = function(){
	//#ValuePicker 
	ValueEditor.Value = 100;
	ValueBar.inner = ValueBar.get(".inner");
	ValueBar.titleElem = ValueBar.get(".title");
	ValueBar.titleElem.addEventListener("click", function(event){
		event.defaultPrevented = true;		
	});
	ValueBar.set = function(value){
		var width = parseInt(value*98/100);
		ValueBar.inner.set("@style", "width:" + width + "px;");
		ValueEditor.Value = value;
		ValueBar.titleElem.set(value + "%");
	}
	
	ValueBar.addEventListener("click", function(event){
		var width = event.layerX;
		ValueBar.set(width);
		event.stopPropagation();		
	});
	MinValueBtn.addEventListener("click", function(event){
		ValueBar.set(0);
	});
	MaxValueBtn.addEventListener("click", function(event){
		ValueBar.set(100);
	});
}
