if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {} // optionally move this outside the declaration and into a closure if you need more speed.
        F.prototype = o;
        return new F();
    };
}

$.plugin = function(name, object) {
  $.fn[name] = function() {
      return this.each(function() {
          if ( ! $.data(this, name) ) {
              $.data(this, name, Object.create(object).init(this));
          }
      });
  };
};
   
   var SSNSpy = {
       init: function(el) {
        this.$el = $(el);
        this.$revealBtn;
        this.$concealBtn;
        this.$plainSSN;
        this.concealTimeout;
        
        this._create();
        
        return this;
       },
       
        _create: function() {
            var obj = this;
            this.$revealBtn = $('<a />', {
               id: 'revealSSN',
               class: 'fauxButtons miniButton',
               html: 'Reveal'
            });
            
            this.$concealBtn = $('<a />', {
               id: 'concealSSN',
               class: 'fauxButtons miniButton',
               style: 'display: none;',
               html: 'Conceal'
            });
            
            this.$plainSSN = $('<input />', {
               id: 'plainSSN' ,
               style: 'display: none;',
               type: 'text',
               value: this.$el.val()
            });

            this.$el.prev('label').append([this.$revealBtn, this.$concealBtn]);
            this.$el.after(this.$plainSSN);
            
            this.$revealBtn.on( 'click', obj, this.updateUI );
            this.$concealBtn.on( 'click', obj, this.updateUI );
            
            this.$el.on( 'change', obj, this.updateValue);
            this.$plainSSN.on( 'change', obj, this.updateValue);
            
        },        
               
        
        updateUI: function(obj) {
            // provides a referece to this object
            // note that 'this' is the event 
            var thisObj = obj.data;
            
            // clear existing timeouts
            clearTimeout(thisObj.concealTimeout);
            
            // either shows or hides elements depending on their current state
            thisObj.$revealBtn.toggle('fast');
            thisObj.$el.toggle('fast');
            
            thisObj.$concealBtn.toggle('fast');
            thisObj.$plainSSN.toggle('fast');
            
            // this will trigger the conceal button click after 10 minutes
            if ( typeof(event) != 'undefined') {
                if ($(event.target).attr('id') === thisObj.$revealBtn.attr('id')){
                    thisObj.concealTimeout = setTimeout(function() {
                        thisObj.$concealBtn.trigger( 'click' );
                    }, 60000);
                };
            }
        },
               
       updateValue: function(obj) {
           var thisObj = obj.data;
           
           // the following conditionals check which button was clicked
           // update based on the the visible element
           if ($(event.target).attr('id') === thisObj.$el.attr('id')){
               thisObj.$plainSSN.val(thisObj.$el.val());
           };
           
           if ($(event.target).attr('id') === thisObj.$plainSSN.attr('id')){
               thisObj.$el.val(thisObj.$plainSSN.val());
           };   
       }
       
       
   };