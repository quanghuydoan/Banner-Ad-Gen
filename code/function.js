var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function importedNode(nodeKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const importedFrame = (yield figma.importComponentByKeyAsync(nodeKey)).clone();
        figma.currentPage.appendChild(importedFrame);
        return importedFrame;
    });
}
function autoLayout(node) {
    const setLayoutProps = (frame) => {
        frame.name = 'Frameee';
        frame.layoutMode = "VERTICAL";
        frame.paddingTop = 10;
        frame.paddingRight = 10;
        frame.paddingBottom = 10;
        frame.paddingLeft = 10;
        frame.itemSpacing = 160;
    };
    const sortNodesByPosition = (nodes) => {
        var result = nodes.map((x) => x);
        result.sort((current, next) => {
            return current.x - next.x;
        });
        return result.sort((current, next) => current.y - next.y);
    };
    if (node.length > 1) {
        let parentConteiner = node[0].parent;
        let frame = figma.createFrame();
        const group = figma.group(node, parentConteiner);
        frame.x = group.x;
        frame.y = group.y;
        // SET AUTO-LAYOUT AND SIZE
        frame.backgrounds = [];
        frame.resize(group.width, group.height);
        // ADD PROPERTY AND SPACING
        setLayoutProps(frame);
        // ADD CHILDREN ONE BY ONE TO THE NEW FRAME
        let sortedNodes = sortNodesByPosition(node);
        sortedNodes.map((item) => {
            frame.appendChild(item);
        });
        // APPEND NEW FRAME TO THE SAME PAGE
        parentConteiner.appendChild(frame);
        // FOCUS ON THE NEW Layout
        figma.currentPage.selection = [frame];
    }
    else if ((node.length === 1 && node[0].type === "FRAME") || (node.length === 1 && node[0].type === "COMPONENT")) {
        let frame = node[0];
        setLayoutProps(frame);
    }
}
export default autoLayout;
function replaceSVG(svgString, frameName) {
    return __awaiter(this, void 0, void 0, function* () {
        //let root = figma.root;
        let sel = figma.currentPage.selection;
        //let sourceNode = null;
        const count = sel.length;
        let newSelection = [];
        const sourceNode = figma.createNodeFromSvg(svgString);
        const oldNodes = figma.currentPage.findAll(node => node.name === frameName && node.type === "FRAME"); //Consider changing as Instance or Component
        let newNode;
        oldNodes.map(function (node, index) {
            return __awaiter(this, void 0, void 0, function* () {
                newNode = sourceNode.clone();
                newNode.x = node.x;
                newNode.y = node.y;
                newNode.name = node.name;
                //rescale node
                //resetScale(newNode);
                let parent = node.parent; //Consider changing as Instance or Component
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
                //console.log(newNode.name);
            });
        });
        sourceNode.remove();
    });
}
function changeText(headline) {
    return __awaiter(this, void 0, void 0, function* () {
        yield figma.loadFontAsync({ family: "Barlow Condensed", style: "Bold" });
        const headlineNodes = figma.currentPage.findAll((node) => node.type === "TEXT" && node.name === "HEadlineeee");
        headlineNodes.forEach((headlineNode) => {
            if (headlineNode.type === "TEXT") {
                headlineNode.characters = headline;
            }
        });
    });
}
