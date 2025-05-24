// Material Drawer and Top App Bar
// https://glitch.com/~material-responsive-drawer
import {MDCDrawer} from "@material/drawer";
import {MDCTopAppBar} from '@material/top-app-bar';
import {MDCList} from "@material/list";
// Download dialog
import {MDCDialog} from '@material/dialog';

document.addEventListener("DOMContentLoaded", function () {
    // Material Expansion panel
    document.querySelectorAll('.mdc-expansion-panel').forEach((expansionPanel) => {
        const summary = expansionPanel.querySelector('.mdc-expansion-panel__summary');
        const details = expansionPanel.querySelector('.mdc-expansion-panel__details');
        if (!summary || !details) {
            console.warn('An expansion panel does not have summary or details');
            console.log(expansionPanel);
            return;
        }
        // Initialize expansion attribute
        if (!expansionPanel.hasAttribute("aria-expanded")) {
            expansionPanel.setAttribute("aria-expanded", "true");
        }
        // Toggle on click
        summary.addEventListener('click', () => {
            if (expansionPanel.getAttribute("aria-expanded") === "true") {
                expansionPanel.setAttribute("aria-expanded", "false");
            } else {
                expansionPanel.setAttribute("aria-expanded", "true");
            }
        })
    });

// Select DOM elements
    const topAppBarElement = document.querySelector('.mdc-top-app-bar');
    const drawerElement = document.querySelector('.mdc-drawer');
    const drawerListElement = document.querySelector('.mdc-drawer .mdc-list');
    const mainContentEl = document.querySelector('.main-content');
    // Create elements
    let drawer;
    let list;
    let topAppBar;

    const createElements = () => {
        drawer = MDCDrawer.attachTo(drawerElement);
        list = new MDCList(drawerListElement);
        list.wrapFocus = true;
        topAppBar = MDCTopAppBar.attachTo(topAppBarElement);
        topAppBar.setScrollTarget(mainContentEl);
        topAppBar.listen('MDCTopAppBar:nav', () => {
            drawer.open = !drawer.open;
        });
    };

    const closeDrawer = () => {
        drawer.open = false;
    };

    const destroyElements = () => {
        if (drawer) drawer.destroy();
        if (list) list.destroy();
        if (topAppBar) topAppBar.destroy();
    };

    const getScrims = () => {
        const scrims = document.getElementsByClassName('mdc-drawer-scrim');
        return Array.from(scrims);
    };

    const createScrim = () => {
        const scrims = getScrims();
        if (!scrims.length) {
            drawerElement.insertAdjacentHTML("afterend", "<div class=\"mdc-drawer-scrim js-only\"></div>");
        }
    };

    const removeScrims = () => {
        const scrims = getScrims();
        scrims.forEach(scrim => scrim.remove());
    };


// Initialize either modal or permanent drawer
    const initModalDrawer = () => {

        // Destroy elements
        destroyElements();

        // Switch drawer
        drawerElement.classList.remove("mdc-drawer--dismissible", "mdc-drawer--open");
        drawerElement.classList.add("mdc-drawer--modal");
        createScrim();

        // Create elements
        createElements();

        // Hide
        drawer.open = false;

        // Hide on list click
        drawerListElement.removeEventListener('click', closeDrawer);
        drawerListElement.addEventListener('click', closeDrawer);
    };

    const initPermanentDrawer = () => {

        // Destroy elements
        destroyElements();

        // Switch drawer type
        removeScrims();
        drawerElement.classList.remove("mdc-drawer--modal");
        drawerElement.classList.add("mdc-drawer--dismissible");

        // Create elements
        createElements();

        // Open drawer
        drawer.open = true;

        // Hide on list click
        drawerListElement.removeEventListener('click', closeDrawer);
    };

    window.matchMedia("(max-width: 900px)").matches ?
        initModalDrawer() : initPermanentDrawer();

    // Toggle between permanent drawer and modal drawer at breakpoint 900px
    const resizeHandler = () => {
        if (window.matchMedia("(max-width: 900px)").matches) {
            initModalDrawer();
        } else {
            initPermanentDrawer();
        }
    };
    window.addEventListener('resize', resizeHandler);

    /** Material Dialog **/
    const downloadDialogElement =document.querySelector('#download-dialog');
    const downloadDialog = new MDCDialog(downloadDialogElement);
    window.downloadDialog = downloadDialog
    downloadDialog.listen('MDCDialog:opened', () => {
        // 👇 not sure why this was needed TBH
        new MDCList(downloadDialogElement.querySelector('.mdc-list')).layout();
    });

    const noticeDialogElement =document.querySelector('#notice-dialog');
    if(noticeDialogElement) {
        const noticeDialog = new MDCDialog(noticeDialogElement);
        noticeDialog.open()
    }
});




