import pino from 'pino';

// create pino logger
const logger = pino({
  //level: 'trace',
  level: 'info',
  base: {
    env: process.env.NODE_ENV,
  },
  ...(process.env.NODE_ENV !== 'production' && {
    transport: {
      target: 'pino-pretty',
      //target: 'pino/file',
      options: {
        colorize: true,
        //destination: `./app.log`,
      },
    },
  }),
});

export default logger;
