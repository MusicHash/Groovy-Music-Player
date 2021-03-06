define([
    "view/base_view",
    "view/player/components/controls",
    "view/player/components/thumbnail",
    "view/player/components/info_minimal",
    "view/player/components/info",
    "view/player/components/interactive",
    "view/player/components/volume",
    "events/events",
    "events/states",
    "utils/logger",
    "html/layout/player/player.html",
], function(BaseView, Controls, Thumbnail, InfoMinimal, Info, Interactive, Volume, Events, States, Logger, playerHTML) {
    /**
    * Controls
    *
    * @todo: very important - decouple the view thing, this object should get data rather than object
    */
    var Player = function(view) {
        Logger.debug('PLAYER::CONSTRUCTOR FIRED');
        
        this._view = view;
        
        this.init();
    };
    
    
    Player.prototype = _.extend(new BaseView(), {
        _view: null,
        _state: States.IDLE,
        canvasReferances: null,
        
        components: {},
        
        
        /**
         *
         */
        init: function() {
            this.components = {
                controls: new Controls(this),
                thumbnail: new Thumbnail(this),
                infoMinimal: new InfoMinimal(this),
                info: new Info(this), // smaller scrub - @todo find proper name
                interactive: new Interactive(this), // fully featured scrub - @todo find proper name
                volume: new Volume(this)
            };
            
            this.subscribe();
        },
        
        
        /**
         * Called during construction, subscribe to Events that interest the Player
         */
        subscribe: function() {
            this.getNotifications().on(Events.STATE_CHANGED, function(state) {
                this._state = state;
                this.playPauseButtonToggle();
            }, this);
            
            this.getNotifications().on(Events.PLAY, function(item) {
                this.setMediaProperties(item);
            }, this);
            
            this.getNotifications().on([Events.RESIZE, Events.QUEUE_EMPTY_NOT], function() {
                this.resizeComponents();
            }, this);
        },
        
        
        /**
         * Structures the HTML template and gets ready to render.
         * Must happen before this.append did.
         *
         * @return this
         */
        render: function() {
            this.output = $(_.template(playerHTML)(
                this._view.getModel().classes
            ));
            
            _.each(this.components, function(component) {
                component
                    .render()
                    .append(this.output.find('.groovy-skin'));
            }, this);
            
            console.log('OGXXXXXXXXXXXXXXX');
            
            return this;
        },
        
        
        /**
         * Changes the view of the Play/Pause buttons according to the state of the player
         * Called when state is changed to adjust the view.
         *
         * @return this
         */
        playPauseButtonToggle: function() {
            var namespace = this._view.getModel().classes.namespace;
            
            this._toggleIf(!this.isPlaying(), $('.'+ namespace +'-play'));
            this._toggleIf(this.isPlaying(), $('.'+ namespace +'-pause'));
            
            return this;
        },
        
        
        /**
         * Updates the view UI with Item's data such as artist, song and thumbnail
         * 
         * @param {Object} Item Object
         * @return {Object} this aka. Player instance
         */
        setMediaProperties: function(item) {
            var namespace = this._view.getModel().classes.namespace,
                model = item._model;
            
            $('.'+ namespace +'-song-artist').html($(model.artist));
            $('.'+ namespace +'-song-name').html(model.song);
            $('.'+ namespace +'-thumbnail img').attr({src: model.thumbnail});
            
            // scrub
            $('.'+ namespace +'-scrubber-bg img').attr({src: model.scrub.bg});
           	$('.'+ namespace +'-scrubber-progress img').attr({src: model.scrub.progress});
            
            return this;
        },
        
        
        /**
         * Resize Components is called when a resize event is fired. Adjusting the Player ClassName according to the
         * size that most appropriate allowing CSS to alter the view
         */
        resizeComponents: function() {
            var model = this._view.getModel();
            var namespace = model.classes.namespace;
            var width = this.getWidth(),
                className = namespace +'-gui',
                elSize = '';
            
            // toggle view based on options.
            //this._toggleIf(model.waveform || model.spectrum, $('.groovy-interactive'));
            
            // toggle features based on condition
            // @todo move toggles to a proper location.. else where, where it handdles all the other stuff related to these buttons
            this._toggleIf(model.waveform.enabled, $('.groovy-scrubber'));
            this._toggleIf(model.spectrum.enabled, $('.groovy-spectrum'));
            
            if (900 <= width) {
                elSize += namespace + '-size-lg';
            } else
            if (700 <= width) {
                elSize += namespace + '-size-md';
            } else
            if (600 <= width) {
                elSize += namespace + '-size-sm';
            } else
            if (400 <= width) {
                elSize += namespace + '-size-xs';
            } else {
                elSize += namespace + '-size-xxs';
            }
            
            //set the class property on the player to allow CSS alter the view
            $('.'+className).attr({'class': className + ' ' + elSize});
            
            this.setDynamicElementsWidth(elSize); // @todo figure out.. move else where
        },
        
        
        getStaticElementsWidth: function() {
            var els = $('ul.groovy-skin').children(':visible').not('.groovy-calc-ignore'),
                width = 0;
            
            els.each(function(idx, el) {
                width += $(el).outerWidth(true);
            });
            
            return width;
        },
        
        
        /**
         *
         */
        setDynamicElementsWidth: function(elSize) {
            var model = this._view.getModel();
            var namespace = model.classes.namespace;
            var staticWidth = this.getStaticElementsWidth(),
                width = this.getWidth(),
                ratio = model.style.interactiveRatio,
                availableWidth = 0,
                dimenstions = {},
                canvas = this.getCanvasReferances().el,
                minimalInfoProgressBarOffset = 80,
                progressBarSaftyOffset = 3;
            
            availableWidth = width - staticWidth;
            
            dimenstions = {
                info: availableWidth - this.getWidthMargin('li.groovy-info') - progressBarSaftyOffset,
                interactive: availableWidth * (1 - ratio) - progressBarSaftyOffset,
                infoMinimal: availableWidth * ratio - this.getWidthMargin('li.groovy-info-minimal'),
            };
            
            // xss small, diffrent layout option.
            if (namespace + '-size-xxs' === elSize) {
                dimenstions.infoMinimal = availableWidth - this.getWidthMargin('li.groovy-info-minimal');
            }
            
            // info elemnt dynamic sizing.
            $('li.groovy-info').width(dimenstions.info);
            $('li.groovy-info div.groovy-progress-bar').width(dimenstions.info - minimalInfoProgressBarOffset);
            $('.groovy-scrabber').width(dimenstions.interactive);
            
            if (null !== canvas) {
                canvas.active.background.width = dimenstions.interactive;
                canvas.active.progress.width = dimenstions.interactive;
                
                canvas.reflect.background.width = dimenstions.interactive;
                canvas.reflect.progress.width = dimenstions.interactive;
            }
            
            $('li.groovy-info-minimal').width(dimenstions.infoMinimal);
            
            return this;
        },
        
        

        
        
        getCanvasReferances: function() {
            if (null !== this.canvasReferances) return this.canvasReferances;
            
            this.canvasReferances = {
                el: {
                    active: {
                        background: $('.spectrum-scrub-bg').get(0),
                        progress: $('.spectrum-scrub-prog').get(0)
                    },
                    
                    reflect: {
                        background: $('.spectrum-scrub-bg-reflect').get(0),
                        progress: $('.spectrum-scrub-prog-reflect').get(0)
                    }
                }
            };
            
            this.canvasReferances.context = {
                active: {
                    background: this.canvasReferances.el.active.background.getContext('2d'),
                    progress: this.canvasReferances.el.active.progress.getContext('2d')
                },
                
                reflect: {
                    background: this.canvasReferances.el.reflect.background.getContext('2d'),
                    progress: this.canvasReferances.el.reflect.progress.getContext('2d')
                }
            };
            
            return this.canvasReferances;
        },
        
        
        /**
         * Calculates the actual player width
         *
         * @return {Number}
         */
        getWidth: function() {
            return $(this._view.getModel().getContainer()).find('.'+ this._view.getModel().classes.player_wrapper).width();
        },
        
        
        /**
         * Is currently playing, based on states
         *
         * @return {Bool}
         */
        isPlaying: function() {
            return (States.PLAYING === this._state);
        },
        
        
        /**
         *
         */
        getNotifications: function() {
            return this._view.getNotifications();
        },
        
        
        /**
         * Fired after the el added to the DOM, called by the BaseView
         */
        onAppend: function() {
            this.resizeComponents();
        }
    });
    
    return Player;
});