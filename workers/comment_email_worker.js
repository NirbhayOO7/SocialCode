const queue = require('../config/kue');  // this will create the queue for the jobs
const commentsMailer = require('../mailers/comments_mailer');

queue.process('emails', function(job, done){   // emails is the type of jobs which will be queued in this queue

    //so process is a task of Worker, which will keeps checking if any new jobs(emails) is come into the queue if yes, then perfom the function defined as callback in the .process function.

    // console.log('emails worker is processing a job', job.data);

    commentsMailer.newComment(job.data);

    done();
});
