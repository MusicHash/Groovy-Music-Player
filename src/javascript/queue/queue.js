define([
    "../core",
    "./view/item",
    "../events/events",
    "../events/states",
    "../utils/logger",
], function(gPlayer, Item, Events, States, Logger) {
    /**
     *
     */
    var Queue = function(notifications) {
        this._notifications = notifications;
        
        this.init();
    };
    
    Queue.prototype = {
        _notifications: null,
        
        init: function() {
            Logger.debug('QUEUE::INIT FIRED');
        },
        
        
        /**
         *
         */
        add: function(item, to) {
            var itemHTML = new Item(item).render();
            
            itemHTML.append('.'+ this.getDomParent());
            
            return this;
        },
        
        
        /**
         *
         */
        getDomParent: function() {
            return gPlayer().getController().getModel().classes.queue;
        }
    };
    
    return Queue;
});