//import loopSelection from "./src/detachInstance";
//import {autoLayout} from "./src/autoLayout";





const svgFrameName = 'Logo - Vertical';
const imgFrameName = 'Key Visual Insert Here';



async function importByKey(key: string) {
  const importedFrame = await figma.importComponentByKeyAsync(key);
  //importedFrame.createInstance();
  return importedFrame;
}

const setLayoutProps = (frame: FrameNode | InstanceNode) => {
  frame.name = 'Frame Here';
  frame.layoutMode = "VERTICAL";
  frame.paddingTop = 10;
  frame.paddingRight = 10;
  frame.paddingBottom = 10;
  frame.paddingLeft = 10;
  frame.itemSpacing = 160;
};

const sortNodesByPosition = (nodes: any[] | readonly SceneNode[]) => {
  var result = nodes.map((x: any) => x);
  result.sort((current: { x: number; }, next: { x: number; }) => {
    return current.x - next.x;
  });
  return result.sort((current: { y: number; }, next: { y: number; }) => current.y - next.y);
};

function autoLayout(node: InstanceNode[]) {
  if (node.length > 1) {
    let parentConteiner = node[0].parent;
    let frame = figma.createFrame();
    if (parentConteiner) {
      const group = figma.group(node, parentConteiner);
      frame.x = group.x;
      frame.y = group.y;
      frame.backgrounds = [];
      frame.resize(group.width, group.height);
      setLayoutProps(frame);
      let sortedNodes = sortNodesByPosition(node);
      sortedNodes.map((item: SceneNode) => {
        frame.appendChild(item);
      });
      parentConteiner.appendChild(frame);
      figma.currentPage.selection = [frame];
    }
    return frame;
  }
  // else if (node.length === 1 && node[0].type === "INSTANCE") {
  //     console.log("Please select the master component");
  //     figma.notify("Please select the master component", { timeout: 4000 });
  // }
};

const loopDetachSelection = (importedInstance: any) => {
  importedInstance.forEach((node: SceneNode) => {
    if (node.type === "INSTANCE") {
      const detached = node.detachInstance();
      loopDetachSelection(detached.children);
    }
    if (node.type === "FRAME" || node.type === "GROUP" || node.type === "SECTION") {
      loopDetachSelection(node.children);
    }
  });
  return importedInstance;
};

async function replaceSVG(svgString: string, frameName: string) {
  //let root = figma.root;
  let sel = figma.currentPage.selection;
  //let sourceNode = null;
  const count = sel.length;
  let newSelection: FrameNode[] = [];
  const sourceNode = figma.createNodeFromSvg(svgString);
  const oldNodes: FrameNode[] = figma.currentPage.findAll(node => node.name === frameName && node.type === "FRAME") as FrameNode[]; //Consider changing as Instance or Component
  let newNode: FrameNode;
  oldNodes.map(async function (node, index) {
    newNode = sourceNode.clone();
    newNode.x = node.x
    newNode.y = node.y;
    newNode.name = node.name;
    //rescale node
    //resetScale(newNode);
    let parent = node.parent as FrameNode; //Consider changing as Instance or Component
    const scaleX = parent.width / newNode.width;
    const scaleY = parent.height / newNode.height;
    const scale = Math.min(scaleX, scaleY);
    newNode.resize(newNode.width * scale, newNode.height * scale);
    console.log(scale);
    const centerX = (node.width - newNode.width) / 2;
    const centerY = (node.height - newNode.height) / 2;
    newNode.x = node.x + centerX;
    newNode.y = node.y + centerY;
    if (parent) {
      parent.insertChild(0, newNode);
      node.remove();
    }
    console.log(newNode.name);
  })
  sourceNode.remove();
}

async function uploadImageToFrame(frameName: string, imageFile: Uint8Array) {
  // const nodes = figma.currentPage.findAll(node => node.name === frameName &&  node.type ==="INSTANCE");
  const nodes = figma.currentPage.findAll(node => node.name === frameName && (node.type === "FRAME" || node.type === "RECTANGLE" || node.type === "COMPONENT" || node.type === "COMPONENT_SET" || node.type === "INSTANCE"));

  for (const node of nodes) {
    if (node.type === "INSTANCE") {
      try {
        const image = figma.createImage(imageFile);
        const imageFill: ImagePaint = {
          type: 'IMAGE',
          scaleMode: 'FILL',
          imageHash: image.hash,
        };
        node.fills = [imageFill];
        console.log(imageFile);
      } catch (error) {
        console.error("Error creating image:", error);
      }
    }
  }
}


