module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

     pkg: grunt.file.readJSON('package.json'),


      // Define our source and build folders
      proxy_url:    'local.veneno',

      build:        '_public',
      css_build:    '_public/css',
      js_build:     '_public/js',
      vendor_build: '_public/vendors',

      css_src:      '_source/css',
      js_src:       '_source/js',
      vendor_src:   '_source/vendors',


      meta: {
        css : {
            banner:
            '/*========================================================================================!\n' +
            ' * app.css <%= pkg.name %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' +
            ' * Author: <%= pkg.author %>\n' +
            ' * E-mail: <%= pkg.email %>\n' +
            ' * Site: <%= pkg.site %>\n' +
            ' ========================================================================================*/'
        },

        js : {

            banner:
            '/*========================================================================================!\n' +
            ' * app.js <%= pkg.name %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' +
            ' * Author: <%= pkg.author %>\n' +
            ' * E-mail: <%= pkg.email %>\n' +
            ' * Site: <%= pkg.site %>\n' +
            ' ========================================================================================*/'

        }

      },


      // Less Config
      less: {
        '<%= css_build %>/app.css': '<%= css_src %>/application.less'
      },


      watch: {
          // options: {
          //   livereload: true
          // },

          css: {
            files: ['<%= css_src %>/*.less','<%= css_src %>/**/*'],
            tasks: ['css'],
          },

          js: {
            files: ['<%= js_src %>/*.js', '<%= js_src %>/**/*.js', '<%= vendor_src %>/*.js', '<%= vendor_src %>/**/*.js'],
            tasks: ['jshint', 'concat:basic_and_extras', 'uglify:build'],
          },

          html: {
            files: ['<%= build %>/*.html', '<%= build %>/**/*.html'],
            // tasks: ['html'],
          },

          build: {
            files: ['Gruntfile.js'],
            tasks: ['concat:vendor', 'uglify:vendor'],
          }

      },


      jshint: {

        ignore_warning: {
          options: {
            '-W033': true,
            '-W099': true,
          },
          src: ['<%= js_src %>/*.js'],
        },

      },


      uglify: {
          options: {
            banner: '<%= meta.js.banner %>\n',
            mangle: false
          },
           build: {
            files: {
               '<%= js_build %>/app.min.js': ['<%= js_build %>/app.js'],
            },
          },
           vendor: {
            files: {
               '<%= js_build %>/vendor.min.js': ['<%= js_build %>/vendor.js'],
            },
          },
        },

      concat: {
          options:{
            separator: ';'
          },

          basic_and_extras: {
            src: ['<%= js_src %>/*.js'],
            dest: '<%= js_build %>/app.js',
          },

          vendor: {
            src: [
              '<%= vendor_build %>/bower_components/jquery/dist/jquery.js', // jQuery
              // '<%= vendor_build %>/bower_components/jquery-validation/dist/jquery.validate.js', // jQuery
              // '<%= vendor_build %>/bower_components/bootstrap/dist/js/bootstrap.min.js', // Bootstrap
              // '<%= vendor_build %>/bower_components/bootstrap-material-design/dist/js/material.js', // Material Bootstrap
              // '<%= vendor_build %>/bower_components/bootstrap-material-design/dist/js/ripples.js', // Material Bootstrap
              // '<%= vendor_build %>/bower_components/slick-carousel/slick/slick.js', // slick
            ],
            dest: '<%= js_build %>/vendor.js',
          },
      },

      // CSS Concat
      // concat_css: {
      //   options: {},
      //   files: {
      //     '<%= css_build %>/vendor.css': ['<%= vendor_src %>/bootstrap/dist/css/bootstrap.min.css', '<%= vendor_src %>/slick-carousel/slick/slick.css'],
      //   },
      // },

      // CSSmin Config
      cssmin: {
          options: {
              banner: '<%= meta.css.banner %>\n',
              keepSpecialComments: 0
          },
          compress: {
            files: {
              '<%= css_build %>/vendor.min.css': [ '<%= css_build %>/vendor.css' ],
              '<%= css_build %>/app.min.css': [ '<%= css_build %>/app.css' ],
            }
          }
      },

      cmq: {
        GroupMediaQuerys: {
           files: {
            '<%= css_build %>': ['<%= css_build %>/*.css']
          }
        }
      },


      // Tarefa connect
      // connect: {
      //     server: {
      //         options: {
      //             port: 9000,
      //             base: "_public/",
      //             hostname: "localhost",
      //             livereload: true,
      //             open: true
      //         }
      //     }
      // }

      browserSync: {
        dev: {
          options: {
            proxy: '<%= proxy_url %>',
            files : [
              '<%= build %>/css/*.css',
              '<%= build %>/js/*.js',
              '<%= build %>/**/*.jpg',
              '<%= build %>/**/*.png',
              '<%= build %>/**/*.svg',
              '<%= build %>/**/*.html',
              '<%= build %>/**/*.php'
            ],
            watchTask: true,
            ghostMode: {
              clicks: true,
              scroll: true,
              links: true,
              forms: true
            }
          }
        }
      }

    });

    grunt.registerTask( 'w', ['browserSync','watch'] );
    grunt.registerTask('css', ['less','cmq','cssmin']);
    grunt.registerTask('js', ['jshint', 'concat', 'uglify']);

    grunt.registerTask('default', ['connect', 'watch', 'less', 'cmq', 'cssmin', 'jshint', 'concat', 'uglify']);


};