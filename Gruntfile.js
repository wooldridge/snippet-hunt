module.exports = function(grunt) {

  var env = grunt.option('env') || 'dev';

  // Load the plugin that provides the "jshint" task.
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-htmlmin");
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-preprocess');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    now : grunt.template.today('yyyymmddhhMMss'),
    ver : 1,
    env: {
      options : {
        /* Shared Options Hash */
        //globalOption : 'foo'
      },
      dev: {
        NODE_ENV : 'DEVELOPMENT'
      },
      prod : {
        NODE_ENV : 'PRODUCTION'
      }
    },
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
        src: './src/scripts/**/*.js',
        dest: './build/scripts/<%= pkg.name %>.min.js'
      },
      styles: {
        src: './src/styles/**/*.css',
        dest: './build/styles/<%= pkg.name %>.min.css'
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
          './build/index.html': './src/index.html',
          './build/admin.html': './src/admin.html'
        }
      },
      dev: {
        files: {
          './build/index.html': './src/index.html',
          './build/admin.html': './src/admin.html'
        }
      }
    },
    copy : {
      dev : {
        expand : true,
        cwd : './src/',
        src : [
          'images/**/*',
          'audio/**/*',
          'scripts/**/*',
          'styles/**/*'
        ],
        dest : './build/',
      },
      prod : {
        expand : true,
        cwd : './src/',
        src : [
          'images/**/*',
          //'!images/junk/**'
          'audio/**/*'
        ],
        dest : './build/'
      },
    },
    preprocess : {
      options : {
        context : {
          title : '<%= pkg.title %>',
          description : '<%= pkg.description %>',
          name : '<%= pkg.name %>',
          version : '<%= pkg.version %>',
          homepage : '<%= pkg.homepage %>',
          //production : '<%= pkg.production %>',
          now : '<%= now %>',
          ver : '<%= ver %>',
        },
      },
      dev : {
        files: {
          './build/index.html': './src/index.html',
          './build/admin.html': './src/admin.html'
        }
      },
      prod : {
        files: {
          './build/index.html': './src/index.html',
          './build/admin.html': './src/admin.html'
        }
      }
    }
  });

  // Env-specifc tasks
  if (env === 'prod') {
    grunt.registerTask('scripts', ['concat:scripts', 'uglify']);
    grunt.registerTask('styles',  ['concat:styles', 'cssmin']);
    grunt.registerTask('htmlmin',   ['htmlmin:prod']);
    grunt.registerTask('copyfiles',   ['copy:prod']);
    grunt.registerTask('preproc',   ['preprocess:prod']);
  } else {
    grunt.registerTask('scripts', []);
    grunt.registerTask('styles',  []);
    grunt.registerTask('copyfiles',   ['copy:dev']);
    grunt.registerTask('preproc',   ['preprocess:dev']);
  }

  // Default task
  grunt.registerTask('default', [
    'jshint', 'clean', 'scripts', 'styles', 'copyfiles', 'preproc'
  ]);

};
