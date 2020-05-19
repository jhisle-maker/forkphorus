'use strict';

// Common helpers for index.html, app.html, embed.html etc.
// This should be loaded after phosphorus.dist.js

// @ts-ignore
window.uiCommon = (function() {
  // @ts-ignore
  var DEFAULT_OPTIONS = P.player.Player.DEFAULT_OPTIONS;
  // "truthy" values
  var TRUE = ['true', 'yes', 'on', '1'];
  // "falsey" values
  var FALSE = ['false', 'no', 'off', '0'];

  function parseSearch(handler) {
    location.search.substr(1).split('&').forEach(function(p) {
      var parts = p.split('=');
      if (parts.length < 1) {
        return;
      }
      handler(parts[0], parts[1] || '');
    });
  }

  function parseOptions() {
    var playerOptions = {};
    var projectId = null;

    parseSearch(function(key, value) {
      function setPlayerOption(name, value) {
        // Check that this option exists
        if (!DEFAULT_OPTIONS.hasOwnProperty(name)) {
          throw new Error('Unknown option: ' + name);
        }
  
        // Get the default value and type
        var defaultValue = DEFAULT_OPTIONS[name];
        var expectedType = typeof defaultValue;
  
        // Convert the input value to the correct type
        if (expectedType === 'number') {
          value = +value;
          if (Number.isNaN(value)) {
            console.warn('Value for ' + name + ' is an invalid number, skipping.');
            return;
          }
        }
  
        if (expectedType === 'boolean') {
          value = value.toLowerCase();
          if (TRUE.indexOf(value) > -1) {
            value = true;
          } else if (FALSE.indexOf(value) > -1) {
            value = false;
          } else {
            console.warn('Value for ' + name + ' is an invalid boolean(-like), skipping.');
            return;
          }
        }
  
        playerOptions[name] = value;
      }
  
      function setPlayerFlag(name, value) {
        setPlayerOption(name, value || 'true');
      }
  
      switch (key) {
        case 'fps':
          setPlayerOption('fps', value);
          break;
        case 'username':
          setPlayerOption('username', value);
          break;
        case 'turbo':
          setPlayerFlag('turbo', value);
          break;
        case 'imageSmoothing':
          setPlayerFlag('imageSmoothing', value);
          break;
        case 'id':
          projectId = value;
          break;
      }
    });

    // Check hash for project ID if not specified in search string
    if (projectId === null) {
      var hash = location.hash.substr(1);
      if (/^\d+$/.test(hash)) {
        projectId = hash;
      }
    }

    return {
      projectId: projectId,
      playerOptions: playerOptions,
    };
  }

  return {
    parseSearch: parseSearch,
    parseOptions: parseOptions,
  };
}());
