var path = require('path');
//
// Simple plugin to load other plugins via config.get('plugins')
//
exports.name = 'pluggable';
function fetchPlugin(pluginPath) {
   try {
      pluginPath = require.resolve(pluginPath);
   }
   catch (e) {
      pluginPath = path.resolve(__dirname, pluginPath);
   }
   return require(pluginPath);
}

exports.attach = function () {
   var app = this;
   //
   // Grab all of our plugins to load
   //
   var plugins = app.config.get('plugins');
   //
   // Figure out the type (may vary due to things like optimist's argv)
   // .use it and any value attached to it
   //
   if (Array.isArray(plugins)) {
      plugins.forEach(function(pluginPath) {
         app.use(fetchPlugin(pluginPath));
      });
   }
   else if (typeof plugins === 'string') {
         app.use(fetchPlugin(plugins));
   }
   else if (typeof plugins === 'object') {
      Object.keys(plugins).forEach(function (pluginPath) {
         app.use(fetchPlugin(pluginPath), plugins[pluginPath]);
      });
   }
}