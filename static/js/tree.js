// TODO : PORT svg method to a simpler HTML canvas method
// this is a git push test


function main() {

    let tree_head = document.querySelector(".tree-head")
    tree_head.addEventListener("click", () => toggle(tree_head))
    let node = document.querySelector(".tree-body")
    connectChildren(tree_head, node)
}

function getPosition(el) {
    let pos_x = el.offsetLeft;
    let pos_y = el.offsetTop;
    let pos = { 'x': pos_x, 'y': pos_y, 'node': el };
    return pos;
}

let connections = []
function connectDots(dot_a, dot_b) {

    // Create the line element
    let svgNS = "http://www.w3.org/2000/svg";
    let svg = document.createElementNS(svgNS, "svg");
    let line = document.createElementNS(svgNS, "line");
    svg.appendChild(line);
    let connection = { 'parent': dot_a, 'child': dot_b, 'svg': svg };
    document.getElementById("node-links").appendChild(svg);
    connections.push(connection)
    setSize(connection)
    // Append to the SVG container


}
function setSize(connection) {
    let container = document.querySelector(".graph-display")

    a = getPosition(connection.parent)
    b = getPosition(connection.child)
    let line = connection.svg.querySelector("line");
    let svg = connection.svg
    svg.setAttribute("id", "node-link");
    svg.setAttribute("width", window.innerHeight); /// use window.innerHeight and width to avoid svg not rendering
    svg.setAttribute("height", window.innerHeight); /// use container.offsetHeight and width for nice sizing and no overflow
    svg.setAttribute("style", "position:absolute; z-index: 10;");
    line.setAttribute("x1", (a.x + a.node.offsetWidth));
    line.setAttribute("y1", (a.y + 22));
    line.setAttribute("x2", (b.x));
    line.setAttribute("y2", (b.y + 22)); // 16 is the padding of 'tree-node' in the stylesheet
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", "2");
}
function setManySize() {
    connections.forEach(function (connection) {
        if (connection.child.classList.contains("visible-node")) {
            setSize(connection)
        }
        else {
            connection.svg.setAttribute("display", "none")
        }
    })
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
}
let visible_connections = connections


function toggle(node) {
    let parent_connection = connections.find((connection) => connection.parent == node)

    focusOn(node)

    if (parent_connection != undefined) {
        showAll(node)
    }
    showDescription(node)
    setManySize()
}

function focusOn(node) {
    node_div = node.parentNode
    if (!(node_div == document.querySelector(".tree"))) {
        child_connection = visible_connections.find((connection) => connection.child == node)
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

    visible_connections = visible_connections.filter((connection) => connection.child.classList.contains("visible-node"))
    setManySize()
}

function showAll(node) {
    connections.forEach(function (connection) {
        if (connection.parent == node) {
            connection.child.parentNode.setAttribute("style", "display :");
            connection.child.classList.add("visible-node");
            connection.svg.setAttribute("display", "display");
            connections.forEach(function (subconnection) {
                if (subconnection.parent == connection.child) {
                    // if you remove this you can 'customize' the layout by clicking
                    showAll(connection.child);
                }
            })
        }
    })
    setManySize()
}

function showDescription(node) {
    let descriptionBox = document.querySelector(".descriptionBox")
    console.log(node.getAttribute("verbose"))
    descriptionBox.innerHTML = node.getAttribute("verbose")

}
window.addEventListener('resize', setManySize)
window.addEventListener('load', main);
