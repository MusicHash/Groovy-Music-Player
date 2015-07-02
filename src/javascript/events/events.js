define(function() {
    /**
     * Events list
     */
    var Events = {
        CHANGE: "CHANGE:",
        PLAYER_READY: "PLAYER_READY",
        RESIZE: "RESIZE",
        PLAY: "PLAY",
        PLAY_NEXT: "PLAY_NEXT",
        PLAY_PREVIOUS: "PLAY_PREVIOUS",
        PAUSE: "PAUSE",
        VOLUME_SET: "VOLUME_SET",
        JUMP_TO_SECOND: "JUMP_TO_SECOND",
        JUMP_TO_PERCENT: "JUMP_TO_PERCENT",
        
        QUEUE_EMPTY: "QUEUE_EMPTY",
        QUEUE_EMPTY_NOT: "QUEUE_EMPTY_NOT",
        QUEUE_PLAY_ACTIVE: "QUEUE_PLAY_ACTIVE",
        QUEUE_ITEM_SET_ACTIVE: "QUEUE_ITEM_SET_ACTIVE",
        QUEUE_ITEM_CHANGED_ACTIVE: "QUEUE_ITEM_CHANGED_ACTIVE",
        QUEUE_ITEM_UPDATED: "QUEUE_ITEM_UPDATED",
        QUEUE_ITEM_ADDED: "QUEUE_ITEM_ADDED",
        QUEUE_ITEM_ADD_COMPLETE: "QUEUE_ITEM_ADD_COMPLETE",
        QUEUE_ITEM_CLICK_PLAY: "QUEUE_ITEM_CLICK_PLAY",
        QUEUE_ITEM_CLICK_PAUSE: "QUEUE_ITEM_CLICK_PAUSE",
        QUEUE_ITEM_REMOVED: "QUEUE_ITEM_REMOVED",
        QUEUE_ITEM_CLICK_ARTIST: "QUEUE_ITEM_CLICK_ARTIST",
        
        STATE_CHANGED: "STATE_CHANGED"
    };
    
    return Events;
});