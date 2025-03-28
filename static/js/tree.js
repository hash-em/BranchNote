// TODO : PORT svg method to a simpler HTML canvas method
// this is a git push test

function visualize() {
    let tree_head = document.querySelector(".tree-head")
    tree_head.addEventListener("click", () => { showAll(tree_head), showDescription(tree_head) })
    let node = document.querySelector(".tree-body")
    connectChildren(tree_head, node)
    setManySize()
}

function getPosition(el) {
    let rect = el.getBoundingClientRect(); // Get element's position relative to the viewport
    let container = document.querySelector(".graph-display").getBoundingClientRect(); // Get container's position
    let pos_x = rect.left - container.left; // Subtract container's left offset
    let pos_y = rect.top - container.top;   // Subtract container's top offset
    return { 'x': pos_x, 'y': pos_y, 'node': el };
}

let connections = []

function connectDots(dot_a, dot_b) {
    let connection = { 'parent': dot_a, 'child': dot_b };
    connections.push(connection)
    setSize(connection)
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
    line.setAttribute("y1", a.y + 22);
    line.setAttribute("x2", b.x);
    line.setAttribute("y2", b.y + 22); // 22 accounts for padding
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", "2");
    line.setAttribute("vector-effect", "non-scaling-stroke"); // Ensure consistent stroke width
}

function setManySize() {

    let head = document.querySelector(".tree-head");

    let headPosition = getPosition(head);
    let closestNode = null;
    let minDistance = Infinity;

    document.querySelectorAll(".tree-node").forEach(node => {
        if (node !== head && node.classList.contains("visible-node")) {
            let nodePosition = getPosition(node);
            let distance = Math.sqrt(
                Math.pow(nodePosition.x - headPosition.x, 2) +
                Math.pow(nodePosition.y - headPosition.y, 2)
            );
            if (distance < minDistance) {
                minDistance = distance;
                closestNode = node;
            }
        }
    });

    // Adjust head's y-coordinate to match the closest node
    if (closestNode) {
        console.log(closestNode)
        let closestNodePosition = getPosition(closestNode);
        let offsetY = closestNodePosition.y - headPosition.y; // Calculate the difference in y-coordinates
        let currentTop = parseFloat(window.getComputedStyle(head).top) || 0; // Get current top value
        head.style.top = `${currentTop + offsetY}px`; // Adjust head's position
    }



    document.querySelectorAll("svg").forEach(function (svg) { svg.setAttribute("display", "display") })
    connections.forEach(function (connection) {
        if (connection.child.classList.contains("visible-node")) {
            connection.svg.setAttribute("style", "display:")
            setSize(connection)
        }
    });
}

document.querySelector(".graph-display").addEventListener("scroll", setManySize)

function connectChildren(parent, node) {
    let children = node.querySelectorAll(".tree-node");
    if (children.length > 0) {
        for (let child of children) {
            child.addEventListener("click", () => toggle(child));
            if (child.parentNode.parentNode.id == parent.id) {
                connectDots(parent, child);
            }
            let grandchildren = child.parentNode.querySelector(".branch-children");
            if (grandchildren) {
                connectChildren(child, grandchildren);
            }
        }
    }
    setManySize()
}


function toggle(node) {
    focusOn(node)
    let parent_connection = connections.find((connection) => connection.parent == node)
    if (parent_connection != undefined) {
        showAll(node)
    }
    showDescription(node)
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

    setManySize();
}

function showAll(node) {
    connections.forEach(function (connection) {
        if (connection.parent == node) {
            connection.child.classList.add("visible-node");
            connection.svg.setAttribute("display", "display")
            let subnodes = connection.parent.parentNode.querySelector(".branch-children").querySelectorAll(".tree-node")
            if (subnodes != null) {
                subnodes.forEach(function (subnode) {
                    subnode.parentNode.setAttribute("style", "display:")
                    subnode.classList.add("visible-node")
                })
            }

        }
    })
}

function showDescription(node) {
    let descriptionBox = document.querySelector(".descriptionBox")
    descriptionBox.innerHTML = node.getAttribute("verbose")
}

function showDescription(node) {
    let descriptionBox = document.querySelector(".descriptionBox")
    descriptionBox.innerHTML = node.getAttribute("verbose")
}
window.addEventListener('resize', setManySize)
window.addEventListener('load', main);
