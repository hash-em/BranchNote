// TODO : PORT svg method to a simpler HTML canvas method
// this is a git push test


function main() {
    let locations = [];

    let tree_head = document.querySelector(".tree-head")
    let node = document.querySelector(".tree-body")
    connectChildren(node, tree_head)

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

    a = getPosition(connection.parent)
    b = getPosition(connection.child)
    let line = connection.svg.querySelector("line");
    let svg = connection.svg
    svg.setAttribute("id", "node-link");
    svg.setAttribute("width", window.innerWidth);
    svg.setAttribute("height", window.innerHeight);
    svg.setAttribute("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`);
    svg.setAttribute("style", "position:absolute; z-index: 10;");
    line.setAttribute("x1", a.x + a.node.offsetWidth);
    line.setAttribute("y1", a.y + 16);
    line.setAttribute("x2", b.x);
    line.setAttribute("y2", b.y + 16); // 16 is the padding of 'tree-node' in the stylesheet
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", "2");
}
function setManySize() {
    visible_connections.forEach(function (connection) {
        if (connection.child.classList.contains("visible-node")) {
            setSize(connection)
        }
        else {
            connection.svg.setAttribute("display", "none")
        }
    })
}

function connectChildren(node, parent) {
    let children = node.querySelectorAll(".tree-node");
    if (children.length > 0) {
        for (let child of children) {
            child.addEventListener("click", () => reveal(child.parentNode)); // trying
            if (child.parentNode.parentNode.id == parent.id) {
                connectDots(parent, child);
            }
            let grandchildren = child.parentNode.querySelector(".branch-children");
            if (grandchildren) {
                connectChildren(grandchildren, child);
            }
        }
    }
}
let visible_connections = connections


function reveal(node_div) {
    //console.log(node)
    tree_head = document.querySelector(".tree")
    console.log("start node", node_div)
    if (node_div == tree_head) {
        //filter(node)
    }

    else {
        parent_node = node_div.parentNode.parentNode
        branch = parent_node.querySelector(".branch-children").children
        for (child_node of branch) {
            console.log("ids", child_node.id, parent_node.id)
            console.log("curr", child_node, node_div)
            if (!(child_node == node_div)) {
                child_node.setAttribute("style", "display:none !important;")
                child_node.querySelectorAll(".tree-node").forEach(function (one) { one.classList.remove("visible-node") })
            }
        }
        next = parent_node.querySelector("#" + node_div.parentNode.parentNode.id, ".branch-head").parentNode
        console.log("next", next.id, next)
        reveal(next)

    }
    setManySize()
}

window.addEventListener('resize', setManySize)
window.addEventListener('load', main);
