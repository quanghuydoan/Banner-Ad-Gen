
async function importedNode(nodeKey: string) {
    const importedFrame = (await figma.importComponentByKeyAsync(nodeKey)).clone();
    figma.currentPage.appendChild(importedFrame);
    return importedFrame;
}

function autoLayout(node: any[] | readonly SceneNode[]) {
    const setLayoutProps = (frame: FrameNode) => {
        frame.name = 'Frameee';
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
        sortedNodes.map((item: SceneNode) => {
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
        //console.log(newNode.name);
    })
    sourceNode.remove();
}

async function changeText(headline: string) {
    await figma.loadFontAsync({ family: "Barlow Condensed", style: "Bold" });
    const headlineNodes = figma.currentPage.findAll((node) => node.type === "TEXT" && node.name === "HEadlineeee");
    headlineNodes.forEach((headlineNode) => {
        if (headlineNode.type === "TEXT") {
            headlineNode.characters = headline;
        }
    });
}


