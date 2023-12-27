type Job = {
	id: string
	status: null | 'queued' | 'working' | 'complete' | 'failed' | 'interrupted' // https://github.com/utgarda/sidekiq-status
}

type GetJob = (id: string) => Promise<Response<Job>>
