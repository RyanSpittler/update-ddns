var config = require("./config.json");
var request = require("request");
var crypto = require("crypto");

// Entrypoint for AWS Lambda
exports.handler = function(event, context) {
  console.log("[EVENT] ", event);

  // basic auth
  if(!isValidAuth(event.secret, event.key)) {
    return context.fail('Unauthorized request. Check authentication credentials.');
  }

  // get ip address
  var ip = event.sourceIP;
  var password = config.dynu.password;
  var hash = crypto.createHash("md5").update(password).digest("hex");
  var domain = config.dynu.domainName;
  var url = config.dynu.url + "?hostname=" + domain + "&myip=" + ip + "&password=" + hash
  var options = {url};

  request(options, function(err, response, body) {
    if (err) {
      console.log("[FAIL] Unable to set IP address for DDNS: ", reason);
      context.fail("Unable to set IP address. Please troubleshoot.")
    } else {
      context.succeed(body)
    } 
  })
};

function isValidAuth(secret, key) {
  return secret && key && secret === config.auth.secret && key === config.auth.key;
}
