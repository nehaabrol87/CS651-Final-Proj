module.exports = {
    src: {
        ts: ['app/**/*.ts',
        	'typings/**/*.ts'
        ],
        tslint: 'app/**/*.ts',
        dist: ['dist/*','dist/**/*'],
        html: [
            'app/**/*.html',
            '!app/jspm_packages/**/*.html',
            '!app/index.html'
        ],
        scss: 'app/scss/main.scss'
    }
};
