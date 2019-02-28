/**
 * 
 */

var AssistantV1 = require('watson-developer-cloud/assistant/v1'); // watson sdk

const DEFAULT_VERSION = '2018-07-10';
const SKILLS = JSON.parse(process.env.ASSISTANT_SKILLS);
const DEFAULT_SKILL = process.env.ASSISTANT_DEFAULT_SKILL;

function AssistantService(){
	this.assistant = new AssistantV1({
		  version: DEFAULT_VERSION
		});
	this.skill = SKILLS[DEFAULT_SKILL]
	console.log("Using Skill",this.skill.name); 
}

AssistantService.prototype.switch_skill = function (skill_id){
	if(SKILLS[skill_id]){ 
		this.skill = SKILLS[skill_id];
		return true;
	} else  return false;
}

AssistantService.prototype.message = function(input, context, callback) {
	

	console.log("AsistanService received message",input,context);
	//input checks
	if (!this.skill) {
		var err = new Error("Waston Assistant skills are missing");
		callback(err,null);
	}
	
	  var payload = {
			    workspace_id: this.skill.workspace_id,
			    context: context || {},
			    input: input || {}
			  };
	
	return this.assistant.message(payload, function(err, data) {
console.log("AssistantService response",data," ERROR: ",err);
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

console.log("update msg");
  if (!response.output) {
    response.output = {};
  }
  //Placeholder to update response from assistant before sending it back 
  return response;
}

module.exports = AssistantService;
