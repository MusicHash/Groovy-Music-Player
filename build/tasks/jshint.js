module.exports = function(grunt, options) {
    return {
        src: {
        src: [
            '<%= build.src %>/**/*.js',
                'specs/**/*Spec.js'
        ],
        options: {
                jshintrc: 'grunt/.jshintrc.json'
            }
    },
    
    
    tasks: {
            src: [
            'Gruntfile.js',
                'grunt/**/*.js'
        ],
        
            options: {
            jshintrc: 'grunt/.jshintrc.json'
            }
    }
    };
};