var { ToggleButton } = require("sdk/ui/button/toggle");
var panels = require("sdk/panel");
var self = require("sdk/self");
var { setInterval } = require("sdk/timers");
var Request = require("sdk/request").Request;



var button = ToggleButton({
  id: "my-button",
  label: "my button",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
	onChange: handleChange,
  });

function changed(state) {
  button.badge = state.badge + 1;
  if (state.checked) {
    button.badgeColor = "#AA00AA";
  }
  else {
    button.badgeColor = "#00AAAA";
  }
}

var panel = panels.Panel({
  contentURL: self.data.url("panel.html"),
  onHide: handleHide
});

function handleChange(state) {
  if (state.checked) {
    panel.show({
      position: button
    });
  }
}

function handleHide() {
  button.state('window', {checked: false});
}

setInterval(function() {
	var ratpStatus = Request({
		url: "http://api-ratp.pierre-grimaud.fr/data/trafic/rer",
		onComplete: function (response) {
			console.log(response.json.trafic);
			// var json = JSON.parse('{"trafic":"perturbation","perturbations":[{"RER A":"08\/10\/15, 17:26, le trafic reprend progressivement (voyageur sur la voie)"}]}');
			var json = response.json;
			if (json.trafic === 'perturbation') {
			
			console.log(json.perturbations);
				for  (i = 0; i < json.perturbations.length; i++) {
					switch (Object.keys(json.perturbations[i])[0]) {
						case "RER A":
							button.badge = "A";
							button.badgeColor = "#AA0000";
							break;
						case "RER B":
							button.badge = "B";
							button.badgeColor = "#0000AA";
							break;
						case "RER C":
							button.badge = "C";
							button.badgeColor = "#AAAA00";
							break;
						case "RER D":
							button.badge = "D";
							button.badgeColor = "#00AA00";
							break;
						case "RER @":
							button.badge = "E";
							button.badgeColor = "#EEA9B8";
							break;
						default:
							button.badge = "*";
							button.badgeColor = "#AA0000";
							break;
						}
				}
			} else {
				button.badge = null;
			}
		}
	});

  ratpStatus.get();
  
}, 60*1000) // do something every 1 sec
