const loopSelection = (importedInstance) => {
    importedInstance.forEach((node) => {
        if (node.type === "INSTANCE") {
            const detached = node.detachInstance();
            loopSelection(detached.children);
        }
        if (node.type === "FRAME" || node.type === "GROUP" || node.type === "SECTION") {
            loopSelection(node.children);
        }
    });
};
export default loopSelection;
