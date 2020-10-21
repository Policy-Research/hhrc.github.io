# GULP/BUILD SETUP

## Dependencies

```
$ npm install
$ npm install gulp-cli@2.2.0 --global
```

## Tasks

### Build Assets

Will build the assets once, with production settings (minification, etc)

```
$ gulp build
```

### Serve and Watch Files

Will build files for development, start a browser-sync proxy server and watch for changes. Files will be injected or browser will reload on changes.


```
$ gulp serve
```
