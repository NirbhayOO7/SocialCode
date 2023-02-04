const kue = require('kue'); 
// Kue is a priority job queue backed by redis, built for node.js.
// Kue module help us to priortize the jobs which are urgent, this is done by the help of the queue dataStructures.
// Multiple queues are created for multiple types of jobs like if you want to sent otp there would be 1 queue for that there can be another queue for lets say for notification, emails which we sent to user once any action is perfomed by him. So we have to give priority to otp as its is urgent and there could be multiple user who are reuestin otp so we will use Kue to queue those otp jobs is 1 queue, notification in 1 queue and emails in 1 queue with priority of otp being the highest then notification then mails and etc. 
// kue.app.listen(4000); //if you want to use kue-dhashboard uncomment this

const queue = kue.createQueue();

module.exports = queue;