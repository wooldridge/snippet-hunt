module.exports = function(grunt) {

  var env = grunt.option('env') || 'dev';

  // Load the plugin that provides the "jshint" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-htmlmin");
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        curly: true,
        eqeqeq: true
      },
      target1: ['Gruntfile.js', 'src/**/*.js']
    },
    clean: ['build'],
    concat: {
      scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'build/scripts/<%= pkg.name %>.js'
      },
      styles: {
        src: 'src/styles/**/*.css',
        dest: 'build/styles/<%= pkg.name %>.css'
      }
    },
    uglify: {
      compress: {
        src: "<%= concat.scripts.dest %>",
        dest: "<%= concat.scripts.dest %>"
      }
    },
    cssmin: {
      compress: {
        src: "<%= concat.styles.dest %>",
        dest: "<%= concat.styles.dest %>"
      }
    },
    htmlmin: {
      prod: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          removeOptionalTags: true
        },
        files: {
          'build/index.html': 'src/index.html',
          'build/admin.html': 'src/admin.html'
        }
      },
      dev: {
        files: {
          'build/index.html': 'src/index.html',
          'build/admin.html': 'src/admin.html'
        }
      }
    }
  });

  // Environment specifc tasks
  if (env === 'prod') {
    grunt.registerTask('scripts', ['concat:scripts', 'uglify']);
    grunt.registerTask('styles',  ['concat:styles', 'cssmin']);
    grunt.registerTask('html',   ['htmlmin:prod']);
  } else {
    grunt.registerTask('scripts', ['concat:scripts']);
    grunt.registerTask('styles',  ['concat:styles']);
    grunt.registerTask('html',   ['htmlmin:dev']);
  }

  // Define the default task
  grunt.registerTask('default', ['clean', 'scripts', 'styles', 'html']);

};
