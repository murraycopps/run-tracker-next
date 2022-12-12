const dev = process.env.NODE_ENV !== 'production';

export const server = dev ? 'http://localhost:3000' : 'https://run-tracker-next-git-main-murraycopps.vercel.app';