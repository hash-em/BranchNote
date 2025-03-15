// this is test message
// this is master branch 100%
function main() {
    let locations = [];

    let nodes = document.querySelectorAll(".tree-node","visible");
    nodes.forEach(function(node) {
        locations.push(getPosition(node));
    });
    let location_count = locations.length;

    for (let i = 0; i < location_count - 1; i++) {
        let min = locations[i].x;
        let min_pos = i;
        for (let j = i + 1; j < location_count; j++) {
            if (locations[j].x < min) {
                min = locations[j].x;
                min_pos = j;
            }
        }
        if (min_pos != i) {
            let temp = locations[i];
            locations[i] = locations[min_pos];
            locations[min_pos] = temp;
        }
    }
    //connect head
    let index = 1;
    let connection_count = 0;
    let current_branch = document.querySelector("#tree-body")
    console.log(current_branch.id)
    while(index < location_count - 1)
    {
        if (locations[index].node.parentNode.parentNode.id == current_branch.id)
            {
                connectDots(locations[0],locations[index])
                connection_count ++;
            }
        index++;
    }
    console.log(connection_count)

   
}

function getPosition(el) {
    let pos_x = el.offsetLeft;
    let pos_y = el.offsetTop;
    let pos = {'x': pos_x, 'y': pos_y, 'node':el};
    return pos;
}

function connectDots(a, b) {
    // Ensure the container exists
    console.log(a.x, a.y, a.node, b.x, b.y, b.node);
    
    // Create the line element
    let line = `<svg id="node-link" viewBox="0 0 ${window.innerWidth} ${window.innerHeight}" width="${window.innerWidth}" height="${window.innerHeight}" style="position:absolute; z-index: -1;">
    <line x1="${a.x + a.node.offsetWidth}" y1="${a.y + a.node.offsetHeight / 4.7}" x2="${b.x}" y2="${b.y + b.node.offsetHeight / 3.6}" stroke="black" stroke-width="2"/>
    </svg>`;
    
    // Append to the SVG container
    document.getElementById("node-links").innerHTML += line;
}


window.addEventListener('load', main);


