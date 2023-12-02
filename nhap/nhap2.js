"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function importNode(checkboxString) {
    return __awaiter(this, void 0, void 0, function* () {
        let importComponent = yield figma.importComponentByKeyAsync(checkboxString);
        let x = importComponent.createInstance();
    });
}
function processCheckboxArray(Strings) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let checkboxString of Strings) {
            yield importNode(checkboxString);
        }
    });
}
figma.showUI(__html__, { title: 'Banner Ads Generator', height: 504, width: 336 });
figma.ui.onmessage = msg => {
    if (msg.type === 'create-banner-ad') {
        const nodes = [];
        for (let i = 0; i < msg.selectedOptions.length; i++) {
            const nodeKey = msg.selectedOptions[i];
            const horizontal = 0;
            function test() {
                return __awaiter(this, void 0, void 0, function* () {
                    const framed = (yield figma.importComponentByKeyAsync(nodeKey)).clone();
                    console.log(framed);
                    framed.x = i * 300;
                    figma.currentPage.appendChild(framed);
                    nodes.push(framed);
                });
            }
            test();
            figma.currentPage.selection = nodes;
            figma.viewport.scrollAndZoomIntoView(nodes);
        }
    }
    // figma.closePlugin();
};
// function activateWhenUserClicksSubmit(msg){
//   const {keyword, hex} = msg;
//   const currentPage = figma.currentPage;
//   function testForKeyWord(node){
//       const isKeyword = new RegExp(keyword, 'gi');
//       if(node.name){
//           return isKeyword.test(node.name);
//       }
//       return false;
//   }
//const selectedNode = figma.currentPage.selection[0];
const imageUrl = "https://cdn.osxdaily.com/wp-content/uploads/2022/10/macOS-Ventura-wallpaper-2.jpg";
const nodes = currentPage.findAll(testForKeyWord);
for (const node of nodes) {
    node.fills = [{
            type: "IMAGE",
            imageHash: figma.createImage(imageUrl).hash,
            scaleMode: "FIT",
        }];
}
