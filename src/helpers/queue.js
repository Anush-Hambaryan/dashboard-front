
export class JobQueue {
	constructor() {
	  this.jobs = {};
	  this.head = 0;
	  this.tail = 0;
	}
  
	get length() {
	  return this.tail - this.head;
	}
  
	enqueue(job) {
	  this.jobs[this.tail] = job;
	  this.tail++;
	}
  
	dequeue() {
	  if (this.length) {
		const job = this.jobs[this.head];
		delete this.jobs[this.head];
		this.head++;
		return job;
	  }
	  return null;
	}

}