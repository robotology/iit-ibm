/**
 * 
 */

var AssistantV1 = require('watson-developer-cloud/assistant/v1'); // watson sdk

const DEFAULT_VERSION = '2018-07-10';
const DEFAULT_WORKSPACE = process.env.WORKSPACE_ID || '<workspace-id>';

let assistant;

function AssistantService(){
	assistant = new AssistantV1({
		  version: DEFAULT_VERSION
		});
}

AssistantService.prototype.message = function(input,context, callback) {
	var workspace = DEFAULT_WORKSPACE;

	//input checks
	if (!workspace || workspace === '<workspace-id>') {
		var err = new Error("Waston Assistant workspace is missing");
		callback(err,null);
	}
	
	  var payload = {
			    workspace_id: workspace,
			    context: context || {},
			    input: input || {}
			  };
	
	return assistant.message(payload, function(err, data) {
		if (err) {
			callback(err, data);
		} else {
			callback(err, updateMessage(payload, data));
		}

	});
};

/**
 * Updates the response text using the intent confidence
 * 
 * @param {Object}  input The request to the Assistant service
 * @param {Object} response The response from the Assistant service
 * @return {Object} The response with the updated message
 */
function updateMessage(input, response) {
  if (!response.output) {
    response.output = {};
  }
  //Placeholder to update response from assistant before sending it back 
  return response;
}

module.exports = AssistantService;