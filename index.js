test('jsen', (schema, input) => {
  const jsen = require('jsen');
  const validate = jsen(schema);
  const isValid = validate({});
  const errors = validate.errors;
  return {isValid, errors};
});

test('ajv', (schema, input) => {
  const Ajv = require('ajv');
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const isValid = validate(input);
  return {isValid, errors: validate.errors};
});

test('djv', (schema, input) => {
  const Djv = require('djv');
  const djv = new Djv();
  djv.addSchema('test', schema);
  const result = djv.validate('test', input);
  return {isValid: result === undefined, errors: result};
});

test('jsonschema', (schema, input) => {
  const Validator = require('jsonschema').Validator;
  const v = new Validator();
  const result = v.validate(input, schema);
  return {isValid: result.valid, errors: result.errors};
});

test('is-my-json-valid', (schema, input) => {
  const validator = require('is-my-json-valid');
  const validate = validator(schema);
  const isValid = validate(input);
  return {isValid, errors: validate.errors};
});

test('tv4', (schema, input) => {
  const tv4 = require('tv4');
  const isValid = tv4.validate(input, schema);
  return {isValid, errors: tv4.error};
});

test('jayschema', (schema, input) => {
  const JaySchema = require('jayschema');
  const js = new JaySchema();
  const errors = js.validate(input, schema);
  return {isValid: errors == null, errors};
});

test('z-schema', (schema, input) => {
  const ZSchema = require('z-schema');
  const validator = new ZSchema();
  const isValid = validator.validate(input, schema);
  const errors = validator.getLastErrors();
  return {isValid, errors};
});

test('schema', (schema, input) => {
  const myEnv = require('schema')('envIdentifier', {});
  const validator = myEnv.Schema.create(schema);
  const result = validator.validate(input);
  return {isValid: !result.isError(), errors: result};
});

test('json-gate', (schema, input) => {
  const createSchema = require('json-gate').createSchema;
  const validator = createSchema(schema);
  try {
    validator.validate(input);
    return {isValid: true};
  } catch (errors) {
    return {isValid: false, errors};
  }
});

test('json-schema', (schema, input) => {
  const validator = require('json-schema');
  const result = validator(input, schema);
  return {isValid: result.valid, errors: result.errors};
});

function test (name, validate) {
  const contract = require('goodeggs-pick-contracts/domain_events/provider')['supplyDemandPairs.updatedForMarketProduct'];

  process.stdout.write(`LIBRARY: ${name}\n`);

  const invalid = validate(contract, {});
  if (invalid.isValid === false) {
    process.stdout.write(`test passed with invalid schema!\n${printErrors(invalid.errors)}\n\n`);
  } else {
    process.stdout.write(`test FAILED (validated invalid schema)\n\n`);
  }
}

function printErrors (errors) {
  const _ = require('lodash');
  const errorsAsString = JSON.stringify(errors, null, 2);
  if (errorsAsString.length > 500) {
    const truncated = `${errorsAsString.substr(0, 300)}... (${errorsAsString.length - 300} more characters in message.)`;

    if (_.isArray(errors))
      return `Long error! JSON array with ${errors.length} elements.\n${truncated}`
    return `Long error!\n${truncated}`;
  }
  return errorsAsString;
}
