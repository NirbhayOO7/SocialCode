const queue = require('../config/kue');  // this will create the queue for the jobs
const resetPasswordMailer = require('../mailers/resetpassword_mailer');


queue.process('email_access_token', function(job, done){
    console.log('email_access_token worker is processing the job', job.data);
    resetPasswordMailer.resetPassword(job.data);

    done();
});