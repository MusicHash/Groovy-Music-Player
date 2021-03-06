module.exports = function(grunt, options) {
    return {
        // watch js files and run jshint
        scripts: {
            files: [
                'src/**/*'
            ],
            
            tasks: ['webpack:debug'],
            
            options: {
                spawn: false
            }
        }
    };
};