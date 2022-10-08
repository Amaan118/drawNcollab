window.addEventListener("load", () => {
    const sketch = document.getElementById("collapse-sketch");
    const account = document.getElementById("collapse-accounts");

    sketch.addEventListener("click", function () {
        this.style.transitionDuration = "0.25s";
        this.style.transitionDelay = "0.1s";
        if (this.classList.contains("active")) {
            this.style.top = "0.4em";
            this.style.transform = "rotate(0deg)";

            const menu = document.getElementsByClassName("sketch-menu")[0];
            for (let i = 0; i < menu.children.length; i++) {
                if (i < 2) {
                    continue;
                }
                menu.children[i].style.display = "block";
            }
            menu.style.border = "1px solid var(--light-ash-grey)";
        }
        else {
            this.style.transform = "rotate(180deg)";
            this.style.top = "0.1em";

            const menu = document.getElementsByClassName("sketch-menu")[0];
            for (let i = 0; i < menu.children.length; i++) {
                if (i < 2) {
                    continue;
                }
                menu.children[i].style.display = "none";
            }
            menu.style.border = "none";
            menu.children[0].style.border = "1px solid var(--light-ash-grey)";
        }
        this.classList.toggle("active");
    });

    account.addEventListener("click", function () {
        this.style.transitionDuration = "0.25s";
        this.style.transitionDelay = "0.1s";
        this.style.transform = "rotate(180deg)";
        if (this.classList.contains("active")) {
            this.style.top = "0.4em";
            this.style.transform = "rotate(0deg)";

            const menu = document.getElementsByClassName("user-menu")[0];
            for (let i = 0; i < menu.children.length; i++) {
                if (i < 2) {
                    continue;
                }
                console.log(menu.children[i]);
                menu.children[i].style.display = "block";
            }
            menu.style.border = "1px solid var(--light-ash-grey)";
        }
        else {
            this.style.transform = "rotate(180deg)";
            this.style.top = "0.1em";

            const menu = document.getElementsByClassName("user-menu")[0];
            for (let i = 0; i < menu.children.length; i++) {
                if (i < 2) {
                    continue;
                }
                menu.children[i].style.display = "none";
            }
            menu.style.border = "none";
            menu.children[0].style.border = "1px solid var(--light-ash-grey)";
        }
        this.classList.toggle("active");
    });

});