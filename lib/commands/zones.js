"use strict";

exports.command = 'zones <command>';
exports.desc = 'Manage set of zones';

exports.builder = function (yargs) {
  return yargs.commandDir('zones_cmd');
};

exports.handler = {};