figma.showUI(__html__, { title: 'Banner Ads Generator', height: 600, width: 336 });
// figma.ui.onmessage = async (msg) => {
  // if (msg.type === 'create-banner-ad') {
  //   const { selectedOptions, svgString, fileBuffer, headlineValue, descriptionValue, phoneValue, emailValue, websiteValue } = msg.data;
  //   console.log(headlineValue);
  //   console.log(descriptionValue);
  //   console.log(phoneValue);
  //   console.log(emailValue);
  //   console.log(websiteValue);



    //change image
    // const imageFile = new Uint8Array(fileBuffer);
    // //await uploadImageToFrame(imgFrameName, imageFile);
    // console.log(imageFile);
    // console.log(fileBuffer);
    // console.log('hehe');

    //change SVG
    // await replaceSVG(svgString,svgFrameName);

    // await figma.loadFontAsync({ family: "Barlow Condensed", style: "Bold" });
    // await figma.loadFontAsync({ family: "Barlow Condensed", style: "Medium" });
    // await figma.loadFontAsync({ family: "Barlow Condensed", style: "Medium" });

    // const headlineNodes = figma.currentPage.findAll((node) => node.type === "TEXT" && node.name === "HEadlineeee");
    // const descriptNodes = figma.currentPage.findAll((node) => node.type === "TEXT" && node.name === "Your description goes here");
    // const phoneNodes = figma.currentPage.findAll((node) => node.type === "TEXT" && node.name === "Phone Number");
    // const emailNodes = figma.currentPage.findAll((node) => node.type === "TEXT" && node.name === "Email");
    // const websiteNodes = figma.currentPage.findAll((node) => node.type === "TEXT" && node.name === "Website");

    // headlineNodes.forEach((headlineNode) => {
    //   if (headlineNode.type === "TEXT") {
    //     headlineNode.characters = headlineValue;
    //     headlineNode.name = "HEadlineeee";
    //     //develop the change text layer's name later 
    //   }
//     // });
//     descriptNodes.forEach((descriptNode) => {
//       if (descriptNode.type === "TEXT") {
//         descriptNode.characters = descriptionValue;
//         descriptNode.name = "Your description goes here";
//       }
//     });
//     phoneNodes.forEach((phoneNode) => {
//       if (phoneNode.type === "TEXT") {
//         phoneNode.characters = phoneValue;
//         phoneNode.name = "Phone Number";
//       }
//     });
//     emailNodes.forEach((emailNode) => {
//       if (emailNode.type === "TEXT") {
//         emailNode.characters = emailValue;
//         emailNode.name = "Email";
//       }
//     });
//     websiteNodes.forEach((websiteNode) => {
//       if (websiteNode.type === "TEXT") {
//         websiteNode.characters = websiteValue;
//         websiteNode.name = "Website";
//       }
//     });
//   }
// }



figma.ui.onmessage = msg => {
  if (msg.type === 'create-banner-ad') {
    const { selectedOptions, svgString, fileBuffer, headlineValue, descriptionValue, phoneValue, emailValue, websiteValue } = msg.data;
    const importedNode: InstanceNode[] = [];
    let fulfill = false;
    async function fetchDataAsync(key: string) {
      try {
        const data = await importByKey(key);
        const hehe = data.createInstance();
        importedNode.push(hehe);
        if (importedNode.length === selectedOptions.length){  
          fulfill = true;
          //const detachedNode = loopDetachSelection(importedNode);
          const autoLayoutNode =  autoLayout(importedNode);
          loopDetachSelection(importedNode);
          //replaceSVG(svgString,svgFrameName);
        }
      } catch (error) {
        console.error('Rejected:', error);
      }
    };
    selectedOptions.forEach((nodeKey: any) => {
       fetchDataAsync(nodeKey);
      
    })
  }
}

