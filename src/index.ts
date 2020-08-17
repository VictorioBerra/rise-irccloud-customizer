import * as Joi from 'joi';

import OwnixIrcCloudRiseConfiguration from "./OwnixIrcCloudRiseConfiguration";
import ownixIrcCloudRiseConfigurationSchema from "./ownixIrcCloudRiseConfigurationSchema";

const ownixIrcCloudRiseConfigurationStringID = "risev1";
const ownixIrcCloudRiseConfigurationString : string = localStorage.getItem(ownixIrcCloudRiseConfigurationStringID);
const ownixIrcCloudRiseConfiguration = createOwnixIrcCloudRiseConfiguration(JSON.parse(ownixIrcCloudRiseConfigurationString === null ? "{}" : ownixIrcCloudRiseConfigurationString));

console.debug(`Loaded configuration for ${ownixIrcCloudRiseConfigurationStringID}`, ownixIrcCloudRiseConfiguration);

var style = document.createElement('style');
document.head.appendChild(style);

if (ownixIrcCloudRiseConfiguration.customHighlightColorEnabled) {
    applyCSSColor(ownixIrcCloudRiseConfiguration.customHighlightColorValue, style);
}

const checkboxFormElement = document.querySelector('.checkboxForm');

// <div class="chat-colors">
const chatColorHeadingElement = CreateElementWithText("p", "Chat Colors");

// <div class="chat-colors">
//   <label for="highlighttextcolor"><input type="checkbox"> highlight text color:</label>
//   <input type="color" id="highlighttextcolor" name="highlighttextcolor" value="#ff0000">     
// </div>
const chatColorContainerElement = document.createElement("div");
chatColorContainerElement.classList.add("chat-colors");

const chatColorPickerLabelElement = document.createElement("label");
chatColorPickerLabelElement.setAttribute('for', 'highlighttextcolorenabled');

const colorPickerElement = document.createElement("input");
colorPickerElement.setAttribute('type', 'color');
colorPickerElement.setAttribute('name', 'highlighttextcolor');
colorPickerElement.setAttribute('value', ownixIrcCloudRiseConfiguration.customHighlightColorValue);
colorPickerElement.style.display = "block";
colorPickerElement.style.margin = ".5em";
colorPickerElement.addEventListener("change", () => {
    if (ownixIrcCloudRiseConfiguration.customHighlightColorEnabled) {
        applyCSSColor(colorPickerElement.value, style);
    }
    saveColorChoice(colorPickerElement.value);
});

const colorPickerEnabledCheckboxElement = document.createElement("input");
colorPickerEnabledCheckboxElement.setAttribute('type', 'checkbox');
colorPickerEnabledCheckboxElement.setAttribute('id', 'highlighttextcolorenabled');
if(ownixIrcCloudRiseConfiguration.customHighlightColorEnabled) {
    colorPickerEnabledCheckboxElement.setAttribute('checked', "checked");
}
colorPickerEnabledCheckboxElement.style.marginRight = '.5em';
colorPickerEnabledCheckboxElement.addEventListener("click", () => {
    ownixIrcCloudRiseConfiguration.customHighlightColorEnabled = !ownixIrcCloudRiseConfiguration.customHighlightColorEnabled;
    if (ownixIrcCloudRiseConfiguration.customHighlightColorEnabled) {
        applyCSSColor(colorPickerElement.value, style);
    } else {
        clearCSSColor(style);
    }
    saveColorChoice(colorPickerElement.value);
});
chatColorPickerLabelElement.appendChild(colorPickerEnabledCheckboxElement);
const labelTextNode = document.createTextNode("highlight text color");
chatColorPickerLabelElement.appendChild(labelTextNode);

chatColorContainerElement.appendChild(chatColorPickerLabelElement);
chatColorHeadingElement.style.margin = "10px";
chatColorHeadingElement.style.left = "0";
chatColorContainerElement.appendChild(colorPickerElement);

// Add to DOM
checkboxFormElement.after(chatColorContainerElement);
checkboxFormElement.after(chatColorHeadingElement);

function createOwnixIrcCloudRiseConfiguration(configuration: Partial<OwnixIrcCloudRiseConfiguration> = {}) : OwnixIrcCloudRiseConfiguration {
    const { error, value } = ownixIrcCloudRiseConfigurationSchema.validate(configuration) as { error?: Joi.ValidationError, value: OwnixIrcCloudRiseConfiguration };    
    if (error) {
      throw error;
    }
    return value;
 }

function saveColorChoice(color: string) {    
    ownixIrcCloudRiseConfiguration.customHighlightColorValue = color;
    localStorage.setItem(ownixIrcCloudRiseConfigurationStringID, JSON.stringify(ownixIrcCloudRiseConfiguration));
    console.debug(`Saved configuration for ${ownixIrcCloudRiseConfigurationStringID}`);
}

function applyCSSColor(color: string, styleElement: HTMLStyleElement): void {
    clearCSSColor(styleElement);
    console.debug(`Setting color to: ${color}`);
    styleElement.sheet.insertRule(`.highlight { color: ${color} !important }`);
}

function clearCSSColor(styleElement: HTMLStyleElement) {
    styleElement.sheet.rules;
    for (let i = 0; i < styleElement.sheet.rules.length; i++) {
        styleElement.sheet.deleteRule(i);
    }
}

function CreateElementWithText(elementName: string, elementTextContent: string): HTMLElement {
    const newElement = document.createElement(elementName);
    const textNode = document.createTextNode(elementTextContent);
    newElement.appendChild(textNode);
    return newElement;
}