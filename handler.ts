import { APIGatewayEvent, Callback } from "aws-lambda";
import JoiBase from "@hapi/joi";
import JoiDate from "@hapi/joi-date";
import * as dotenv from "dotenv";

import { executeQuery } from './util';

const Joi = JoiBase.extend(JoiDate);

dotenv.config();

interface SuccessResponse {
  statusCode: number;
  body: string;
}

interface ErrorResponse extends Error {
  statusCode: number;
  message: string;
}

//Check for designer role permission

export const create = async (event: APIGatewayEvent, _, callback: Callback) => {
  try {
    const token = event.headers["Authorization"];

    const userId = getUserDataFromToken(token);

    const body = JSON.parse(event.body);

    const payload = { ...body, owner: userId };

    const schema = Joi.object()
      .options({ abortEarly: false })
      .keys({
        name: Joi.string().max(199).required(),
        objective: Joi.string().required(),
        sponsor: Joi.string(),
        dueDate: Joi.date().format("MM/DD/YYYY"),
        protocols: Joi.array().items(Joi.string()),
        phase: Joi.string(),
        compounds: Joi.string().max(199),
        therapeuticAreas: Joi.array(),
        owner: Joi.number(),
      });

    const valid = await schema.validate(payload);
    const listOfErrorMsgs = valid.error.details.map((detail) => detail.message);

    const response: SuccessResponse = {
      statusCode: 200,
      body: JSON.stringify({
        message: "create project API!",
        errors: listOfErrorMsgs,
        valid
      }),
    };

    callback(null, response);
  } catch (e) {
    const error: ErrorResponse = {
      name: "Unknown error",
      statusCode: 400,
      message: e,
    };

    callback(error, null);
  }
};

const getUserDataFromToken = (token: string) => {
  return 1;
};
