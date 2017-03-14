var moment = require('moment');
var util = require('util');
var jsdom = require("jsdom");
var schedule = require('node-schedule');
var fs = require("fs");
var async = require('async');

// 执行 git 命令
function git_add_commit_push(data, filename) {
    var exec = require('child_process').exec;
    var cmd_git_add = util.format('git add %s', filename);
    var cmd_git_commit = util.format('git commit -m "%s"', moment().format('YYYY-MM-DD'));
    var cmd_git_push = 'git push -u origin master';

    var cmd_git_list = [cmd_git_add, cmd_git_commit, cmd_git_push];

    async.eachSeries(cmd_git_list, function (item, callback) {
        // console.log(item + " ====> " + item);
        // git add 
        exec(item, function (err, stdout, stderr) {
            if (err) {
                console.log('git add ' + stderr);
            } else {
                // console.log(err);
                // console.log(stdout);
                console.log(stderr);

                callback(err, stdout, stderr);
            }
        });
    }, function (err) {
        console.log("err: " + err);
    });
}

//检测文件或者文件夹存在 nodeJS
function fsExistsSync(path) {
    try {
        fs.accessSync(path, fs.F_OK);
    } catch (e) {
        return false;
    }
    return true;
}

// 根据时间创建目录
function createDir() {
    var mddir = __dirname + "/" + moment().format('YYYY');
    if (!fsExistsSync(mddir)) {
        fs.mkdir(__dirname + "/" + moment().format('YYYY'), function (err) {
            if (err) {
                return console.error(err);
            }
            console.log(__dirname + "/" + moment().format('YYYY') + " 目录创建成功");
        });
    } else {
        console.log("文件夹已存在");
    }
}

// 创建 Markdown 文件
function createMarkdown(date, filename) {
    fs.writeFile(filename, '### ' + date + '\n', function (err) {
        if (err) {
            return console.error(err);
        }
    });
}

// 抓取页面信息
function scrape(languages, filename) {
    async.eachSeries(languages, function (item, callback) {
        // console.log(item + " ====> " + item);
        jsdom.env({
            url: util.format('https://github.com/trending/%s', item),
            scripts: ['http://code.jquery.com/jquery.js'],
            done: function (err, window) {
                var $ = window.$;

                // 文件追加
                fs.appendFile(filename, util.format('\n#### %s\n', item), function (err) {
                    if (err) {
                        return console.error(err);
                    }
                });

                console.log('github trending parser start');

                $('ol.repo-list li').each(function () {
                    var title = $(this).find('h3 a').text().trim();
                    var owner = $(this).find('span.prefix').text().trim();
                    var description = $(this).find('p.col-9').text().trim();
                    var url = $(this).find('h3 a').attr('href').trim();
                    url = 'https://github.com' + url;

                    var line = util.format('* [%s](%s):%s\n', title, url, description);

                    fs.appendFile(filename, line, function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                });

                console.log('github trending parser end');

                setTimeout(function () {
                    callback(err, window);
                }, 20000);
            }
        });
    }, function (err) {
        console.log("err: " + err);
    });
}

// 定时任务
function job() {
    var strdate = moment().format('YYYY-MM-DD');
    var stryear = moment().format('YYYY');
    var filename = util.format('%s/%s.md', stryear, strdate);

    createDir();

    createMarkdown(strdate, filename);

    var languages = ['java', 'vue', 'kotlin', 'javascript', 'css'];

    // 使用async处理异步问题
    async.series([
        function (callback) {
            scrape(languages, filename);
            setTimeout(function () {
                callback(null, 'scrape');
            }, 180000);
        },
        function (callback) { git_add_commit_push(strdate, filename), callback(null, 'git_add_commit_push'); }
    ], function (err, results) {
        console.log('err: ' + err);
        console.log('results: ' + results);
    });
}

// * 21 * * *
// * 18 * * *
// 50 11 * * *
// 30 * * * * *
var j = schedule.scheduleJob('* 21 * * *', function () {
    console.log('执行任务' + moment().format('YYYY-MM-DD HH:mm:ss'));
    job();
});