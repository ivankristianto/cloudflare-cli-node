"use strict";

exports.command = 'firewall <command>';
exports.desc = 'Manage set of firewall rules';

exports.builder = function (yargs) {
  return yargs.commandDir('firewall_cmd');
};

exports.handler = {};