// TODO : PORT svg method to a simpler HTML canvas method
// this is a git push test


function main() {

    let tree_head = document.querySelector(".tree-head")
    tree_head.addEventListener("click", () => { showAll(tree_head), showDescription(tree_head), setManySize() })
    let node = document.querySelector(".tree-body")
    connectChildren(tree_head, node)
}

function getPosition(el) {
    let pos_x = el.offsetLeft;
    let pos_y = el.offsetTop;
    let pos = { 'x': pos_x, 'y': pos_y, 'node': el };
    return pos;
}

let connections = [];

function toggle(node) {

    let nodeLink = node.parentNode.querySelector(".node-link");
    if (nodeLink) {
        nodeLink.classList.add("active-link");
    }
    focusOn(node)
    let parent_connection = connections.find((connection) => connection.parent == node)
    if (parent_connection != undefined) {
        showAll(node)
    }
    showDescription(node)
    setManySize()
}

function connectDots(dot_a, dot_b) {

    // Create the line element
    let svgNS = "http://www.w3.org/2000/svg";
    let svg = document.createElementNS(svgNS, "svg");
    let line = document.createElementNS(svgNS, "line");
    svg.appendChild(line);
    let connection = { 'parent': dot_a, 'child': dot_b, 'svg': svg, 'expanded': true };
    document.getElementById("node-links").appendChild(svg);
    connections.push(connection)
    setSize(connection)
    // Append to the SVG container


}

function setSize(connection) {
    let link_parent = document.getElementById("node-links");
    let a = getPosition(connection.parent);
    let b = getPosition(connection.child);

    // Calculate the maximum dimensions dynamically
    let maxWidth = Math.max(a.x + a.node.offsetWidth, b.x);
    let maxHeight = Math.max(a.y + 22, b.y + 22);

    let line = connection.svg.querySelector("line");
    let svg = connection.svg;

    svg.setAttribute("id", "node-link");
    svg.setAttribute("width", maxWidth); // Dynamically set width
    svg.setAttribute("height", maxHeight); // Dynamically set height
    svg.setAttribute("style", "position:absolute; z-index: 10;");

    line.setAttribute("x1", a.x + a.node.offsetWidth);
    line.setAttribute("y1", a.y + 20);
    line.setAttribute("x2", b.x);
    line.setAttribute("y2", b.y + 20); // 22 accounts for padding
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", "2");
    line.setAttribute("vector-effect", "non-scaling-stroke"); // Ensure consistent stroke width
}

function setManySize() {

    setTopPosition()
    document.querySelectorAll("svg").forEach(function (svg) { svg.setAttribute("display", "display") })
    connections.forEach(function (connection) {
        if (connection.child.classList.contains("visible-node")) {
            connection.svg.setAttribute("style", "display:")
            setSize(connection)
        }
        else {
            connection.svg.setAttribute("display", "none")
        }
    })
}

function setTopPosition() {

    let head = document.querySelector(".tree-head");
    let container = document.querySelector(".tree");
    let graph = document.querySelector(".graph-container")
    let headPosition = getPosition(head);
    //graph.setAttribute("left", `50px !important`)

    // Calculate the absolute center of the container
    let containerCenter = {
        x: container.offsetLeft + container.offsetWidth / 2,
        y: container.offsetTop + container.offsetHeight / 2
    };

    let closestNode = null;
    let minDistance = Infinity;

    document.querySelectorAll(".tree-node").forEach(node => {
        if (node !== head && node.classList.contains("visible-node")) {
            let nodePosition = getPosition(node);

            // Calculate a weighted distance combining the center and head position
            let distance = Math.sqrt(
                Math.pow(nodePosition.x - (headPosition.x + 10), 2) + // to also include closest X axis
                Math.pow(nodePosition.y - (headPosition.y), 2) // + 10 to headPosition just for little bias towards topmost node
            );

            if (distance < minDistance) {
                minDistance = distance;
                closestNode = node;
            }
        }
    });

    // Adjust head's y-coordinate to match the closest node
    if (closestNode) {
        let closestNodePosition = getPosition(closestNode);
        let offsetY = closestNodePosition.y - headPosition.y; // Calculate the difference in y-coordinates

        // Ensure the head element has a valid position style
        if (window.getComputedStyle(head).position === "static") {
            head.style.position = "relative";
        }

        // Get current top value and ensure it's valid
        let currentTop = parseFloat(window.getComputedStyle(head).top) || 0; // Default to 0 if invalid
        head.style.top = `${currentTop + offsetY}px`; // Adjust head's position
    }
}

function connectChildren(parent, node) {
    let children = node.querySelectorAll(".tree-node");
    if (children.length > 0) {
        for (let child of children) {
            child.addEventListener("click", () => toggle(child));
            //child.addEventListener("mouseout", () => showAll(child))
            if (child.parentNode.parentNode.id == parent.id) {
                connectDots(parent, child);
            }
            let grandchildren = child.parentNode.querySelector(".branch-children");
            if (grandchildren) {
                connectChildren(child, grandchildren);
            }
        }
    }
    setTopPosition()
    setManySize()
}




function focusOn(node) {
    node_div = node.parentNode;
    if (!(node_div == document.querySelector(".tree"))) {

        parent_node = node_div.parentNode.parentNode;
        branch = parent_node.querySelector(".branch-children").children;
        for (child_node of branch) {
            if (!(child_node == node_div)) {
                child_node.setAttribute("style", "display:none !important;");
                child_node.querySelectorAll(".tree-node").forEach(function (node) {
                    node.classList.remove("visible-node");
                });
            }
        }

        let next = connections.find((connection) => connection.child == node).parent
        focusOn(next);

    }

}

function showAll(node) {
    connections.forEach(function (connection) {
        if (connection.parent == node) {
            connection.child.classList.add("visible-node");
            connection.svg.setAttribute("display", "display")
            let subnodes = connection.parent.parentNode.querySelector(".branch-children").querySelectorAll(".tree-node")
            if (subnodes != null) {
                subnodes.forEach(function (subnode) {
                    subnode.parentNode.querySelector(".node-link").classList.remove("active-link");
                    subnode.parentNode.setAttribute("style", "display:")
                    subnode.classList.add("visible-node")
                })
            }

        }
    })
}

function showDescription(node) {
    let readBox = document.querySelector(".read")
    readBox.innerHTML = node.getAttribute("verbose")
}

function swapTreeDirection() {
    container = document.querySelector(".col")
    descBox = document.querySelector(".descriptionBox")
    graph = document.querySelector(".graph-display")
    if (container.classList.contains("horizontal")) {
        descBox.classList.remove("horizontal")
        descBox.classList.add("vertical")
        graph.classList.remove("horizontal")
        graph.classList.add("vertical")
        container.classList.remove("horizontal")
        container.classList.add("vertical")

    }
    else {
        container.classList.add("horizontal")
        container.classList.remove("vertical")
        descBox.classList.add("horizontal")
        descBox.classList.remove("vertical")
        graph.classList.add("horizontal")
        graph.classList.remove("vertical")
    }
    setManySize()
}



window.addEventListener('resize', setManySize)
window.addEventListener('load', () => {
    main();
});
