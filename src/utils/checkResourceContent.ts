import express from "express";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";

export function checkResourceContent<T>(resource: T) {
    if (!resource) {
        throw catchError(StatusCodes.NOT_FOUND, "There is no resource to be found.");
    }
}