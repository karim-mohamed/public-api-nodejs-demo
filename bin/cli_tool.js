const api = require('../utils/api.js');
const yargs = require('yargs');
var robot = require("robotjs");
var schedule = require('node-schedule');

var screenshotsNum = 0

const argv = yargs
    .command('myself', 'List my user information', () => { }, async (argv) => {
        await api.initialize();
        const response = await api.request('v2/users/me', {
            method: 'GET',
            json: true,
        });
        const body = JSON.parse(response.body);
        console.log(body);
    })
    .command('organizations', 'List my organizations', () => { }, async (argv) => {
        await api.initialize();
        const response = await api.request('v2/organizations', {
            method: 'GET',
            json: true,
        });
        const body = JSON.parse(response.body);
        console.log(body);
    })
    .command('projects', 'List my projects', () => { }, async (argv) => {
        await api.initialize();
        const response = await api.request('/v2/organizations/9320/projects', {
            method: 'GET',
            json: true,
        });
        const body = JSON.parse(response.body);
        console.log(body);
    })
    .command('daily', 'List my projects', () => { }, async (argv) => {
        await api.initialize();
        const response = await api.request('/v2/organizations/9320/activities/daily?date[start]=2020-09-3&date[stop]=2020-09-4', {
            method: 'GET',
            json: true,
        });
        const body = JSON.parse(response.body);
        console.log(body);
    })
    .command('screens', 'List my screen shots', () => { }, async (argv) => {
        console.log('schedulling job');
        var rule = new schedule.RecurrenceRule();
        rule.second = [10, 20, 30, 40, 59];
        var j = schedule.scheduleJob(rule, async () => {
            console.log('new');
            await api.initialize();
            const response = await api.request('/v2/organizations/9320/screenshots?time_slot[start]=2020-09-5&time_slot[stop]=2020-09-6', {
                method: 'GET',
                json: true,
            });
            const body = JSON.parse(response.body);
            console.log(body.screenshots)
            const takenScreenNum = body.screenshots.filter(screen => screen.user_id === 949082).length
            console.log(takenScreenNum);

            if (screenshotsNum < takenScreenNum) {
                screenshotsNum = takenScreenNum;
                //Mouse and KeyboardControl
                robot.setMouseDelay(2);
                var twoPI = Math.PI * 2.0;
                var screenSize = robot.getScreenSize();
                var height = (screenSize.height / 2) - 10;
                var width = screenSize.width;
                robot.keyTap("pagedown")
                for (var x = 0; x < width; x++) {
                    y = height * Math.sin((twoPI * x) / width) + height;
                    robot.moveMouse(x, y);
                }
            }
        });

        console.log('Scheduled: ', j);
    })
    .demandCommand()
    .help()
    .alias('help', 'h')
    .argv;