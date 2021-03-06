define([
    "core",
    "utils/logger"
], function(gPlayer, Logger) {
    /**
     * Base View, all views inherit this shared and basic logic.
     *
     * Provides basic render and appenders for the view.
     */
    var BaseView = function() {
        //Logger.debug('BASEVIEW::CONSTRUCTOR FIRED');
    };
    
    
    BaseView.prototype = {
        el: null,
        output: '',
        _position: null,
        
        /**
         * Adds element to the dom
         */
        append: function(to) {
            Logger.debug('BASEVIEW::APPEND FIRED '+ to);
            
            this.el = this.output;
            $(to).append(this.getEl());
            
            this.onAppend();
            
            return this;
        },
        
        
        /**
         * Removes element from the dom.
         */
        remove: function() {
            if (null === this.getEl()) {
                Logger.debug('el is null, never added, probably.');
                return;
            }
            
            Logger.debug('REMOVING EL', this.getEl());
            
            this.getEl().remove();
        },
        
        
        /**
         * Get the position of the element in the DOM, unless the position is cached so will return it.
         *
         * @return {Number}
         */
        getPosition: function() {
            return (null !== this._position) ? this._position : this.getEl().index();
        },

        
        /**
         * Caches the current position, to prevent travling to DOM when not needed.
         *
         * @return {Object} this for chaining
         */
        cachePosition: function() {
            this._position = this.getPosition();
            
            return this;
        },
        
        
        /**
         * Getter for the output object
         *
         * @todo Stop using this.output - internally, all objects should use this.el instead.
         * @return {HTMLElement}
         */
        getEl: function() {
            return this.el;
        },
        
        
        /**
         * Getter for the width of the current El
         * 
         * @return {Number} width
         */
        getWidth: function() {
            return this.getEl().width();
        },
        
        
        /**
         * Returns the HTMLElement
         *
         * @return {HTMLElement}
         */
        toString: function() {
            return this.output;
        },
        
        
        /**
         * Getter for getting the controller. Via the main gPlayer object.
         *
         * @return {Object} Controller
         */
        getController: function() {
            return gPlayer().getController();
        },
        
        
        /**
         * Getter for getting the main model
         *
         * @return {Object} Model
         */
        getModel: function() {
            return this.getController().getModel();
        },
        
        
        /**
         * Getter for getting the main Notifications object
         *
         * @return {Object} Notification
         */
        getNotifications: function() {
            return this.getController().getNotifications();
        },
        
        
        /**
         * Random ID generator for appended objects.
         *
         * Math.random should be unique because of its seeding algorithm.
         * Convert it to base 36 (numbers + letters), and grab
         * the first 9 characters after the decimal.
         *
         * @return {String} - Sample ID looks like: "_619z73eci"
         */
        _generateUniqueID: function () {
            return '_' + Math.random().toString(36).substr(2, 9);
        },
        
        
        /**
         * Getter for the width of an element including the margins
         *
         * @param {String} el Selector
         */
        getWidthMargin: function(el) {
            var left = parseInt($(el).css('margin-left')) || 0,
                right = parseInt($(el).css('margin-right')) || 0;
            
            return left + right;
        },
        
        
        /**
         * Toggle visibility by condition
         *
         * @param {Bool} condition
         * @param {HTMLElement}
         * @return {Object} this for chaining
         */
        _toggleIf: function(condition, el) {
            if (condition) { 
                el.show(); 
            } else {
                el.hide();
            }
            
            return this;
        },
        
        
        /**
         * On append is fired right after the el was added to the dom.
         *
         * This method is intended to be overridden
         */
        onAppend: function() {}
    };
    
    return BaseView;
});