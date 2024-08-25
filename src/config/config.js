const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');


dotenv.config({ path: path.join(__dirname, '../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    NODE_ENV_PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),
    OPENAI_API_KEY : Joi.string().required().description("OpenAi API key"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// console.log(envVars.NODE_ENV , envVars.MONGODB_URL)

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.NODE_ENV_PORT,
  openaiapikey: envVars.OPENAI_API_KEY,
  // Set mongoose configuration
  mongoose: {
    url: envVars.MONGODB_URL ,
    options: {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    },
  },
 
};