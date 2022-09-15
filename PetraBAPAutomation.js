// ==UserScript==
// @name         BetraBAP Automation
// @namespace    https://natha.my.id/
// @version      0.1
// @description  Helper utilities for PetraBAP
// @author       Nathan Adhitya
// @match        https://sim.petra.ac.id/petrabap/index.php?r=umum/BaaAbsenKuliah/update*
// @require      file:///H:/PetraBAPAutomation/PetraBAPAutomation.js
// @run-at       document-idle
// @grant        none
// ==/UserScript==

// TODO: Cleanup this absolute mess. I did this in like idk... 3 hours?

console.log("PetraBAPAutomation UserScript is running!");

// Create the modal
const modal = $(`
<div id="automationModal" class="modal" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Automation</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>
          Format: NRP, NRP, NRP, ... (case-insensitive)
        </p>
        <div class="form-group">
          <label for="automationTextarea">Data</label>
          <textarea class="form-control" id="automationTextarea" rows="5"></textarea>
        </div>
        <div id="automationResults" style="max-height: 10em; overflow: auto;">
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
`);
$("body").append(modal);

// Create the additional button.
const button = $(
  `<button 
    type="button" 
    class="btn btn-primary" 
    data-toggle="modal" 
    data-target="#automationModal">
    Automation
  </button>`
);

// show modal on click
button.on("click", (e) => {
  e.preventDefault();
  $("#automationResults").text("");
});

$("#baa-absen-kuliah-form > .floating > .floating_content > span:nth-child(2)").append(button);

function _x(STR_XPATH) {
  var xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
  var xnodes = [];
  var xres;
  while ((xres = xresult.iterateNext())) {
    xnodes.push(xres);
  }

  return xnodes;
}

// a function that clicks stuff for you.
/**
 *
 * @param {string} nrp
 * @param {string} state
 */
function clickNRP(nrp, state) {
  const toClick = $(
    _x(`//tr/td[2]/strong[text()="${nrp.toUpperCase()}"]/../../td[3]//label[contains(., "${state}")]/input`)
  );
  if (toClick.length == 0) {
    $("#automationResults").append(`${nrp} not found.<br />`);
  } else if (toClick.length > 1) {
    $("#automationResults").append(`${nrp} unexpected duplicate.<br />`);
  } else {
    toClick.trigger("click");
    toClick.prop("checked", true);
    $("#automationResults").append(`${nrp} done.<br />`);
  }
}

/**
 * process nrps from form to state
 * @param {string} state
 */
function process(state) {
  /** @type {string} */
  const val = $("#automationTextarea").val();
  const nrps = val
    .split("\n")
    .map((s) => s.split(","))
    .flat()
    .map((s) => s.trim());
  nrps.forEach((nrp) => {
    clickNRP(nrp, state);
  });
  $("#automationResults").append(`Finish`);
}

// add buttons, and make them do something
const markings = ["Hadir", "Alpa", "Sakit", "Ijin"];

const modalFooter = $("#automationModal .modal-footer");

markings.forEach((mark) => {
  $(`<button type="button" class="btn btn-primary">Mark ${mark}</button>`)
    .prependTo(modalFooter)
    .on("click", (e) => {
      process(mark);
    });
});
