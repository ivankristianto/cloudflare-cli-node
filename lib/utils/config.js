"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRootApiURL = getRootApiURL;
exports.getAuthToken = getAuthToken;

function getRootApiURL() {
  return 'https://api.cloudflare.com/client/v4/';
}

function getAuthToken() {
  // return process.env.TOKEN;
  return 'jErfSv8ckIgVIZKBURBolRPceHaOQienrtvsMTtM';
}