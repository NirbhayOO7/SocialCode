// gulp is used to reduce the size of assets/static files which makes our webpage faster to load, this is done by removing the unused spaces in our static files or by compressing the files. 
// Gulp is also used to keep the track of any file modification done in our static files by the help of rev module, if there is no modification in css files then browser will simply pick the css files from cache.

// we have different-different gulp modules inside the gulp to do the above mentioned thing like for css we have gulp-sass, then we different module for js and different module for images too.

const gulp = require('gulp');
const sass = require('gulp-sass')(require('node-sass'));
const cssnano = require('gulp-cssnano');
const imagemin = require('gulp-imagemin');  //issue
const uglify = require('gulp-uglify-es').default;
const del = require('del');                             //issue
const rev = require('gulp-rev');

//final code for css is this.
gulp.task('css', (done) => {        // gulp.task will create a task named css which job is to minify the css, rev it and manifest it.
    console.log('Minifying CSS');
    gulp.src('./assets/sass/**/*.scss')                    //  ** indicates any folder & *.scss indicates any file which have .scss format.
    .pipe(sass())                               // with the help of sass() we will first convert the scss files to css and save in dest folder ../assets.css
    .pipe(cssnano())                            //cssnano is an inbuilt module of gulp which will minify css
    .pipe(gulp.dest('./assets.css'));
    
    console.log('Minified CSS');
    gulp.src('./assets/**/*.css')
    .pipe(rev())                                         //this function will add a unique number to src('../assets/**/*.css') files each time when we modify the css and then save it to dest('../public/assets'). 
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({                              // manifest function will create a map(key,value) like structure for each rev(revised) files.
        cwd:'public',
        merge: true
    })).pipe(
        gulp.dest('./public/assets')
    );
    done();
});

gulp.task('js', (done) =>{
    console.log('Minifying js...');
    gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

gulp.task('images', (done) =>{
    console.log('compresssing images');

    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

// empty the public/assets directory
gulp.task('clean:assets', (done)=>{
    del.sync('./public/assets');
    done();
});

gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'images'), function(done){
    console.log('Building assets');
    done();
});

// while running gulp build the js task is not creating rev-manifest for js. So we have to manually run the gulp js