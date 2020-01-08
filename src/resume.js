// Material Expansion panel
document.querySelectorAll('.mdc-expansion-panel').forEach((expansionPanel) => {
    const summary = expansionPanel.querySelector('.mdc-expansion-panel__summary');
    const details = expansionPanel.querySelector('.mdc-expansion-panel__details');
    if(!summary || !details) {
        console.warn('An expansion panel does not have summary or details');
        console.log(expansionPanel);
        return;
    }
    // Initialize expansion attribute
    if(!expansionPanel.hasAttribute("aria-expanded")) {
        expansionPanel.setAttribute("aria-expanded", "true");
    }
    // Toggle on click
    summary.addEventListener('click', () => {
        if(expansionPanel.getAttribute("aria-expanded") === "true") {
            expansionPanel.setAttribute("aria-expanded", "false");
        } else {
            expansionPanel.setAttribute("aria-expanded", "true");
        }
    })
});
