// TODO : PORT svg method to a simpler HTML canvas method
// this is a git push test

function visualize() {
    let tree_head = document.querySelector(".tree-head")
    tree_head.addEventListener("click", () => toggle(tree_head))
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
    let container = document.querySelector(".graph-display"); // Get the scrolling container
    let canvas = document.getElementById("node-links");
    let ctx = canvas.getContext("2d");

    let scrollX = container.scrollLeft; // Correctly get horizontal scroll offset
    let scrollY = container.scrollTop;  // Correctly get vertical scroll offset

    let a = getPosition(connection.parent);
    let b = getPosition(connection.child);

    ctx.beginPath();
    ctx.moveTo(a.x + a.node.offsetWidth + scrollX, a.y + 16 + scrollY); // Adjust for scroll
    ctx.lineTo(b.x + scrollX, b.y + 16 + scrollY); // Adjust for scroll
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function setManySize() {
    let container = document.querySelector(".graph-display");
    let canvas = document.getElementById("node-links");
    canvas.width = container.offsetWidth; // Match canvas size to container
    canvas.height = container.offsetHeight; // Match canvas size to container
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    connections.forEach(function (connection) {
        if (connection.child.classList.contains("visible-node")) {
            setSize(connection);
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
    node_div = node.parentNode
    if (!(node_div == document.querySelector(".tree"))) {
        child_connection = connections.find((connection) => connection.child == node)
        if (child_connection != undefined) {
        }

        parent_node = node_div.parentNode.parentNode
        branch = parent_node.querySelector(".branch-children").children
        for (child_node of branch) {

            if (!(child_node == node_div)) {
                child_node.setAttribute("style", "display:none !important;")
                child_node.querySelectorAll(".tree-node").forEach(function (node) { node.classList.remove("visible-node") })
            }
        }
        next = parent_node.querySelector("#" + node_div.parentNode.parentNode.id, ".branch-head")

        focusOn(next)

    }
}

function showAll(node) {
    connections.forEach(function (connection) {
        if (connection.parent == node) {
            connection.child.parentNode.setAttribute("style", "display :");
            connection.child.classList.add("visible-node");
            let subconnections = connection.parent.parentNode.querySelector(".branch-children").querySelectorAll(".tree-node")
            console.log(subconnections)
            if (subconnections != null) {
                subconnections.forEach(function (subconnection) {
                    subconnection.parentNode.setAttribute("style", "display:")
                    subconnection.classList.add("visible-node")
                })
            }

        }
    })
}

function showDescription(node) {
    let descriptionBox = document.querySelector(".descriptionBox")
    console.log(node.getAttribute("verbose"))
    descriptionBox.innerHTML = node.getAttribute("verbose")
}

function create() {
    console.log("hi")
}
console.log(document.title)
if (document.title == "BranchNote - Notes") {
    window.addEventListener('resize', setManySize);
    window.addEventListener('load', visualize);
} else if (document.title == "BranchNote - Create") {
    window.addEventListener('load', create)
    window.addEventListener('resize', setManySize);
}
