// TODO : PORT svg method to a simpler HTML canvas method
// this is a git push test
function main() {
    let locations = [];

    let node = document.querySelector(".tree-body")
    let parent = document.querySelector(".tree-head")
    connectChildren(node,parent)
    /*let nodes = document.querySelectorAll(".tree-node","visible");
    nodes.forEach(function(node) {
        locations.push(node);
    });
    let location_count = locations.length;
    console.log(location_count)
    //connect head
    let connection_count = 0;
    let current_branch = document.querySelector("#tree-body")
    console.log(current_branch.id)
    for(let index = 1 ;index < location_count - 1; index++)
    {
        if (locations[index].parentNode.parentNode.id == current_branch.id)
            {
                connectDots(locations[0],locations[index])
                connection_count ++;
            }
    }
    console.log(connection_count)*/

   
}

function getPosition(el) {
    let pos_x = el.offsetLeft;
    let pos_y = el.offsetTop;
    let pos = {'x': pos_x, 'y': pos_y, 'node':el};
    return pos;
}

let connections = []
function connectDots(dot_a, dot_b) 
{
    // Ensure the container exists
    a = getPosition(dot_a)
    b = getPosition(dot_b)
    //console.log(a.x, a.y, a.node, b.x, b.y, b.node);
    // Create the line element
    let svgNS = "http://www.w3.org/2000/svg";
    let svg = document.createElementNS(svgNS,"svg");
    let line = document.createElementNS(svgNS, "line");
    svg.appendChild(line);
    let connection = {'a':a,'b':b,'svg':svg};
    document.getElementById("node-links").appendChild(svg);
    connections.push(connection)
    setSize(connection)
    // Append to the SVG container
    
    //console.log(connection)
    
}

function setSize(connection) {
    let line = connection.svg.querySelector("line");
    let svg = connection.svg
    svg.setAttribute("id", "node-link");
    svg.setAttribute("width", window.innerWidth);
    svg.setAttribute("height", window.innerHeight);
    svg.setAttribute("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`);
    svg.setAttribute("style", "position:absolute; z-index: 10;");
    line.setAttribute("x1", connection.a.x + connection.a.node.offsetWidth);
    line.setAttribute("y1", connection.a.y + 16);
    line.setAttribute("x2", connection.b.x);
    line.setAttribute("y2", connection.b.y + 16); // 16 is the padding of 'tree-node' in the stylesheet
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", "2");
}
function setManySize()
{
    connections.forEach(function(connection)
    {
            setSize(connection)
        })
}

function connectChildren(node, parent) {
    let children = node.querySelectorAll(".tree-node");
    if (children.length > 0) {
        for (let child of children) {
            console.log('child : ',child.parentNode.id,'\nchild direct parent :' ,child.parentNode.parentNode.id,'\nparent argument : ', parent.id);
            
            if (child.parentNode.parentNode.id == parent.id) {
                console.log(child);
                connectDots(parent, child);
            }
            let grandchildren = child.parentNode.querySelector(".branch-children");
            console.log(grandchildren)
            if (grandchildren) {
                connectChildren(grandchildren, child);
            }
        }
    }
}

window.addEventListener('load', main);

