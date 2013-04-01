module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*!\n * <%= pkg.name %>.js\n *\n * Copyright <%= grunt.template.today("yyyy") %> Branden Wiegand\n * Licensed under the MIT license.\n * https://github.com/wiegand/respondto.js/blob/master/LICENSE-MIT\n */\n'
			},
			build: {
				src: 'src/<%= pkg.name %>.js',
				dest: 'build/<%= pkg.name %>.min.js'
			}
		},
		jshint: {
			all: ['src/*.js'],
			options: {
				camelcase : true,
				quotmark : 'single',
				maxparams : 3,
				loopfunc : false,
				unused : true,
				white : false,
				indent : 1,
				onevar : true,
				onecase : false,
				immed : true,
				debug : false,
				evil : false,
				strict : true,
				multistr : false,
				laxbreak : false,
				globalstrict : false,
				supernew : false,
				laxcomma : false,
				asi : false,
				es5 : false,
				scripturl : false,
				withstmt : false,
				bitwise : true,
				eqeqeq : true,
				shadow : false,
				expr : false,
				noarg : true,
				newcap : true,
				forin : true,
				regexdash : false,
				node : false,
				eqnull : false,
				browser : true,
				iterator : false,
				undef : true,
				latedef : true,
				nonstandard : false,
				trailing : true,
				jquery : true,
				boss : false,
				nonew : true,
				funcscope : false,
				regexp : true,
				lastsemic : false,
				smarttabs : true,
				devel : false,
				esnext : false,
				sub : false,
				curly : true,
				prototypejs : false,
				proto : false,
				plusplus : false,
				noempty : false
			}
		},
		cafemocha: {
			src: 'test/test.js',
			options: {
				ui: 'tdd',
				require: ['test/test-setup.js', 'src/<%= pkg.name %>.js']
			}
		}
	});

	// Load plugins
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-cafe-mocha');

	// Default task(s).
	grunt.registerTask('test', ['jshint', 'cafemocha']);
	grunt.registerTask('build', ['test', 'uglify']);
	grunt.registerTask('default', ['build']);
};