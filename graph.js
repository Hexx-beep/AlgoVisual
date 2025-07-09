class PriorityQueue {
    constructor(comparator = (a, b) => a - b) {
        this.heap = [];
        this.comparator = comparator;
    }
    
    enqueue(item) {
        this.heap.push(item);
        this.bubbleUp(this.heap.length - 1);
    }
    
    dequeue() {
        const root = this.heap[0];
        const last = this.heap.pop();
        
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this.sinkDown(0);
        }
        
        return root;
    }
    
    isEmpty() {
        return this.heap.length === 0;
    }
    
    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.comparator(this.heap[index], this.heap[parentIndex]) >= 0) break;
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }
    
    sinkDown(index) {
        const length = this.heap.length;
        while (true) {
            let leftChild = 2 * index + 1;
            let rightChild = 2 * index + 2;
            let swapIndex = null;
            
            if (leftChild < length && this.comparator(this.heap[leftChild], this.heap[index]) < 0) {
                swapIndex = leftChild;
            }
            
            if (rightChild < length && 
                this.comparator(this.heap[rightChild], (swapIndex === null ? this.heap[index] : this.heap[leftChild])) < 0) {
                swapIndex = rightChild;
            }
            
            if (swapIndex === null) break;
            
            [this.heap[index], this.heap[swapIndex]] = [this.heap[swapIndex], this.heap[index]];
            index = swapIndex;
        }
    }
}

// Graph data structure
const graph = {
        nodes: [],
        edges: [],
        nextNodeId: 0,
        selectedAlgorithm: null,
        edgeCreation: {
            active: false,
            sourceNode: null,
            targetNode: null
        },
        selectedNode: null,
        selectedEdge: null,
        // Track the next available graph ID
        graphs: {
            1: { nodes: [], edges: [] },
            2: { nodes: [], edges: [] }
        },
        currentGraph: 1,
        nextGraphId: 3 
                };


// DOM elements
const graphSvg = document.getElementById('graph-svg');
const nodesContainer = document.getElementById('nodes-container');
const nodeCounter = document.getElementById('node-counter');
const edgeCounter = document.getElementById('edge-counter');
const addNodeBtn = document.getElementById('add-node-btn');
const generateGraphBtn = document.getElementById('generate-graph-btn');
const clearGraphBtn = document.getElementById('clear-graph-btn');
const newGraphBtn = document.getElementById('new-graph-btn');
const graphSelector = document.getElementById('graph-selector');
const graphSelectorContainer = document.getElementById('graph-selector-container');
const algorithmBtns = document.querySelectorAll('.algorithm-btn');
const runAlgorithmBtn = document.getElementById('run-algorithm');
const graphTypeSelect = document.getElementById('graph-type');
const graphStructureSelect = document.getElementById('graph-structure');
const nodeCountInput = document.getElementById('node-count');
const nodeCountValue = document.getElementById('node-count-value');
const densityInput = document.getElementById('density');
const densityValue = document.getElementById('density-value');
const cycleSizeInput = document.getElementById('cycle-size');
const cycleSizeValue = document.getElementById('cycle-size-value');
const completeSizeInput = document.getElementById('complete-size');
const completeSizeValue = document.getElementById('complete-size-value');
const wheelSizeInput = document.getElementById('wheel-size');
const wheelSizeValue = document.getElementById('wheel-size-value');
const bipartiteMInput = document.getElementById('bipartite-m');
const bipartiteMValue = document.getElementById('bipartite-m-value');
const bipartiteNInput = document.getElementById('bipartite-n');
const bipartiteNValue = document.getElementById('bipartite-n-value');
const generateBtn = document.getElementById('generate-btn');
const edgeCreationPanel = document.getElementById('edge-creation-panel');
const noEdgeCreation = document.getElementById('no-edge-creation');
const connectingNodes = document.getElementById('connecting-nodes');
const directedEdgeCheckbox = document.getElementById('directed-edge');
const weightContainer = document.getElementById('weight-container');
const edgeWeightInput = document.getElementById('edge-weight');
const confirmEdgeBtn = document.getElementById('confirm-edge-btn');
const cancelEdgeBtn = document.getElementById('cancel-edge-btn');
const algorithmResults = document.getElementById('algorithm-results');
const noResults = document.getElementById('no-results');
const resultsTableContainer = document.getElementById('results-table-container');
const resultsTableBody = document.getElementById('results-table-body');
const isomorphismResults = document.getElementById('isomorphism-results');
const exportBtn = document.getElementById('export-btn');
const algorithmExplanation = document.getElementById('algorithm-explanation');
const algoTitle = document.getElementById('algo-title');
const algoDescription = document.getElementById('algo-description');
const algoComplexity = document.getElementById('algo-complexity');
const algorithmParams = document.getElementById('algorithm-params');
const startNodeSelect = document.getElementById('start-node');
const endNodeSelect = document.getElementById('end-node');
const startNodeContainer = document.getElementById('start-node-container');
const endNodeContainer = document.getElementById('end-node-container');
const colorKeyLegend = document.getElementById('color-key-legend');
const nodeContextMenu = document.getElementById('node-context-menu');
const edgeContextMenu = document.getElementById('edge-context-menu');
const deleteNodeBtn = document.getElementById('delete-node-btn');
const deleteEdgeBtn = document.getElementById('delete-edge-btn');
const toggleResultsBtn = document.getElementById('toggle-results');
const randomGraphParams = document.getElementById('random-graph-params');
const cycleGraphParams = document.getElementById('cycle-graph-params');
const completeGraphParams = document.getElementById('complete-graph-params');
const wheelGraphParams = document.getElementById('wheel-graph-params');
const bipartiteGraphParams = document.getElementById('bipartite-graph-params');

// Algorithm explanations
const algorithmExplanations = {
    'prim': {
        title: "Prim's Minimum Spanning Tree",
        description: "Prim's algorithm finds a minimum spanning tree for a weighted undirected graph. It starts with an arbitrary node and grows the spanning tree by adding the cheapest edge from the tree to a vertex not yet in the tree.",
        complexity: "Time Complexity: O(E log V) using a binary heap",
        needsStartNode: true,
        needsEndNode: false
    },
    'kruskal': {
        title: "Kruskal's Minimum Spanning Tree",
        description: "Kruskal's algorithm finds a minimum spanning tree by sorting all edges from the lowest weight to highest and adding them to the tree if they don't form a cycle.",
        complexity: "Time Complexity: O(E log V) using union-find with path compression",
        needsStartNode: false,
        needsEndNode: false
    },
    'dijkstra': {
        title: "Dijkstra's Shortest Path",
        description: "Dijkstra's algorithm finds the shortest paths from a starting node to all other nodes in a graph with non-negative edge weights. It uses a priority queue to select the node with the smallest tentative distance.",
        complexity: "Time Complexity: O(E + V log V) with a Fibonacci heap",
        needsStartNode: true,
        needsEndNode: true
    },
    'kuratowski': {
        title: "Kuratowski's Theorem",
        description: "Kuratowski's theorem states that a finite graph is planar if and only if it does not contain a subgraph that is a subdivision of K₅ (complete graph on 5 vertices) or K₃,₃ (complete bipartite graph on 3+3 vertices).",
        complexity: "Time Complexity: Typically O(V²) for planarity testing",
        needsStartNode: false,
        needsEndNode: false
    },
    'hamiltonian': {
        title: "Hamiltonian Path/Cycle",
        description: "A Hamiltonian path visits each vertex exactly once. A Hamiltonian cycle is a closed loop where every vertex is visited exactly once. Determining whether such paths/cycles exist is NP-complete.",
        complexity: "Time Complexity: O(V!) in brute-force approaches",
        needsStartNode: false,
        needsEndNode: false
    },
    'eulerian': {
        title: "Eulerian Path/Circuit",
        description: "An Eulerian path visits every edge exactly once. An Eulerian circuit is a closed Eulerian path. A graph has an Eulerian circuit if and only if every vertex has even degree.",
        complexity: "Time Complexity: O(E) to find an Eulerian path",
        needsStartNode: false,
        needsEndNode: false
    },
    'vertex-coloring': {
        title: "Vertex Coloring",
        description: "Vertex coloring assigns colors to vertices so that no two adjacent vertices share the same color. The smallest number of colors needed is called the chromatic number.",
        complexity: "Time Complexity: O(2^V) for optimal solution (NP-hard)",
        needsStartNode: false,
        needsEndNode: false
    },
    'edge-coloring': {
        title: "Edge Coloring",
        description: "Edge coloring assigns colors to edges so that no two adjacent edges share the same color. The smallest number of colors needed is called the edge chromatic number.",
        complexity: "Time Complexity: O(V^2) for bipartite graphs, NP-hard for general graphs",
        needsStartNode: false,
        needsEndNode: false
    },
    'bipartite-check': {
        title: "Bipartite Graph Check",
        description: "A bipartite graph is a graph whose vertices can be divided into two disjoint sets such that no two vertices within the same set are adjacent. This can be checked using a 2-coloring algorithm.",
        complexity: "Time Complexity: O(V + E) using BFS",
        needsStartNode: false,
        needsEndNode: false
    },
    'isomorphism': {
        title: "Graph Isomorphism",
        description: "Two graphs are isomorphic if there's a one-to-one correspondence between their vertices that preserves adjacency. This algorithm checks basic properties and tries to find a mapping.",
        complexity: "Time Complexity: O(V!) in worst case",
        needsStartNode: false,
        needsEndNode: false
    },
    'huffman': {
        title: "Huffman Coding",
        description: "Huffman coding is a lossless data compression algorithm that assigns variable-length codes to input characters based on their frequencies. More frequent characters get shorter codes.",
        complexity: "Time Complexity: O(n log n) where n is the number of unique characters",
        needsStartNode: false,
        needsEndNode: false
    },
    'notation-conversion': {
        title: "Notation Conversion",
        description: "Convert between infix, prefix, and postfix notation. Infix is the common arithmetic notation (e.g., 3 + 4), prefix places the operator before operands (e.g., + 3 4), and postfix places the operator after operands (e.g., 3 4 +).",
        complexity: "Time Complexity: O(n) for conversion between notations",
        needsStartNode: false,
        needsEndNode: false
    },
    'expression-tree': {
        title: "Expression Tree Construction",
        description: "Build a binary tree representation of an arithmetic expression. The leaves are operands and the internal nodes are operators. Can be constructed from infix, prefix, or postfix notation.",
        complexity: "Time Complexity: O(n) for tree construction",
        needsStartNode: false,
        needsEndNode: false
    }

};

// Initialize the app
function init() {
    // Event listeners
    addNodeBtn.addEventListener('click', addNode);
    generateGraphBtn.addEventListener('click', generateRandomGraph);
    clearGraphBtn.addEventListener('click', clearGraph);
    newGraphBtn.addEventListener('click', createNewGraph);
    graphSelector.addEventListener('change', switchGraph);
    algorithmBtns.forEach(btn => btn.addEventListener('click', selectAlgorithm));
    runAlgorithmBtn.addEventListener('click', runAlgorithm);
    nodeCountInput.addEventListener('input', updateNodeCountValue);
    densityInput.addEventListener('input', updateDensityValue);
    cycleSizeInput.addEventListener('input', updateCycleSizeValue);
    completeSizeInput.addEventListener('input', updateCompleteSizeValue);
    wheelSizeInput.addEventListener('input', updateWheelSizeValue);
    bipartiteMInput.addEventListener('input', updateBipartiteMValue);
    bipartiteNInput.addEventListener('input', updateBipartiteNValue);
    graphStructureSelect.addEventListener('change', updateGraphStructureParams);
    generateBtn.addEventListener('click', generateGraphWithParams);
    directedEdgeCheckbox.addEventListener('change', toggleWeightVisibility);
    confirmEdgeBtn.addEventListener('click', confirmEdge);
    cancelEdgeBtn.addEventListener('click', cancelEdge);
    exportBtn.addEventListener('click', exportVisualization);
    graphTypeSelect.addEventListener('change', toggleWeightVisibility);
    toggleResultsBtn.addEventListener('click', toggleResultsVisibility);
    
    
    // Context menu event listeners
    deleteNodeBtn.addEventListener('click', deleteSelectedNode);
    deleteEdgeBtn.addEventListener('click', deleteSelectedEdge);
    clearGraphBtn.addEventListener('click', clearGraph);
    initHuffmanUI();
    

// Initialize with Graph 1 loaded
    loadGraph(1);

    graph.graphs[1] = { nodes: [], edges: [] };
    graph.graphs[2] = { nodes: [], edges: [] };
    graphSelector.innerHTML = '';
    const option = document.createElement('option');
    option.value = '1';
    option.textContent = 'Graph 1';
    graphSelector.appendChild(option);

    

    
    // Close context menus when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (!nodeContextMenu.contains(e.target) && !edgeContextMenu.contains(e.target)) {
            hideContextMenus();
        }
    });
        document.querySelector('.fa-cog').closest('button').addEventListener('click', openSettings);
    document.querySelector('.fa-question-circle').closest('button').addEventListener('click', openHelp);
        initModals();
    
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('delete-all-graphs-btn').addEventListener('click', deleteAllGraphs);
    
    // Update initial values
    updateNodeCountValue();
    updateDensityValue();
    updateCycleSizeValue();
    updateCompleteSizeValue();
    updateWheelSizeValue();
    updateBipartiteMValue();
    updateBipartiteNValue();
    
    // Add a few initial nodes for demo
    for (let i = 0; i < 3; i++) {
        addNode();
    }
    clearGraphDisplay();
}

// Create a new graph (second graph for comparison)
function createNewGraph() {
    // Save current graph
    saveCurrentGraph();
    
    // Create a new graph ID
    const newGraphId = graph.nextGraphId++;
    
    // Update the graph selector dropdown
    const option = document.createElement('option');
    option.value = newGraphId;
    option.textContent = `Graph ${newGraphId}`;
    graphSelector.appendChild(option);
    
    // Switch to the new graph
    graph.currentGraph = newGraphId;
    graphSelector.value = newGraphId;
    
    // Clear the display and reset graph data
    clearGraphDisplay();
    graph.nodes = [];
    graph.edges = [];
    graph.nextNodeId = 0;
    
    // Initialize the new graph in storage
    graph.graphs[newGraphId] = { nodes: [], edges: [] };
    
    // Add a few initial nodes for the new graph

    
    // Save the new graph
    saveCurrentGraph();
}


// Switch between graphs
function switchGraph() {
    // Save current graph state
    saveCurrentGraph();
    
    // Switch to selected graph
    graph.currentGraph = parseInt(graphSelector.value);
    
    // Clear the display
    clearGraphDisplay();
    
    // Load the selected graph
    loadGraph(graph.currentGraph);
}


// Save current graph to memory
function saveCurrentGraph() {
    graph.graphs[graph.currentGraph] = {
        nodes: JSON.parse(JSON.stringify(graph.nodes)),
        edges: JSON.parse(JSON.stringify(graph.edges)),
        nextNodeId: graph.nextNodeId
    };
}
function saveAsGraph2() {
    // 1. First save the current graph (in case it's Graph 1)
    saveCurrentGraph();
    
    // 2. Copy current graph data to Graph 2
    graph.graphs[2] = JSON.parse(JSON.stringify({
        nodes: graph.nodes.map(node => ({
            id: node.id,
            x: node.x,
            y: node.y
        })),
        edges: graph.edges.map(edge => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            directed: edge.directed,
            weight: edge.weight
        }))
    }));
    
    // 3. Update the graph selector
    updateGraphSelector();
    
    // 4. Show confirmation
    alert("Current graph has been saved as Graph 2");
    
    // Debug log
    console.log("Saved as Graph 2:", graph.graphs[2]);
    }

// Add this to your init() function
    document.getElementById('save-as-graph2-btn').addEventListener('click', saveAsGraph2);

// Load a graph from memory
function loadGraph(graphNumber) {
    const graphData = graph.graphs[graphNumber] || { nodes: [], edges: [] };
    // Clear current display
    clearGraphDisplay();
    
    // Load the graph data
    
    if (!graphData) return;
    graph.nodes = graphData.nodes.map(n => ({ ...n }));
    graph.edges = graphData.edges.map(e => ({ ...e }));
    
    graph.nodes = JSON.parse(JSON.stringify(graphData.nodes));
    graph.edges = JSON.parse(JSON.stringify(graphData.edges));
    graph.nextNodeId = graphData.nextNodeId;
    
    // Recreate the graph elements
    recreateGraphElements();
    
    // Update counters
    updateNodeCounter();
    updateEdgeCounter();
    updateNodeSelectors();
}

// Clear just the display (not the stored graphs)
function clearGraphDisplay() {
    graphSvg.innerHTML = `
        <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto" class="arrowhead">
                <polygon points="0 0, 10 3.5, 0 7"/>
            </marker>
            <marker id="arrowhead-visited" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto" class="arrowhead-visited">
                <polygon points="0 0, 10 3.5, 0 7"/>
            </marker>
            <marker id="arrowhead-shortest" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto" class="arrowhead-shortest">
                <polygon points="0 0, 10 3.5, 0 7"/>
            </marker>
            <marker id="arrowhead-eulerian" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto" class="arrowhead-eulerian">
                <polygon points="0 0, 10 3.5, 0 7"/>
            </marker>
            <marker id="arrowhead-hamiltonian" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto" class="arrowhead-hamiltonian">
                <polygon points="0 0, 10 3.5, 0 7"/>
            </marker>
        </defs>
    `;
    nodesContainer.innerHTML = '';
}

// Recreate all graph elements from data
function recreateGraphElements() {
    // Create nodes
    graph.nodes.forEach(node => {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'node absolute w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-xs font-bold text-slate-200 cursor-move select-none';
        nodeElement.style.left = `${node.x - 14}px`;
        nodeElement.style.top = `${node.y - 14}px`;
        nodeElement.textContent = node.id;
        nodeElement.dataset.id = node.id;
        
        makeDraggable(nodeElement);
        nodeElement.addEventListener('click', handleNodeClick);
        nodeElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showNodeContextMenu(e, node.id);
        });
        
        nodesContainer.appendChild(nodeElement);
        node.element = nodeElement;
    });
    
    // Create edges
    graph.edges.forEach(edge => {
        const sourceNode = graph.nodes.find(n => n.id === edge.source);
        const targetNode = graph.nodes.find(n => n.id === edge.target);
        
        if (!sourceNode || !targetNode) return;
        
        // Create SVG line
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', sourceNode.x);
        line.setAttribute('y1', sourceNode.y);
        line.setAttribute('x2', targetNode.x);
        line.setAttribute('y2', targetNode.y);
        line.classList.add('edge');
        if (edge.directed) {
            line.classList.add('directed');
        }
        line.id = edge.id;
        
        // Add context menu handler
        line.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showEdgeContextMenu(e, edge.id);
        });
        
        // Add weight label if needed
        let weightGroup = null;
        let weightText = null;
        let weightRect = null;
        
        if (edge.weight !== null) {
            const midX = (sourceNode.x + targetNode.x) / 2;
            const midY = (sourceNode.y + targetNode.y) / 2;
            
            weightGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            
            weightRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            weightRect.setAttribute('x', midX - 15);
            weightRect.setAttribute('y', midY - 12);
            weightRect.setAttribute('width', 30);
            weightRect.setAttribute('height', 20);
            weightRect.setAttribute('class', 'weight-bg');
            
            weightText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            weightText.setAttribute('x', midX);
            weightText.setAttribute('y', midY + 5);
            weightText.setAttribute('text-anchor', 'middle');
            weightText.setAttribute('class', 'weight-label');
            weightText.textContent = edge.weight;
            
            weightGroup.appendChild(weightRect);
            weightGroup.appendChild(weightText);
            graphSvg.appendChild(weightGroup);
        }
        
        graphSvg.appendChild(line);
        
        // Update edge references
        edge.element = line;
        edge.weightElement = weightGroup;
        edge.weightText = weightText;
        edge.weightRect = weightRect;
    });
}

// Add a new node to the graph
function addNode() {
    const nodeId = graph.nextNodeId++;
    const canvas = document.getElementById('graph-canvas');
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    // Random position (avoid edges)
    const x = Math.random() * (width - 80) + 40;
    const y = Math.random() * (height - 80) + 40;
    
    // Create node element
    const node = document.createElement('div');
    node.className = 'node absolute w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-xs font-bold text-slate-200 cursor-move select-none';
    node.style.left = `${x - 14}px`;
    node.style.top = `${y - 14}px`;
    node.textContent = nodeId;
    node.dataset.id = nodeId;
    
    // Make node draggable
    makeDraggable(node);
    
    // Add click handler for edge creation
    node.addEventListener('click', handleNodeClick);
    
    // Add context menu handler
    node.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showNodeContextMenu(e, nodeId);
    });
    
    // Add to DOM and graph data
    nodesContainer.appendChild(node);
    graph.nodes.push({
        id: nodeId,
        element: node,
        x: x,
        y: y
    });
    
    // Update counters and node selectors
    updateNodeCounter();
    updateNodeSelectors();
}

// Show context menu for node
function showNodeContextMenu(e, nodeId) {
    hideContextMenus();
    graph.selectedNode = nodeId;
    
    // Position the context menu
    nodeContextMenu.style.display = 'block';
    nodeContextMenu.style.left = `${e.clientX}px`;
    nodeContextMenu.style.top = `${e.clientY}px`;
    
    // Prevent the click event from propagating
    e.stopPropagation();
}

// Show context menu for edge
function showEdgeContextMenu(e, edgeId) {
    hideContextMenus();
    graph.selectedEdge = edgeId;
    
    // Position the context menu
    edgeContextMenu.style.display = 'block';
    edgeContextMenu.style.left = `${e.clientX}px`;
    edgeContextMenu.style.top = `${e.clientY}px`;
    
    // Prevent the click event from propagating
    e.stopPropagation();
}

// Hide all context menus
function hideContextMenus() {
    nodeContextMenu.style.display = 'none';
    edgeContextMenu.style.display = 'none';
    graph.selectedNode = null;
    graph.selectedEdge = null;
}

// Delete selected node
function deleteSelectedNode() {
    if (graph.selectedNode === null) return;
    
    const nodeId = graph.selectedNode;
    const nodeIndex = graph.nodes.findIndex(n => n.id === nodeId);
    
    if (nodeIndex !== -1) {
        // Remove the node element
        graph.nodes[nodeIndex].element.remove();
        
        // Remove all edges connected to this node
        const edgesToRemove = graph.edges.filter(edge => 
            edge.source === nodeId || edge.target === nodeId
        );
        
        edgesToRemove.forEach(edge => {
            edge.element.remove();
            if (edge.weightElement) {
                edge.weightElement.remove();
            }
        });
        
        // Update edges array
        graph.edges = graph.edges.filter(edge => 
            edge.source !== nodeId && edge.target !== nodeId
        );
        
        // Remove the node from the nodes array
        graph.nodes.splice(nodeIndex, 1);
        
        // Update counters and selectors
        updateNodeCounter();
        updateEdgeCounter();
        updateNodeSelectors();
    }
    
    hideContextMenus();
}

// Delete selected edge
function deleteSelectedEdge() {
    if (graph.selectedEdge === null) return;
    
    const edgeIndex = graph.edges.findIndex(e => e.id === graph.selectedEdge);
    
    if (edgeIndex !== -1) {
        // Remove the edge element
        graph.edges[edgeIndex].element.remove();
        
        // Remove weight element if exists
        if (graph.edges[edgeIndex].weightElement) {
            graph.edges[edgeIndex].weightElement.remove();
        }
        
        // Remove from edges array
        graph.edges.splice(edgeIndex, 1);
        
        // Update counter
        updateEdgeCounter();
    }
    
    hideContextMenus();
}

// Update node selectors in algorithm parameters
function updateNodeSelectors() {
    startNodeSelect.innerHTML = '';
    endNodeSelect.innerHTML = '';
    
    graph.nodes.forEach(node => {
        const option1 = document.createElement('option');
        option1.value = node.id;
        option1.textContent = `Node ${node.id}`;
        startNodeSelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = node.id;
        option2.textContent = `Node ${node.id}`;
        endNodeSelect.appendChild(option2);
    });
}

// Make a node draggable
function makeDraggable(node) {
    let isDragging = false;
    let offsetX, offsetY;
    
    node.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // Only left click
        
        isDragging = true;
        offsetX = e.clientX - node.getBoundingClientRect().left;
        offsetY = e.clientY - node.getBoundingClientRect().top;
        
        // Bring to front
        node.style.zIndex = '100';
        
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const canvas = document.getElementById('graph-canvas');
        const rect = canvas.getBoundingClientRect();
        
        // Calculate new position
        let x = e.clientX - rect.left - offsetX;
        let y = e.clientY - rect.top - offsetY;
        
        // Constrain to canvas
        x = Math.max(0, Math.min(x, rect.width - 30));
        y = Math.max(0, Math.min(y, rect.height - 30));
        
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        
        // Update graph data
        const nodeId = parseInt(node.dataset.id);
        const graphNode = graph.nodes.find(n => n.id === nodeId);
        if (graphNode) {
            graphNode.x = x + 14; // Center of node
            graphNode.y = y + 14;
        }
        
        // Update edges
        updateEdges();
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
        node.style.zIndex = 'auto';
    });
}
// Handle node click for edge creation
function handleNodeClick(e) {
    e.stopPropagation();
    
    const nodeId = parseInt(e.currentTarget.dataset.id);
    
    if (!graph.edgeCreation.active) {
        // Start edge creation
        graph.edgeCreation.active = true;
        graph.edgeCreation.sourceNode = nodeId;
        e.currentTarget.classList.add('ring-2', 'ring-blue-400');
        
        // Update UI
        noEdgeCreation.classList.add('hidden');
        edgeCreationPanel.classList.remove('hidden');
        connectingNodes.textContent = `Node ${nodeId} to ...`;
        
        // Show weight input if graph is weighted
        toggleWeightVisibility();
    } else {
        // Complete edge creation
        if (nodeId !== graph.edgeCreation.sourceNode) {
            graph.edgeCreation.targetNode = nodeId;
            confirmEdge();
        }
    }
}

// Confirm edge creation
function confirmEdge() {
    if (!graph.edgeCreation.active || graph.edgeCreation.sourceNode === null || graph.edgeCreation.targetNode === null) {
        cancelEdge();
        return;
    }
    
    const sourceId = graph.edgeCreation.sourceNode;
    const targetId = graph.edgeCreation.targetNode;
    const isDirected = directedEdgeCheckbox.checked;
    const weight = graphTypeSelect.value === 'weighted' ? parseInt(edgeWeightInput.value) || 1 : null;
    
    // Check if edge already exists
    const edgeExists = graph.edges.some(edge => 
        (edge.source === sourceId && edge.target === targetId) || 
        (!edge.directed && edge.source === targetId && edge.target === sourceId)
    );
    
    if (!edgeExists) {
        // Add edge to graph
        addEdge(sourceId, targetId, isDirected, weight);
    }
    
    cancelEdge();
}

// Cancel edge creation
function cancelEdge() {
    if (graph.edgeCreation.sourceNode !== null) {
        const sourceNode = graph.nodes.find(n => n.id === graph.edgeCreation.sourceNode);
        if (sourceNode) {
            sourceNode.element.classList.remove('ring-2', 'ring-blue-400');
        }
    }
    
    graph.edgeCreation.active = false;
    graph.edgeCreation.sourceNode = null;
    graph.edgeCreation.targetNode = null;
    
    edgeCreationPanel.classList.add('hidden');
    noEdgeCreation.classList.remove('hidden');
}

// Add an edge to the graph
function addEdge(sourceId, targetId, isDirected, weight) {
    const sourceNode = graph.nodes.find(n => n.id === sourceId);
    const targetNode = graph.nodes.find(n => n.id === targetId);
    
    if (!sourceNode || !targetNode) return;
    
    // Create SVG line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', sourceNode.x);
    line.setAttribute('y1', sourceNode.y);
    line.setAttribute('x2', targetNode.x);
    line.setAttribute('y2', targetNode.y);
    line.classList.add('edge');
    if (isDirected) {
        line.classList.add('directed');
    }
    
    // Create edge ID
    const edgeId = `edge-${sourceId}-${targetId}-${graph.edges.length}`;
    line.id = edgeId;
    
    // Add context menu handler
    line.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showEdgeContextMenu(e, edgeId);
    });
    
    // Add weight label if needed
    let weightGroup = null;
    let weightText = null;
    let weightRect = null;
    
    if (weight !== null) {
        const midX = (sourceNode.x + targetNode.x) / 2;
        const midY = (sourceNode.y + targetNode.y) / 2;
        
        weightGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        weightRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        weightRect.setAttribute('x', midX - 15);
        weightRect.setAttribute('y', midY - 12);
        weightRect.setAttribute('width', 30);
        weightRect.setAttribute('height', 20);
        weightRect.setAttribute('class', 'weight-bg');
        
        weightText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        weightText.setAttribute('x', midX);
        weightText.setAttribute('y', midY + 5);
        weightText.setAttribute('text-anchor', 'middle');
        weightText.setAttribute('class', 'weight-label');
        weightText.textContent = weight;
        
        weightGroup.appendChild(weightRect);
        weightGroup.appendChild(weightText);
        graphSvg.appendChild(weightGroup);
    }
    
    graphSvg.appendChild(line);
    
    // Add to graph data
    graph.edges.push({
        id: edgeId,
        source: sourceId,
        target: targetId,
        directed: isDirected,
        weight: weight,
        element: line,
        weightElement: weightGroup,
        weightText: weightText,
        weightRect: weightRect
    });
    
    // Update counter
    updateEdgeCounter();
}

// Update edge positions when nodes are moved
function updateEdges() {
    graph.edges.forEach(edge => {
        const sourceNode = graph.nodes.find(n => n.id === edge.source);
        const targetNode = graph.nodes.find(n => n.id === edge.target);
        
        if (sourceNode && targetNode) {
            edge.element.setAttribute('x1', sourceNode.x);
            edge.element.setAttribute('y1', sourceNode.y);
            edge.element.setAttribute('x2', targetNode.x);
            edge.element.setAttribute('y2', targetNode.y);
            
            if (edge.weightElement && edge.weightText && edge.weightRect) {
                const midX = (sourceNode.x + targetNode.x) / 2;
                const midY = (sourceNode.y + targetNode.y) / 2;
                
                edge.weightRect.setAttribute('x', midX - 15);
                edge.weightRect.setAttribute('y', midY - 12);
                edge.weightText.setAttribute('x', midX);
                edge.weightText.setAttribute('y', midY + 5);
            }
        }
    });
}

// Generate a random graph
function generateRandomGraph() {
    clearGraph();
    
    const nodeCount = Math.floor(Math.random() * 8) + 3; // 3-10 nodes
    const density = Math.random() * 0.6 + 0.2; // 20-80% density
    
    generateGraph(nodeCount, density);
    
    // Show new graph button if we're on graph 1
    if (graph.currentGraph === 1) {
        newGraphBtn.classList.remove('hidden');
    }
}

// Generate graph with parameters
function generateGraphWithParams() {
    clearGraph();
    
    const structure = graphStructureSelect.value;
    const graphType = graphTypeSelect.value;
    
    switch (structure) {
        case 'random':
            const nodeCount = parseInt(nodeCountInput.value);
            const density = parseInt(densityInput.value) / 100;
            generateGraph(nodeCount, density);
            break;
        case 'cycle':
            const cycleSize = parseInt(cycleSizeInput.value);
            generateCycleGraph(cycleSize);
            break;
        case 'complete':
            const completeSize = parseInt(completeSizeInput.value);
            generateCompleteGraph(completeSize);
            break;
        case 'wheel':
            const wheelSize = parseInt(wheelSizeInput.value);
            generateWheelGraph(wheelSize);
            break;
        case 'complete-bipartite':
            const m = parseInt(bipartiteMInput.value);
            const n = parseInt(bipartiteNInput.value);
            generateCompleteBipartiteGraph(m, n);
            break;
    }
    
    // Show new graph button if we're on graph 1
    if (graph.currentGraph === 1) {
        newGraphBtn.classList.remove('hidden');
    }
}

// Generate cycle graph (Cn)
function generateCycleGraph(n) {
    if (n < 3) return;
    
    const canvas = document.getElementById('graph-canvas');
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.4;
    
    // Add nodes in a circle
    for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * i) / n;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        const nodeId = graph.nextNodeId++;
        const node = document.createElement('div');
        node.className = 'node absolute w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-xs font-bold text-slate-200 cursor-move select-none';
        node.style.left = `${x - 14}px`;
        node.style.top = `${y - 14}px`;
        node.textContent = nodeId;
        node.dataset.id = nodeId;
        
        makeDraggable(node);
        node.addEventListener('click', handleNodeClick);
        node.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showNodeContextMenu(e, nodeId);
        });
        
        nodesContainer.appendChild(node);
        graph.nodes.push({
            id: nodeId,
            element: node,
            x: x,
            y: y
        });
    }
    
    // Add edges to form a cycle
    for (let i = 0; i < n; i++) {
        const sourceId = graph.nodes[i].id;
        const targetId = graph.nodes[(i + 1) % n].id;
        const weight = graphTypeSelect.value === 'weighted' ? Math.floor(Math.random() * 20) + 1 : null;
        addEdge(sourceId, targetId, false, weight);
    }
    
    updateNodeCounter();
    updateEdgeCounter();
    updateNodeSelectors();
}

// Generate complete graph (Kn)
function generateCompleteGraph(n) {
    if (n < 2) return;
    
    const canvas = document.getElementById('graph-canvas');
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.4;
    
    // Add nodes in a circle
    for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * i) / n;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        const nodeId = graph.nextNodeId++;
        const node = document.createElement('div');
        node.className = 'node absolute w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-xs font-bold text-slate-200 cursor-move select-none';
        node.style.left = `${x - 14}px`;
        node.style.top = `${y - 14}px`;
        node.textContent = nodeId;
        node.dataset.id = nodeId;
        
        makeDraggable(node);
        node.addEventListener('click', handleNodeClick);
        node.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showNodeContextMenu(e, nodeId);
        });
        
        nodesContainer.appendChild(node);
        graph.nodes.push({
            id: nodeId,
            element: node,
            x: x,
            y: y
        });
    }
    
    // Add edges between all pairs of nodes
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const sourceId = graph.nodes[i].id;
            const targetId = graph.nodes[j].id;
            const weight = graphTypeSelect.value === 'weighted' ? Math.floor(Math.random() * 20) + 1 : null;
            addEdge(sourceId, targetId, false, weight);
        }
    }
    
    updateNodeCounter();
    updateEdgeCounter();
    updateNodeSelectors();
}

// Generate wheel graph (Wn)
function generateWheelGraph(n) {
    if (n < 4) return;
    
    const canvas = document.getElementById('graph-canvas');
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.4;
    
    // Add center node
    const centerId = graph.nextNodeId++;
    const centerNode = document.createElement('div');
    centerNode.className = 'node absolute w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-xs font-bold text-slate-200 cursor-move select-none';
    centerNode.style.left = `${centerX - 14}px`;
    centerNode.style.top = `${centerY - 14}px`;
    centerNode.textContent = centerId;
    centerNode.dataset.id = centerId;
    
    makeDraggable(centerNode);
    centerNode.addEventListener('click', handleNodeClick);
    centerNode.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showNodeContextMenu(e, centerId);
    });
    
    nodesContainer.appendChild(centerNode);
    graph.nodes.push({
        id: centerId,
        element: centerNode,
        x: centerX,
        y: centerY
    });
    
    // Add outer nodes in a circle
    for (let i = 0; i < n - 1; i++) {
        const angle = (2 * Math.PI * i) / (n - 1);
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        const nodeId = graph.nextNodeId++;
        const node = document.createElement('div');
        node.className = 'node absolute w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-xs font-bold text-slate-200 cursor-move select-none';
        node.style.left = `${x - 14}px`;
        node.style.top = `${y - 14}px`;
        node.textContent = nodeId;
        node.dataset.id = nodeId;
        
        makeDraggable(node);
        node.addEventListener('click', handleNodeClick);
        node.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showNodeContextMenu(e, nodeId);
        });
        
        nodesContainer.appendChild(node);
        graph.nodes.push({
            id: nodeId,
            element: node,
            x: x,
            y: y
        });
    }
    
    // Add edges from center to all outer nodes
    for (let i = 1; i < n; i++) {
        const sourceId = graph.nodes[0].id;
        const targetId = graph.nodes[i].id;
        const weight = graphTypeSelect.value === 'weighted' ? Math.floor(Math.random() * 20) + 1 : null;
        addEdge(sourceId, targetId, false, weight);
    }
    
    // Add edges between outer nodes to form a cycle
    for (let i = 1; i < n; i++) {
        const sourceId = graph.nodes[i].id;
        const targetId = graph.nodes[i % (n - 1) + 1].id;
        const weight = graphTypeSelect.value === 'weighted' ? Math.floor(Math.random() * 20) + 1 : null;
        addEdge(sourceId, targetId, false, weight);
    }
    
    updateNodeCounter();
    updateEdgeCounter();
    updateNodeSelectors();
}

// Generate complete bipartite graph (Km,n)
function generateCompleteBipartiteGraph(m, n) {
    if (m < 1 || n < 1) return;
    
    const canvas = document.getElementById('graph-canvas');
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const leftX = width * 0.3;
    const rightX = width * 0.7;
    const startY = height * 0.2;
    const endY = height * 0.8;
    
    // Add nodes for partition A (left side)
    for (let i = 0; i < m; i++) {
        const y = startY + (endY - startY) * i / Math.max(1, m - 1);
        
        const nodeId = graph.nextNodeId++;
        const node = document.createElement('div');
        node.className = 'node absolute w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-xs font-bold text-slate-200 cursor-move select-none';
        node.style.left = `${leftX - 14}px`;
        node.style.top = `${y - 14}px`;
        node.textContent = nodeId;
        node.dataset.id = nodeId;
        
        makeDraggable(node);
        node.addEventListener('click', handleNodeClick);
        node.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showNodeContextMenu(e, nodeId);
        });
        
        nodesContainer.appendChild(node);
        graph.nodes.push({
            id: nodeId,
            element: node,
            x: leftX,
            y: y
        });
    }
    
    // Add nodes for partition B (right side)
    for (let i = 0; i < n; i++) {
        const y = startY + (endY - startY) * i / Math.max(1, n - 1);
        
        const nodeId = graph.nextNodeId++;
        const node = document.createElement('div');
        node.className = 'node absolute w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-xs font-bold text-slate-200 cursor-move select-none';
        node.style.left = `${rightX - 14}px`;
        node.style.top = `${y - 14}px`;
        node.textContent = nodeId;
        node.dataset.id = nodeId;
        
        makeDraggable(node);
        node.addEventListener('click', handleNodeClick);
        node.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showNodeContextMenu(e, nodeId);
        });
        
        nodesContainer.appendChild(node);
        graph.nodes.push({
            id: nodeId,
            element: node,
            x: rightX,
            y: y
        });
    }
    
    // Add edges between all nodes in partition A and partition B
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            const sourceId = graph.nodes[i].id;
            const targetId = graph.nodes[m + j].id;
            const weight = graphTypeSelect.value === 'weighted' ? Math.floor(Math.random() * 20) + 1 : null;
            addEdge(sourceId, targetId, false, weight);
        }
    }
    
    updateNodeCounter();
    updateEdgeCounter();
    updateNodeSelectors();
}

// Generate graph with specific node count and density
function generateGraph(nodeCount, density) {
    // Add nodes
    for (let i = 0; i < nodeCount; i++) {
        addNode();
    }
    
    // Add edges based on density
    const maxEdges = nodeCount * (nodeCount - 1) / 2;
    const targetEdges = Math.floor(maxEdges * density);
    const graphType = graphTypeSelect.value;
    
    let edgesAdded = 0;
    
    // Connect nodes to form a minimum spanning tree first
    for (let i = 1; i < nodeCount; i++) {
        const source = Math.floor(Math.random() * i);
        const weight = graphType === 'weighted' ? Math.floor(Math.random() * 20) + 1 : null;
        addEdge(graph.nodes[source].id, graph.nodes[i].id, graphType === 'directed', weight);
        edgesAdded++;
    }
    
    // Add remaining edges randomly
    while (edgesAdded < targetEdges) {
        const source = Math.floor(Math.random() * nodeCount);
        let target = Math.floor(Math.random() * nodeCount);
        
        // Ensure target is different from source
        while (target === source) {
            target = Math.floor(Math.random() * nodeCount);
        }
        
        // Check if edge already exists
        const edgeExists = graph.edges.some(edge => 
            (edge.source === graph.nodes[source].id && edge.target === graph.nodes[target].id) || 
            (!edge.directed && edge.source === graph.nodes[target].id && edge.target === graph.nodes[source].id)
        );
        
        if (!edgeExists) {
            const weight = graphType === 'weighted' ? Math.floor(Math.random() * 20) + 1 : null;
            addEdge(graph.nodes[source].id, graph.nodes[target].id, graphType === 'directed', weight);
            edgesAdded++;
        }
    }
}

// Clear the graph
function clearGraph() {
    clearGraphDisplay();

    graphSvg.innerHTML = `
        <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto" class="arrowhead">
                <polygon points="0 0, 10 3.5, 0 7"/>
            </marker>
            <marker id="arrowhead-visited" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto" class="arrowhead-visited">
                <polygon points="0 0, 10 3.5, 0 7"/>
            </marker>
            <marker id="arrowhead-shortest" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto" class="arrowhead-shortest">
                <polygon points="0 0, 10 3.5, 0 7"/>
            </marker>
            <marker id="arrowhead-eulerian" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto" class="arrowhead-eulerian">
                <polygon points="0 0, 10 3.5, 0 7"/>
            </marker>
            <marker id="arrowhead-hamiltonian" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto" class="arrowhead-hamiltonian">
                <polygon points="0 0, 10 3.5, 0 7"/>
            </marker>
        </defs>
    `;
    nodesContainer.innerHTML = '';
    

    
    graph.nodes = [];
    graph.edges = [];
    graph.nextNodeId = 0;

    graph.graphs[graph.currentGraph] = { nodes: [], edges: []};

    updateNodeCounter();
    updateEdgeCounter();
    
    // Reset results
    noResults.classList.remove('hidden');
    resultsTableContainer.classList.add('hidden');
    isomorphismResults.classList.add('hidden');
    
    // Hide algorithm parameters and color key
    algorithmParams.classList.add('hidden');
    colorKeyLegend.classList.add('hidden');



}

// Update node counter
function updateNodeCounter() {
    nodeCounter.textContent = graph.nodes.length;
}

// Update edge counter
function updateEdgeCounter() {
    edgeCounter.textContent = graph.edges.length;
}

// Update node count value display
function updateNodeCountValue() {
    nodeCountValue.textContent = nodeCountInput.value;
}

// Update density value display
function updateDensityValue() {
    densityValue.textContent = densityInput.value;
}

// Toggle weight visibility based on graph type
function toggleWeightVisibility() {
    if (graphTypeSelect.value === 'weighted') {
        weightContainer.classList.remove('hidden');
    } else {
        weightContainer.classList.add('hidden');
    }
}
function deleteAllGraphs() {
    // 1. Confirmation dialog
    if (!confirm("This will PERMANENTLY delete ALL graphs (1 & 2). Continue?")) {
        return;
    }

    // 2. Clear visual elements
    clearGraphDisplay();
    
    // 3. Reset BOTH graphs in memory
    graph.graphs = {
        1: { nodes: [], edges: [] }, // Empty Graph 1
        2: { nodes: [], edges: [] }  // Empty Graph 2
    };
    
    // 4. Reset current working graph
    graph.currentGraph = 1;
    graph.nodes = [];
    graph.edges = [];
    graph.nextNodeId = 0;
    
    // 5. Update UI
    updateGraphSelector();
    updateNodeCounter();
    updateEdgeCounter();
    
    // 7. Force save the empty state
    saveCurrentGraph();
    
    // 8. Visual feedback
    alert("All graphs have been deleted. Reset to empty Graph 1.");
}

function verifyGraph() {
    console.log("Current Graph:", {
        nodes: graph.nodes.map(n => n.id),
        edges: graph.edges.map(e => `${e.source}->${e.target}`),
        directed: graph.edges.some(e => e.directed),
        weighted: graph.edges.some(e => e.weight !== null)
    });
}

// Select algorithm
function selectAlgorithm(e) {
    // Remove active class from all buttons
    algorithmBtns.forEach(btn => {
        btn.classList.remove('ring-2', 'ring-teal-400');
    });
    
    // Add active class to clicked button
    e.currentTarget.classList.add('ring-2', 'ring-teal-400');
    
    // Update selected algorithm
    const algoName = e.currentTarget.getAttribute('data-algo');
    graph.selectedAlgorithm = algoName;
    
    // Show algorithm explanation
    showAlgorithmExplanation(algoName);
    
    // Show/hide algorithm parameters
    updateAlgorithmParameters(algoName);
}
function getCurrentGraphData() {
        return {
            nodes: graph.nodes,
            edges: graph.edges,
            nextNodeId: graph.nextNodeId
        };
    }

    // Function to set the current graph data
    function setCurrentGraphData(graphData) {
        graph.nodes = graphData.nodes || [];
        graph.edges = graphData.edges || [];
        graph.nextNodeId = graphData.nextNodeId || 0;
    }

    // Function to update the graph selector dropdown
    function updateGraphSelector() {
        graphSelector.innerHTML = '';
        Object.keys(graph.graphs).forEach(graphId => {
            const option = document.createElement('option');
            option.value = graphId;
            option.textContent = `Graph ${graphId}`;
            if (parseInt(graphId) === graph.currentGraph) {
                option.selected = true;
            }
            graphSelector.appendChild(option);
        });
        
        // Show/hide the graph selector based on number of graphs
        graphSelectorContainer.classList.toggle('hidden', Object.keys(graph.graphs).length <= 1);
    }



// Show algorithm explanation
function showAlgorithmExplanation(algoName) {
    const explanation = algorithmExplanations[algoName];
    if (!explanation) return;
    
    algoTitle.textContent = explanation.title;
    algoDescription.textContent = explanation.description;
    algoComplexity.textContent = explanation.complexity;
    
    algorithmExplanation.classList.remove('hidden');
}

// Update algorithm parameters section
function updateAlgorithmParameters(algoName) {
    const explanation = algorithmExplanations[algoName];
    if (!explanation) return;
    
    if (explanation.needsStartNode || explanation.needsEndNode) {
        algorithmParams.classList.remove('hidden');
        startNodeContainer.classList.toggle('hidden', !explanation.needsStartNode);
        endNodeContainer.classList.toggle('hidden', !explanation.needsEndNode);
    } else {
        algorithmParams.classList.add('hidden');
    }
}

// Check if graph has Eulerian path or circuit
function hasEulerianPath() {
    let oddDegreeCount = 0;
    const degrees = {};
    
    // Initialize degrees
    graph.nodes.forEach(node => {
        degrees[node.id] = 0;
    });
    
    // Calculate degrees
    graph.edges.forEach(edge => {
        degrees[edge.source]++;
        if (!edge.directed) {
            degrees[edge.target]++;
        }
    });
    
    // Count odd degree nodes
    graph.nodes.forEach(node => {
        if (degrees[node.id] % 2 !== 0) {
            oddDegreeCount++;
        }
    });
    
    // For undirected graphs:
    // - Eulerian circuit: all nodes have even degree
    // - Eulerian path: exactly 0 or 2 nodes have odd degree
    return {
        hasCircuit: oddDegreeCount === 0,
        hasPath: oddDegreeCount === 0 || oddDegreeCount === 2,
        degrees: degrees
    };
}

// Find Eulerian path using Hierholzer's algorithm
function findEulerianPath() {
    // Make a copy of edges to work with
    const edgeCopies = [...graph.edges];
    const path = [];
    const circuit = [];
    
    // Start with any node that has odd degree (for path) or any node (for circuit)
    const eulerianInfo = hasEulerianPath();
    let currentNode = null;
    
    // Find starting node (odd degree node for path, any node for circuit)
    if (eulerianInfo.hasCircuit) {
        currentNode = graph.nodes[0].id;
    } else {
        // Find a node with odd degree
        for (const node of graph.nodes) {
            if (eulerianInfo.degrees[node.id] % 2 !== 0) {
                currentNode = node.id;
                break;
            }
        }
    }
    
    path.push(currentNode);
    
    while (path.length > 0) {
        currentNode = path[path.length - 1];
        
        // Find an edge from current node
        const edgeIndex = edgeCopies.findIndex(edge => 
            edge.source === currentNode || (!edge.directed && edge.target === currentNode)
        );
        
        if (edgeIndex !== -1) {
            const edge = edgeCopies[edgeIndex];
            const nextNode = edge.source === currentNode ? edge.target : edge.source;
            
            // Remove the edge (since we can't use it again)
            edgeCopies.splice(edgeIndex, 1);
            
            // Move to next node
            path.push(nextNode);
        } else {
            // No more edges from this node, add to circuit
            circuit.push(path.pop());
        }
    }
    
    // The circuit is in reverse order
    return circuit.reverse();
}

// Check if graph might have Hamiltonian cycle (Dirac's theorem)
function hasPotentialHamiltonianCycle() {
    if (graph.nodes.length < 3) return false;
    
    // Dirac's theorem: if each vertex has degree ≥ n/2, then graph is Hamiltonian
    const degrees = {};
    
    // Initialize degrees
    graph.nodes.forEach(node => {
        degrees[node.id] = 0;
    });
    
    // Calculate degrees
    graph.edges.forEach(edge => {
        degrees[edge.source]++;
        if (!edge.directed) {
            degrees[edge.target]++;
        }
    });
    
    // Check Dirac's condition
    const minDegree = Math.min(...Object.values(degrees));
    return minDegree >= graph.nodes.length / 2;
}

// Try to find Hamiltonian path using backtracking
function findHamiltonianPath() {
    const path = [];
    const visited = new Set();
    let found = false;
    
    // Start with any node
    const startNode = graph.nodes[0].id;
    
    function backtrack(currentNode) {
        visited.add(currentNode);
        path.push(currentNode);
        
        // If all nodes visited, check if it's a cycle
        if (path.length === graph.nodes.length) {
            // Check if last node connects back to first node
            const hasClosingEdge = graph.edges.some(edge => 
                (edge.source === currentNode && edge.target === startNode) ||
                (!edge.directed && edge.source === startNode && edge.target === currentNode)
            );
            
            if (hasClosingEdge) {
                path.push(startNode); // Make it a cycle
            }
            
            found = true;
            return;
        }
        
        // Try all neighbors
        const edges = graph.edges.filter(edge => 
            edge.source === currentNode || (!edge.directed && edge.target === currentNode)
        );
        
        for (const edge of edges) {
            if (found) return;
            
            const nextNode = edge.source === currentNode ? edge.target : edge.source;
            if (!visited.has(nextNode)) {
                backtrack(nextNode);
                if (!found) {
                    visited.delete(nextNode);
                    path.pop();
                }
            }
        }
    }
    
    backtrack(startNode);
    return found ? path : null;
}

// Visualize a path (for Eulerian or Hamiltonian)
function visualizePath(path, type) {
    const nodeClass = type === 'eulerian' ? 'eulerian-node' : 'hamiltonian-node';
    const edgeClass = type === 'eulerian' ? 'eulerian-edge' : 'hamiltonian-edge';
    
    // Highlight nodes in path
    path.forEach((nodeId, index) => {
        setTimeout(() => {
            const node = graph.nodes.find(n => n.id === nodeId);
            if (node) {
                node.element.classList.add(nodeClass);
            }
        }, index * 500);
    });
    
    // Highlight edges in path
    for (let i = 0; i < path.length - 1; i++) {
        setTimeout(() => {
            const sourceId = path[i];
            const targetId = path[i + 1];
            
            // Find edge between these nodes
            const edge = graph.edges.find(e => 
                (e.source === sourceId && e.target === targetId) ||
                (!e.directed && e.source === targetId && e.target === sourceId)
            );
            
            if (edge) {
                edge.element.classList.add(edgeClass);
                if (edge.directed) {
                    edge.element.setAttribute('marker-end', `url(#arrowhead-${type})`);
                }
            }
        }, i * 500 + 250);
    }
}

// Run Eulerian path/circuit algorithm
function runEulerian() {
    // Show loading state
    noResults.classList.add('hidden');
    resultsTableContainer.classList.remove('hidden');
    isomorphismResults.classList.add('hidden');
    resultsTableBody.innerHTML = '<tr><td colspan="3" class="text-center py-2">Checking for Eulerian path/circuit...</td></tr>';
    
    // Check if graph has Eulerian path or circuit
    const eulerianInfo = hasEulerianPath();
    
    setTimeout(() => {
        if (!eulerianInfo.hasPath) {
            resultsTableBody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center py-4">
                        <div class="text-rose-500 font-semibold">No Eulerian path or circuit exists</div>
                        <div class="text-sm text-slate-400 mt-2">Graph has ${Object.values(eulerianInfo.degrees).filter(d => d % 2 !== 0).length} nodes with odd degree</div>
                    </td>
                </tr>
            `;
            return;
        }
        
        // Find the path
        const path = findEulerianPath();
        
        // Display results
        resultsTableBody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center py-4">
                    <div class="text-purple-400 font-semibold">
                        ${eulerianInfo.hasCircuit ? 'Eulerian Circuit Found' : 'Eulerian Path Found'}
                    </div>
                    <div class="text-sm text-slate-400 mt-2">Path length: ${path.length} nodes</div>
                </td>
            </tr>
            <tr>
                <td colspan="3" class="px-4 py-2">
                    <div class="text-xs font-mono bg-slate-800 p-2 rounded">${path.join(' → ')}</div>
                </td>
            </tr>
        `;
        
        // Visualize the path
        visualizePath(path, 'eulerian');
    }, 1000);
}

// Run Hamiltonian path/cycle algorithm
function runHamiltonian() {
    // Show loading state
    noResults.classList.add('hidden');
    resultsTableContainer.classList.remove('hidden');
    isomorphismResults.classList.add('hidden');
    resultsTableBody.innerHTML = '<tr><td colspan="3" class="text-center py-2">Checking for Hamiltonian path/cycle...</td></tr>';
    
    setTimeout(() => {
        // Try to find a Hamiltonian path
        const path = findHamiltonianPath();
        
        if (!path) {
            resultsTableBody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center py-4">
                        <div class="text-rose-500 font-semibold">No Hamiltonian path found</div>
                        <div class="text-sm text-slate-400 mt-2">Note: Hamiltonian path detection is NP-complete</div>
                    </td>
                </tr>
            `;
            return;
        }
        
        // Determine if it's a cycle
        const isCycle = path[0] === path[path.length - 1];
        
        // Display results
        resultsTableBody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center py-4">
                    <div class="text-pink-400 font-semibold">
                        ${isCycle ? 'Hamiltonian Cycle Found' : 'Hamiltonian Path Found'}
                    </div>
                    <div class="text-sm text-slate-400 mt-2">Path length: ${isCycle ? path.length - 1 : path.length} nodes</div>
                </td>
            </tr>
            <tr>
                <td colspan="3" class="px-4 py-2">
                    <div class="text-xs font-mono bg-slate-800 p-2 rounded">${path.join(' → ')}</div>
                </td>
            </tr>
        `;
        
        // Visualize the path
        visualizePath(path, 'hamiltonian');
    }, 1000);
}

// Enhanced Prim's Algorithm
function runPrim(startNodeId) {
    // Show loading state
    startNodeId = typeof startNodeId === 'string' ? parseInt(startNodeId) : startNodeId;
    
    // Clear previous results and show loading state
    noResults.classList.add('hidden');
    resultsTableContainer.classList.remove('hidden');
    resultsTableBody.innerHTML = '<tr><td colspan="3" class="text-center py-2">Running Prim\'s Algorithm...</td></tr>';

    // Reset graph visualization
    resetGraphVisualization();

    // Find start node
    const startNode = graph.nodes.find(n => n.id === startNodeId);
    if (!startNode) {
        showNodeNotFoundError(startNodeId);
        return;
    }

    // Highlight start node
    startNode.element.classList.add('start-node');

    // Build adjacency list
    const adjList = buildAdjacencyList();
    
    // Initialize algorithm state
    const inMST = new Set([startNodeId]);
    const edgeQueue = new PriorityQueue((a, b) => a.weight - b.weight);
    const mstEdges = [];
    let totalWeight = 0;

    // Enqueue initial edges
    adjList[startNodeId].forEach(neighbor => {
        edgeQueue.enqueue({
            from: startNodeId,
            to: neighbor.node,
            weight: neighbor.weight,
            edge: neighbor.edge
        });
    });

    // Process each step
    const processStep = () => {
        if (inMST.size === graph.nodes.length) {
            displayFinalResults(mstEdges, totalWeight);
            return;
        }

        if (edgeQueue.isEmpty()) {
            showPartialMSTWarning(mstEdges, inMST.size);
            return;
        }

        const currentEdge = edgeQueue.dequeue();
        const { from, to, weight, edge } = currentEdge;
        const edgeElement = edge.element;

        // Check if edge connects to new node
        const fromInMST = inMST.has(from);
        const toInMST = inMST.has(to);
        let newNode = null;

        if (fromInMST && !toInMST) {
            newNode = to;
        } else if (!fromInMST && toInMST) {
            newNode = from;
        }

        if (newNode) {
            // Add to MST
            inMST.add(newNode);
            mstEdges.push(currentEdge);
            totalWeight += weight;

            // Visualize
            edgeElement.classList.add('shortest');
            if (edge.directed) {
                edgeElement.setAttribute('marker-end', 'url(#arrowhead-shortest)');
            }
            
            const node = graph.nodes.find(n => n.id === newNode);
            if (node) node.element.classList.add('visited-node');

            // Add new edges to queue
            adjList[newNode].forEach(neighbor => {
                if (!inMST.has(neighbor.node)) {
                    edgeQueue.enqueue({
                        from: newNode,
                        to: neighbor.node,
                        weight: neighbor.weight,
                        edge: neighbor.edge
                    });
                }
            });
        } else {
            edgeElement.classList.add('rejected');
        }

        // Update progress in table
        updateProgressTable(mstEdges, totalWeight, inMST.size);
        
        // Continue processing
        setTimeout(processStep, 800);
    };

    // Start processing
    setTimeout(processStep, 500);

    // Helper functions
    function buildAdjacencyList() {
        const adjList = {};
        graph.nodes.forEach(node => adjList[node.id] = []);
        
        graph.edges.forEach(edge => {
            adjList[edge.source].push({
                node: edge.target,
                weight: edge.weight || 1,
                edge: edge
            });
            
            if (!edge.directed) {
                adjList[edge.target].push({
                    node: edge.source,
                    weight: edge.weight || 1,
                    edge: edge
                });
            }
        });
        return adjList;
    }

    function showNodeNotFoundError(nodeId) {
        resultsTableBody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center py-4">
                    <div class="text-rose-500 font-semibold">Start node ${nodeId} not found!</div>
                    <div class="text-sm text-slate-400 mt-2">
                        Available nodes: ${graph.nodes.map(n => n.id).join(', ')}
                    </div>
                </td>
            </tr>
        `;
    }

    function updateProgressTable(edges, weight, nodesInMST) {
        const rows = [
            `<tr><td colspan="3" class="font-semibold bg-slate-100">MST Progress (${nodesInMST}/${graph.nodes.length} nodes)</td></tr>`,
            `<tr><td colspan="3">Total Weight So Far: ${weight}</td></tr>`
        ];

        edges.forEach((edge, i) => {
            rows.push(`<tr><td>Edge ${i+1}</td><td>${edge.from} → ${edge.to}</td><td>${edge.weight}</td></tr>`);
        });

        resultsTableBody.innerHTML = rows.join('');
    }

    function displayFinalResults(edges, weight) {
        const rows = [
            `<tr><td colspan="3" class="font-semibold bg-slate-100">MST Found (${edges.length} edges)</td></tr>`,
            `<tr><td colspan="3" class="font-semibold">Total Weight: ${weight}</td></tr>`
        ];

        edges.forEach((edge, i) => {
            rows.push(`<tr><td>Edge ${i+1}</td><td>${edge.from} → ${edge.to}</td><td>${edge.weight}</td></tr>`);
        });

        resultsTableBody.innerHTML = rows.join('');
    }

    function showPartialMSTWarning(edges, nodesReached) {
        resultsTableBody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center py-4">
                    <div class="text-amber-500 font-semibold">Partial MST Found</div>
                    <div class="text-sm text-slate-400 mt-2">
                        Only reached ${nodesReached} of ${graph.nodes.length} nodes
                    </div>
                    ${edges.length > 0 ? `
                    <div class="mt-4">
                        <div class="font-semibold">Connected Component (${edges.length} edges)</div>
                        <div class="text-sm">Total Weight: ${edges.reduce((sum, e) => sum + e.weight, 0)}</div>
                    </div>
                    ` : ''}
                </td>
            </tr>
        `;
    }
}


// Enhanced Kruskal's Algorithm
function runKruskal() {
    // Show loading state
    noResults.classList.add('hidden');
    resultsTableContainer.classList.remove('hidden');
    isomorphismResults.classList.add('hidden');
    resultsTableBody.innerHTML = '<tr><td colspan="3" class="text-center py-2">Finding Minimum Spanning Tree...</td></tr>';
    
    // Initialize Union-Find data structure
    const parent = {};
    const rank = {};
    graph.nodes.forEach(node => {
        parent[node.id] = node.id;
        rank[node.id] = 0;
    });
    
    function find(u) {
        if (parent[u] !== u) {
            parent[u] = find(parent[u]); // Path compression
        }
        return parent[u];
    }
    
    function union(u, v) {
        const rootU = find(u);
        const rootV = find(v);
        if (rootU !== rootV) {
            // Union by rank
            if (rank[rootU] > rank[rootV]) {
                parent[rootV] = rootU;
            } else if (rank[rootU] < rank[rootV]) {
                parent[rootU] = rootV;
            } else {
                parent[rootV] = rootU;
                rank[rootU]++;
            }
            return true;
        }
        return false;
    }
    
    // Sort all edges by weight
    const sortedEdges = graph.edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        weight: edge.weight || 1,
        directed: edge.directed
    })).sort((a, b) => a.weight - b.weight);
    
    const mstEdges = [];
    const mstWeight = { total: 0 };
    let edgeIndex = 0;
    
    const processStep = () => {
        if (mstEdges.length === graph.nodes.length - 1 || edgeIndex >= sortedEdges.length) {
            // MST complete or no more edges
            displayMSTResults(mstEdges, mstWeight.total);
            return;
        }
        
        const currentEdge = sortedEdges[edgeIndex++];
        
        setTimeout(() => {
            if (union(currentEdge.source, currentEdge.target)) {
                // Add to MST
                mstEdges.push(currentEdge);
                mstWeight.total += currentEdge.weight;
                
                // Visualize
                const edge = graph.edges.find(e => e.id === currentEdge.id);
                if (edge) {
                    edge.element.classList.add('shortest');
                    if (edge.directed) {
                        edge.element.setAttribute('marker-end', 'url(#arrowhead-shortest)');
                    }
                }
                
                // Highlight nodes if first time visited
                if (!mstEdges.some(e => e.source === currentEdge.source || e.target === currentEdge.source)) {
                    const node = graph.nodes.find(n => n.id === currentEdge.source);
                    if (node) node.element.classList.add('visited-node');
                }
                if (!mstEdges.some(e => e.source === currentEdge.target || e.target === currentEdge.target)) {
                    const node = graph.nodes.find(n => n.id === currentEdge.target);
                    if (node) node.element.classList.add('visited-node');
                }
            } else {
                // Edge would create cycle - reject
                const edge = graph.edges.find(e => e.id === currentEdge.id);
                if (edge) {
                    edge.element.classList.add('rejected');
                }
            }
            
            // Process next step
            setTimeout(processStep, 500);
        }, 0);
    };
    
    // Start processing
    processStep();
}

function displayMSTResults(mstEdges, totalWeight) {
    resultsTableBody.innerHTML = '';
    
    // Add summary row
    const summaryRow = document.createElement('tr');
    summaryRow.innerHTML = `
        <td colspan="3" class="text-center py-2">
            <div class="font-semibold text-teal-400">MST Found (${mstEdges.length} edges)</div>
            <div class="text-sm">Total Weight: ${totalWeight}</div>
        </td>
    `;
    resultsTableBody.appendChild(summaryRow);
    
    // Add edge details
    mstEdges.forEach((edge, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Edge ${index + 1}</td>
            <td>${edge.source} → ${edge.target}</td>
            <td>${edge.weight}</td>
        `;
        resultsTableBody.appendChild(row);
    });
}


// Enhanced Kuratowski's Algorithm
function runKuratowski() {
            // Show loading state
    noResults.classList.add('hidden');
    resultsTableContainer.classList.remove('hidden');
    isomorphismResults.classList.add('hidden');
    resultsTableBody.innerHTML = '<tr><td colspan="3" class="text-center py-2">Analyzing graph planarity...</td></tr>';
    
    setTimeout(() => {
        // 1. First check Euler's formula conditions
        const eulerCheck = checkEulerConditions();
        
        // 2. Check for K₅ (complete graph with 5 vertices)
        const potentialK5 = findCompleteSubgraph(5);
        
        // 3. Check for K₃,₃ (complete bipartite graph with 3+3 vertices)
        const potentialK33 = findBipartiteSubgraph(3, 3);
        
        // Prepare results table
        resultsTableBody.innerHTML = '';
        
        // Add Euler's formula results
        const eulerRow = document.createElement('tr');
        eulerRow.innerHTML = `
            <td colspan="3" class="px-4 py-2">
                <div class="font-semibold ${eulerCheck.violatesEuler ? 'text-rose-500' : 'text-teal-400'}">
                    Euler's Formula Check
                </div>
                <div class="text-sm text-slate-400 mt-1">
                    V - E + F = ${eulerCheck.v} - ${eulerCheck.e} + ${eulerCheck.f} = ${eulerCheck.result}
                    (${eulerCheck.violatesEuler ? 'Violates planarity' : 'Satisfies planarity'})
                </div>
                ${eulerCheck.violatesEuler ? `
                <div class="text-xs text-rose-400 mt-1">
                    Warning: Graph violates Euler's formula for planar graphs (V - E + F = 2)
                </div>
                ` : ''}
            </td>
        `;
        resultsTableBody.appendChild(eulerRow);
        
        // Add edge count check
        const edgeRow = document.createElement('tr');
        edgeRow.innerHTML = `
            <td colspan="3" class="px-4 py-2">
                <div class="font-semibold ${eulerCheck.tooManyEdges ? 'text-rose-500' : 'text-teal-400'}">
                    Edge Count Check
                </div>
                <div class="text-sm text-slate-400 mt-1">
                    For V ≥ 3, E ≤ 3V - 6: ${eulerCheck.e} ≤ ${3*eulerCheck.v - 6} 
                    (${eulerCheck.tooManyEdges ? 'Too many edges' : 'Within limit'})
                </div>
                ${eulerCheck.tooManyEdges ? `
                <div class="text-xs text-rose-400 mt-1">
                    Warning: Graph has too many edges for a planar graph (E > 3V - 6)
                </div>
                ` : ''}
            </td>
        `;
        resultsTableBody.appendChild(edgeRow);
        
        // Add K5/K33 check results
        if (potentialK5 || potentialK33) {
            // Found a Kuratowski subgraph
            const subgraph = potentialK5 || potentialK33;
            const type = potentialK5 ? "K₅" : "K₃,₃";
            
            // Highlight the subgraph
            subgraph.nodes.forEach((nodeId, index) => {
                setTimeout(() => {
                    const node = graph.nodes.find(n => n.id === nodeId);
                    if (node) {
                        node.element.classList.add('kuratowski');
                    }
                }, index * 300);
            });
            
            subgraph.edges.forEach((edgeId, index) => {
                setTimeout(() => {
                    const edge = graph.edges.find(e => e.id === edgeId);
                    if (edge) {
                        edge.element.classList.add('kuratowski');
                    }
                }, (subgraph.nodes.length + index) * 300);
            });
            
            const kuratowskiRow = document.createElement('tr');
            kuratowskiRow.innerHTML = `
                <td colspan="3" class="px-4 py-2">
                    <div class="font-semibold text-rose-500">
                        Kuratowski Subgraph Found
                    </div>
                    <div class="text-sm text-slate-400 mt-1">
                        Type: ${type} subdivision
                    </div>
                    <div class="text-xs font-mono bg-slate-800 p-2 rounded mt-1">
                        Nodes: ${subgraph.nodes.join(', ')}
                    </div>
                </td>
            `;
            resultsTableBody.appendChild(kuratowskiRow);
            
            // Final conclusion
            const conclusionRow = document.createElement('tr');
            conclusionRow.innerHTML = `
                <td colspan="3" class="px-4 py-2 bg-slate-800/50 text-center">
                    <div class="font-bold text-lg text-rose-500">
                        Graph is Non-Planar
                    </div>
                    <div class="text-sm text-slate-400 mt-1">
                        Contains ${type} subdivision
                    </div>
                </td>
            `;
            resultsTableBody.appendChild(conclusionRow);
        } else {
            // No Kuratowski subgraph found
            const kuratowskiRow = document.createElement('tr');
            kuratowskiRow.innerHTML = `
                <td colspan="3" class="px-4 py-2">
                    <div class="font-semibold text-teal-400">
                        Kuratowski Subgraph Check
                    </div>
                    <div class="text-sm text-slate-400 mt-1">
                        No K₅ or K₃,₃ subdivision found
                    </div>
                </td>
            `;
            resultsTableBody.appendChild(kuratowskiRow);
            
            // Final conclusion based on Euler checks
            const conclusionText = eulerCheck.violatesEuler || eulerCheck.tooManyEdges 
                ? "Graph likely non-planar (violates Euler's conditions but no Kuratowski subgraph found)"
                : "Graph appears to be planar (passes all checks)";
                
            const conclusionColor = eulerCheck.violatesEuler || eulerCheck.tooManyEdges 
                ? "text-amber-400" 
                : "text-teal-400";
            
            const conclusionRow = document.createElement('tr');
            conclusionRow.innerHTML = `
                <td colspan="3" class="px-4 py-2 bg-slate-800/50 text-center">
                    <div class="font-bold text-lg ${conclusionColor}">
                        ${eulerCheck.violatesEuler || eulerCheck.tooManyEdges ? "Potential Non-Planar" : "Graph is Planar"}
                    </div>
                    <div class="text-sm text-slate-400 mt-1">
                        ${conclusionText}
                    </div>
                </td>
            `;
            resultsTableBody.appendChild(conclusionRow);
        }
    }, 1000);
}

// Check Euler's formula conditions for planar graphs
function checkEulerConditions() {
    const v = graph.nodes.length; // Number of vertices
    const e = graph.edges.length;  // Number of edges
    
    // For a planar graph: V - E + F = 2 (where F is number of faces)
    // We can estimate F using the formula (for connected planar graphs)
    // For a simple planar graph: E ≤ 3V - 6
    
    // Calculate minimum number of faces (assuming graph is connected)
    // For a planar graph, F = 2 - V + E
    const f = 2 - v + e;
    
    // Check if Euler's formula is satisfied (V - E + F = 2)
    const satisfiesEuler = (v - e + f) === 2;
    
    // Check edge count condition (E ≤ 3V - 6 for V ≥ 3)
    const tooManyEdges = v >= 3 && e > (3 * v - 6);
    
    return {
        v: v,
        e: e,
        f: f,
        result: v - e + f,
        violatesEuler: !satisfiesEuler,
        tooManyEdges: tooManyEdges
    };
}

function findCompleteSubgraph(size) {
    // Try each node as potential starting point
    for (let i = 0; i < graph.nodes.length; i++) {
        const candidateNodes = [graph.nodes[i].id];
        
        // Try to grow the clique
        for (let j = 0; j < graph.nodes.length; j++) {
            if (i === j) continue;
            
            const newNode = graph.nodes[j].id;
            let allConnected = true;
            
            // Check if newNode is connected to all existing candidate nodes
            for (const existingNode of candidateNodes) {
                const connected = graph.edges.some(edge => 
                    (edge.source === existingNode && edge.target === newNode) ||
                    (!edge.directed && edge.source === newNode && edge.target === existingNode)
                );
                
                if (!connected) {
                    allConnected = false;
                    break;
                }
            }
            
            if (allConnected) {
                candidateNodes.push(newNode);
                if (candidateNodes.length === size) {
                    // Found a complete subgraph of required size
                    const subgraphEdges = graph.edges
                        .filter(edge => 
                            candidateNodes.includes(edge.source) && 
                            candidateNodes.includes(edge.target)
                        )
                        .map(edge => edge.id);
                    
                    return {
                        nodes: candidateNodes,
                        edges: subgraphEdges,
                        type: `K${size}`
                    };
                }
            }
        }
    }
    
    return null;
}

function findBipartiteSubgraph(sizeA, sizeB) {
    // Try all combinations of nodes for partition A and B
    const allNodes = graph.nodes.map(n => n.id);
    
    for (let i = 0; i < allNodes.length; i++) {
        for (let j = i + 1; j < allNodes.length; j++) {
            for (let k = j + 1; k < allNodes.length; k++) {
                const partitionA = [allNodes[i], allNodes[j], allNodes[k]];
                
                // Try to find 3 nodes not in partitionA that connect to all in partitionA
                const potentialB = allNodes.filter(id => !partitionA.includes(id));
                const partitionB = [];
                
                for (const nodeB of potentialB) {
                    let allConnected = true;
                    
                    for (const nodeA of partitionA) {
                        const connected = graph.edges.some(edge => 
                            (edge.source === nodeA && edge.target === nodeB) ||
                            (!edge.directed && edge.source === nodeB && edge.target === nodeA)
                        );
                        
                        if (!connected) {
                            allConnected = false;
                            break;
                        }
                    }
                    
                    if (allConnected) {
                        partitionB.push(nodeB);
                        if (partitionB.length === sizeB) {
                            // Found K₃,₃
                            const subgraphEdges = graph.edges
                                .filter(edge => 
                                    (partitionA.includes(edge.source) && partitionB.includes(edge.target)) ||
                                    (partitionB.includes(edge.source) && partitionA.includes(edge.target))
                                )
                                .map(edge => edge.id);
                            
                            return {
                                nodes: [...partitionA, ...partitionB],
                                edges: subgraphEdges,
                                type: "K₃,₃"
                            };
                        }
                    }
                }
            }
        }
    }
    
    return null;
}
// Enhanced Dijkstra's Algorithm
function runDijkstra(startNodeId, endNodeId) {
    // Show loading state
    noResults.classList.add('hidden');
    resultsTableContainer.classList.remove('hidden');
    isomorphismResults.classList.add('hidden');
    resultsTableBody.innerHTML = '<tr><td colspan="3" class="text-center py-2">Finding Shortest Path...</td></tr>';
    
    // Highlight start and end nodes
    const startNode = graph.nodes.find(n => n.id === startNodeId);
    const endNode = graph.nodes.find(n => n.id === endNodeId);
    if (startNode) startNode.element.classList.add('start-node');
    if (endNode) endNode.element.classList.add('end-node');

    // Build adjacency list
    const adjList = {};
    graph.nodes.forEach(node => {
        adjList[node.id] = [];
    });
    
    graph.edges.forEach(edge => {
        adjList[edge.source].push({
            node: edge.target,
            weight: edge.weight || 1,
            edgeId: edge.id
        });
        
        if (!edge.directed) {
            adjList[edge.target].push({
                node: edge.source,
                weight: edge.weight || 1,
                edgeId: edge.id
            });
        }
    });

    // Initialize data structures
    const distances = {};
    const previous = {};
    const visited = new Set();
    const priorityQueue = new PriorityQueue((a, b) => a.distance - b.distance);
    
    // Initialize distances
    graph.nodes.forEach(node => {
        distances[node.id] = Infinity;
        previous[node.id] = null;
    });
    distances[startNodeId] = 0;
    priorityQueue.enqueue({ id: startNodeId, distance: 0 });

    // Process nodes
    const processStep = () => {
        if (priorityQueue.isEmpty()) {
            // Algorithm complete
            displayShortestPathResults(startNodeId, endNodeId, distances, previous);
            return;
        }

        const current = priorityQueue.dequeue();
        const currentNodeId = current.id;
        
        // Skip if already visited
        if (visited.has(currentNodeId)) {
            setTimeout(processStep, 100);
            return;
        }
        
        visited.add(currentNodeId);
        
        // Highlight visited node
        const currentNode = graph.nodes.find(n => n.id === currentNodeId);
        if (currentNode && currentNodeId !== startNodeId && currentNodeId !== endNodeId) {
            currentNode.element.classList.add('visited-node');
        }

        // Process neighbors
        adjList[currentNodeId].forEach(neighbor => {
            if (visited.has(neighbor.node)) return;

            // Calculate new distance
            const newDistance = distances[currentNodeId] + neighbor.weight;

            // Update if new distance is shorter
            if (newDistance < distances[neighbor.node]) {
                distances[neighbor.node] = newDistance;
                previous[neighbor.node] = {
                    node: currentNodeId,
                    edgeId: neighbor.edgeId
                };
                priorityQueue.enqueue({ id: neighbor.node, distance: newDistance });

                // Highlight edge being considered
                setTimeout(() => {
                    const edge = graph.edges.find(e => e.id === neighbor.edgeId);
                    if (edge) {
                        edge.element.classList.add('visited');
                        if (edge.directed) {
                            edge.element.setAttribute('marker-end', 'url(#arrowhead-visited)');
                        }
                    }
                }, 100);
            }
        });

        // Process next step
        setTimeout(processStep, 500);
    };

    // Start processing
    processStep();
}

function displayShortestPathResults(startNodeId, endNodeId, distances, previous) {
    // Check if path exists
    if (distances[endNodeId] === Infinity) {
        resultsTableBody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center py-4">
                    <div class="text-rose-500 font-semibold">No path exists from ${startNodeId} to ${endNodeId}</div>
                    <div class="text-sm text-slate-400 mt-2">The end node is not reachable from the start node</div>
                </td>
            </tr>
        `;
        return;
    }

    // Reconstruct path
    const path = [];
    const edgePath = [];
    let current = endNodeId;
    while (current !== null) {
        path.unshift(current);
        if (previous[current] && previous[current].edgeId) {
            edgePath.unshift(previous[current].edgeId);
        }
        current = previous[current] ? previous[current].node : null;
    }

    // Highlight shortest path
    for (let i = 0; i < path.length - 1; i++) {
        setTimeout(() => {
            // Highlight node
            if (i > 0) { // Don't highlight start node
                const node = graph.nodes.find(n => n.id === path[i]);
                if (node) node.element.classList.add('shortest-path');
            }
            
            // Highlight edge
            const edge = graph.edges.find(e => e.id === edgePath[i]);
            if (edge) {
                edge.element.classList.add('shortest');
                if (edge.directed) {
                    edge.element.setAttribute('marker-end', 'url(#arrowhead-shortest)');
                }
            }
        }, i * 500);
    }

    // Display results
    resultsTableBody.innerHTML = '';
    
    // Add summary row
    const summaryRow = document.createElement('tr');
    summaryRow.innerHTML = `
        <td colspan="3" class="text-center py-2">
            <div class="font-semibold text-amber-400">Shortest Path Found</div>
            <div class="text-sm">Total Distance: ${distances[endNodeId]}</div>
        </td>
    `;
    resultsTableBody.appendChild(summaryRow);
    
    // Add path details
    const pathRow = document.createElement('tr');
    pathRow.innerHTML = `
        <td colspan="3" class="px-4 py-2">
            <div class="text-xs font-mono bg-slate-800 p-2 rounded">${path.join(' → ')}</div>
        </td>
    `;
    resultsTableBody.appendChild(pathRow);
    
    // Add all nodes distances
    graph.nodes.forEach(node => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Node ${node.id}</td>
            <td>${distances[node.id] === Infinity ? '∞' : distances[node.id]}</td>
            <td>${previous[node.id] === null ? 'None' : previous[node.id].node}</td>
        `;
        resultsTableBody.appendChild(row);
    });
}

// Greedy vertex coloring algorithm
function runVertexColoring() {
    // Show loading state
    noResults.classList.add('hidden');
    resultsTableContainer.classList.remove('hidden');
    isomorphismResults.classList.add('hidden');
    resultsTableBody.innerHTML = '<tr><td colspan="3" class="text-center py-2">Finding vertex coloring...</td></tr>';
    
    setTimeout(() => {
        // Get adjacency list
        const adjList = {};
        graph.nodes.forEach(node => {
            adjList[node.id] = [];
        });
        
        graph.edges.forEach(edge => {
            adjList[edge.source].push(edge.target);
            if (!edge.directed) {
                adjList[edge.target].push(edge.source);
            }
        });
        
        // Initialize colors
        const colors = {};
        const availableColors = {};
        graph.nodes.forEach(node => {
            colors[node.id] = -1;
            availableColors[node.id] = new Set();
        });
        
        // Assign colors to nodes
        graph.nodes.forEach(node => {
            const nodeId = node.id;
            
            // Mark colors of adjacent nodes as unavailable
            adjList[nodeId].forEach(neighborId => {
                if (colors[neighborId] !== -1) {
                    availableColors[nodeId].add(colors[neighborId]);
                }
            });
            
            // Find the first available color
            let color = 0;
            while (availableColors[nodeId].has(color)) {
                color++;
            }
            
            colors[nodeId] = color;
            
            // Visualize the color
            setTimeout(() => {
                node.element.className = 'node absolute w-8 h-8 rounded-full border-2 border-slate-600 flex items-center justify-center text-xs font-bold text-slate-200 cursor-move select-none';
                node.element.classList.add(`color-${color}`);
            }, node.id * 200);
        });
        
        // Calculate chromatic number
        const chromaticNumber = Math.max(...Object.values(colors)) + 1;
        
        // Display results
        resultsTableBody.innerHTML = '';
        
        // Add summary row
        const summaryRow = document.createElement('tr');
        summaryRow.innerHTML = `
            <td colspan="3" class="text-center py-2">
                <div class="font-semibold text-blue-400">Vertex Coloring Complete</div>
                <div class="text-sm">Chromatic Number: ${chromaticNumber}</div>
            </td>
        `;
        resultsTableBody.appendChild(summaryRow);
        
        // Add coloring details
        graph.nodes.forEach(node => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>Node ${node.id}</td>
                <td>Color ${colors[node.id]}</td>
                <td>
                    <div class="w-4 h-4 rounded-full ${getColorClass(colors[node.id])}"></div>
                </td>
            `;
            resultsTableBody.appendChild(row);
        });
    }, 500);
}

// Greedy edge coloring algorithm
function runEdgeColoring() {
    // Show loading state
    noResults.classList.add('hidden');
    resultsTableContainer.classList.remove('hidden');
    isomorphismResults.classList.add('hidden');
    resultsTableBody.innerHTML = '<tr><td colspan="3" class="text-center py-2">Finding edge coloring...</td></tr>';
    
    setTimeout(() => {
        // Get adjacency list for edges
        const edgeAdjList = {};
        graph.edges.forEach(edge => {
            edgeAdjList[edge.id] = new Set();
        });
        
        // Build adjacency list (edges are adjacent if they share a node)
        for (let i = 0; i < graph.edges.length; i++) {
            for (let j = i + 1; j < graph.edges.length; j++) {
                const edge1 = graph.edges[i];
                const edge2 = graph.edges[j];
                
                if (edge1.source === edge2.source || edge1.source === edge2.target ||
                    edge1.target === edge2.source || edge1.target === edge2.target) {
                    edgeAdjList[edge1.id].add(edge2.id);
                    edgeAdjList[edge2.id].add(edge1.id);
                }
            }
        }
        
        // Initialize colors
        const colors = {};
        const availableColors = {};
        graph.edges.forEach(edge => {
            colors[edge.id] = -1;
            availableColors[edge.id] = new Set();
        });
        
        // Assign colors to edges
        graph.edges.forEach(edge => {
            const edgeId = edge.id;
            
            // Mark colors of adjacent edges as unavailable
            edgeAdjList[edgeId].forEach(adjEdgeId => {
                if (colors[adjEdgeId] !== -1) {
                    availableColors[edgeId].add(colors[adjEdgeId]);
                }
            });
            
            // Find the first available color
            let color = 0;
            while (availableColors[edgeId].has(color)) {
                color++;
            }
            
            colors[edgeId] = color;
            
            // Visualize the color
            setTimeout(() => {
                edge.element.className = 'edge';
                if (edge.directed) {
                    edge.element.classList.add('directed');
                }
                edge.element.classList.add(`edge-color-${color}`);
                
                // Update arrowhead color if directed
                if (edge.directed) {
                    edge.element.setAttribute('marker-end', 'url(#arrowhead)');
                }
            }, edge.id.split('-').slice(-1)[0] * 200);
        });
        
        // Calculate edge chromatic number
        const edgeChromaticNumber = Math.max(...Object.values(colors)) + 1;
        
        // Display results
        resultsTableBody.innerHTML = '';
        
        // Add summary row
        const summaryRow = document.createElement('tr');
        summaryRow.innerHTML = `
            <td colspan="3" class="text-center py-2">
                <div class="font-semibold text-purple-400">Edge Coloring Complete</div>
                <div class="text-sm">Edge Chromatic Number: ${edgeChromaticNumber}</div>
            </td>
        `;
        resultsTableBody.appendChild(summaryRow);
        
        // Add coloring details
        graph.edges.forEach(edge => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>Edge ${edge.source} → ${edge.target}</td>
                <td>Color ${colors[edge.id]}</td>
                <td>
                    <div class="w-4 h-4 rounded-full ${getEdgeColorClass(colors[edge.id])}"></div>
                </td>
            `;
            resultsTableBody.appendChild(row);
        });
    }, 500);
}

// Check if graph is bipartite using BFS
function runBipartiteCheck() {
    // Show loading state
    noResults.classList.add('hidden');
    resultsTableContainer.classList.remove('hidden');
    isomorphismResults.classList.add('hidden');
    resultsTableBody.innerHTML = '<tr><td colspan="3" class="text-center py-2">Analyzing graph structure...</td></tr>';
    
    setTimeout(() => {
        // Clear previous visualizations
        graph.nodes.forEach(node => {
            node.element.className = 'node absolute w-8 h-8 rounded-full border-2 border-slate-600 flex items-center justify-center text-xs font-bold text-slate-200 cursor-move select-none';
            node.element.textContent = node.id;
        });
        
        // If no edges, graph is bipartite (trivially)
        if (graph.edges.length === 0) {
            resultsTableBody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center py-4">
                        <div class="font-semibold text-green-400">Graph is Bipartite</div>
                        <div class="text-sm text-slate-400 mt-2">Trivially bipartite (no edges)</div>
                    </td>
                </tr>
                <tr>
                    <td>Analysis</td>
                    <td colspan="2">A graph with no edges is always bipartite because we can divide the vertices into any two sets.</td>
                </tr>
            `;
            return;
        }
        
        // Initialize data structures
        const colors = {};
        const parent = {}; // To track BFS parent for cycle detection
        const distance = {}; // To track distance from start node
        const visited = {}; // To track visited nodes
        let isBipartite = true;
        let oddCycle = [];
        
        graph.nodes.forEach(node => {
            colors[node.id] = -1;
            parent[node.id] = null;
            distance[node.id] = -1;
            visited[node.id] = false;
        });
        
        // Perform BFS to check bipartiteness
        const queue = [];
        const startNode = graph.nodes[0].id;
        colors[startNode] = 0;
        distance[startNode] = 0;
        visited[startNode] = true;
        queue.push(startNode);
        
        outerLoop: while (queue.length > 0 && isBipartite) {
            const currentNode = queue.shift();
            
            // Get all adjacent nodes
            const neighbors = [];
            graph.edges.forEach(edge => {
                if (edge.source === currentNode) {
                    neighbors.push(edge.target);
                }
                if (!edge.directed && edge.target === currentNode) {
                    neighbors.push(edge.source);
                }
            });
            
            // Check all neighbors
            for (const neighbor of neighbors) {
                if (!visited[neighbor]) {
                    // Not visited yet - assign opposite color
                    visited[neighbor] = true;
                    colors[neighbor] = 1 - colors[currentNode];
                    parent[neighbor] = currentNode;
                    distance[neighbor] = distance[currentNode] + 1;
                    queue.push(neighbor);
                } else if (colors[neighbor] === colors[currentNode]) {
                    // Same color as current node - not bipartite
                    isBipartite = false;
                    
                    // Find the odd-length cycle
                    oddCycle = findOddCycle(currentNode, neighbor, parent);
                    break outerLoop;
                }
            }
        }
        
        // Visualize the graph based on bipartiteness
        if (isBipartite) {
            // Visualize bipartition with colors
            graph.nodes.forEach(node => {
                if (colors[node.id] !== -1) {
                    node.element.className = `node absolute w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold cursor-move select-none ${
                        colors[node.id] === 0 
                            ? 'bg-blue-500 border-blue-700 text-white' 
                            : 'bg-red-500 border-red-700 text-white'
                    }`;
                    node.element.textContent = node.id;
                }
            });
            
            // Highlight edges between partitions
            graph.edges.forEach(edge => {
                const edgeElement = document.querySelector(`[data-edge-id="${edge.source}-${edge.target}"]`) || 
                                document.querySelector(`[data-edge-id="${edge.target}-${edge.source}"]`);
                if (edgeElement) {
                    edgeElement.classList.add('stroke-green-500', 'opacity-100');
                }
            });
            
            // Prepare partition data
            const partitionA = graph.nodes.filter(node => colors[node.id] === 0).map(node => node.id);
            const partitionB = graph.nodes.filter(node => colors[node.id] === 1).map(node => node.id);
            
            // Display detailed results
            resultsTableBody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center py-4">
                        <div class="font-semibold text-green-400">Graph is Bipartite</div>
                        <div class="text-sm text-slate-400 mt-2">Successfully divided into two partitions</div>
                    </td>
                </tr>
                <tr>
                    <td class="font-medium">Partition A (Blue)</td>
                    <td colspan="2">${partitionA.join(', ')}</td>
                </tr>
                <tr>
                    <td class="font-medium">Partition B (Red)</td>
                    <td colspan="2">${partitionB.join(', ')}</td>
                </tr>
                <tr>
                    <td class="font-medium">Analysis</td>
                    <td colspan="2">
                        <ul class="list-disc pl-5">
                            <li>All edges connect between blue and red partitions</li>
                            <li>No edges exist within the same partition</li>
                            <li>Graph contains no odd-length cycles</li>
                            <li>The graph is 2-colorable</li>
                        </ul>
                    </td>
                </tr>
            `;
        } else {
            // Visualize the odd cycle that makes it non-bipartite
            graph.nodes.forEach(node => {
                node.element.className = 'node absolute w-8 h-8 rounded-full border-2 border-slate-600 flex items-center justify-center text-xs font-bold text-slate-200 cursor-move select-none';
                node.element.textContent = node.id;
            });
            
            // Highlight the odd cycle
            const cycleEdges = [];
            for (let i = 0; i < oddCycle.length; i++) {
                const current = oddCycle[i];
                const next = oddCycle[(i + 1) % oddCycle.length];
                
                // Highlight nodes in the cycle
                const nodeElement = graph.nodes.find(n => n.id === current).element;
                nodeElement.className = 'node absolute w-8 h-8 rounded-full border-2 border-yellow-400 bg-yellow-600 flex items-center justify-center text-xs font-bold text-white cursor-move select-none';
                nodeElement.textContent = current;
                
                // Find and highlight edges in the cycle
                graph.edges.forEach(edge => {
                    if ((edge.source === current && edge.target === next) || 
                        (!edge.directed && edge.source === next && edge.target === current)) {
                        const edgeElement = document.querySelector(`[data-edge-id="${edge.source}-${edge.target}"]`) || 
                                        document.querySelector(`[data-edge-id="${edge.target}-${edge.source}"]`);
                        if (edgeElement) {
                            edgeElement.classList.add('stroke-yellow-400', 'opacity-100', 'animate-pulse');
                            cycleEdges.push(`${edge.source}-${edge.target}`);
                        }
                    }
                });
            }
            
            // Display detailed results with cycle information
            resultsTableBody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center py-4">
                        <div class="font-semibold text-rose-500">Graph is Not Bipartite</div>
                        <div class="text-sm text-slate-400 mt-2">Contains an odd-length cycle</div>
                    </td>
                </tr>
                <tr>
                    <td class="font-medium">Odd Cycle Found</td>
                    <td colspan="2">${oddCycle.join(' → ')} → ${oddCycle[0]}</td>
                </tr>
                <tr>
                    <td class="font-medium">Cycle Length</td>
                    <td colspan="2">${oddCycle.length} (odd)</td>
                </tr>
                <tr>
                    <td class="font-medium">Conflict Location</td>
                    <td colspan="2">Edge between nodes ${oddCycle[0]} and ${oddCycle[oddCycle.length - 1]} with same color</td>
                </tr>
                <tr>
                    <td class="font-medium">Analysis</td>
                    <td colspan="2">
                        <ul class="list-disc pl-5">
                            <li>An odd-length cycle (${oddCycle.length}-cycle) was detected</li>
                            <li>Odd cycles prevent proper 2-coloring of the graph</li>
                            <li>The highlighted nodes and edges form the problematic cycle</li>
                            <li>No valid bipartition exists because of this cycle</li>
                        </ul>
                    </td>
                </tr>
            `;
        }
    }, 500);
    
    // Helper function to find the odd cycle
    function findOddCycle(u, v, parent) {
        const pathU = [];
        const pathV = [];
        let current = u;
        
        // Get path from u to LCA
        while (current !== null) {
            pathU.push(current);
            current = parent[current];
        }
        
        current = v;
        // Get path from v to LCA
        while (current !== null) {
            pathV.push(current);
            current = parent[current];
        }
        
        // Find the lowest common ancestor
        let lca = null;
        let i = pathU.length - 1;
        let j = pathV.length - 1;
        
        while (i >= 0 && j >= 0 && pathU[i] === pathV[j]) {
            lca = pathU[i];
            i--;
            j--;
        }
        
        // Combine the paths to form the cycle
        const cycle = [];
        for (let k = 0; k <= i; k++) {
            cycle.push(pathU[k]);
        }
        cycle.push(lca);
        for (let k = j; k >= 0; k--) {
            cycle.push(pathV[k]);
        }
        
        return cycle;
    }
}
// Helper function to get color class for vertex
function getColorClass(colorIndex) {
    const colors = [
        'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 
        'bg-purple-500', 'bg-pink-500', 'bg-teal-500', 'bg-orange-500',
        'bg-gray-500', 'bg-lime-500', 'bg-indigo-500', 'bg-amber-500',
        'bg-cyan-500', 'bg-fuchsia-500', 'bg-rose-500', 'bg-emerald-500',
        'bg-violet-500', 'bg-sky-500', 'bg-stone-500', 'bg-zinc-500',
        'bg-neutral-500'
    ];
    return colors[colorIndex % colors.length];
}

function getEdgeColorClass(colorIndex) {
    const colors = [
        'stroke-blue-500', 'stroke-red-500', 'stroke-green-500', 'stroke-yellow-500',
        'stroke-purple-500', 'stroke-pink-500', 'stroke-teal-500', 'stroke-orange-500',
        'stroke-gray-500', 'stroke-lime-500', 'stroke-indigo-500', 'stroke-amber-500',
        'stroke-cyan-500', 'stroke-fuchsia-500', 'stroke-rose-500', 'stroke-emerald-500',
        'stroke-violet-500', 'stroke-sky-500', 'stroke-stone-500', 'stroke-zinc-500',
        'stroke-neutral-500'
    ];
    return colors[colorIndex % colors.length];
}

// Check if two graphs are isomorphic
function checkGraphIsomorphism() {
    // First ensure we have at least two graphs to compare
    const graphIds = Object.keys(graph.graphs);
    if (graphIds.length < 2) {
        noResults.classList.add('hidden');
        resultsTableContainer.classList.remove('hidden');
        isomorphismResults.classList.add('hidden');
        resultsTableBody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center py-4">
                    <div class="text-rose-500 font-semibold">Please create at least two graphs to compare</div>
                    <div class="text-sm text-slate-400 mt-2">Currently have ${graphIds.length} graph(s)</div>
                </td>
            </tr>
        `;
        return;
    }

    // Show loading state
    noResults.classList.add('hidden');
    resultsTableContainer.classList.remove('hidden');
    isomorphismResults.classList.add('hidden');
    resultsTableBody.innerHTML = '<tr><td colspan="3" class="text-center py-2">Checking graph isomorphism...</td></tr>';
    
    // Ensure all graphs are saved
    saveCurrentGraph();
    
    // Get the first two graphs for comparison
    const graph1 = graph.graphs[1];
    const graph2 = graph.graphs[2];

    // Validate both graphs exist and have nodes
    if (!graph1 || !graph2 || graph1.nodes.length === 0 || graph2.nodes.length === 0) {
        resultsTableBody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center py-4">
                    <div class="text-rose-500 font-semibold">Both graphs need nodes for comparison</div>
                    <div class="text-sm text-slate-400 mt-2">Graph 1 has ${graph1?.nodes.length || 0} nodes, Graph 2 has ${graph2?.nodes.length || 0} nodes</div>
                </td>
            </tr>
        `;
        return;
    }

    // Check basic properties first
    const basicChecks = {
        nodeCount: {
            graph1: graph1.nodes.length,
            graph2: graph2.nodes.length,
            match: graph1.nodes.length === graph2.nodes.length
        },
        edgeCount: {
            graph1: graph1.edges.length,
            graph2: graph2.edges.length,
            match: graph1.edges.length === graph2.edges.length
        },
        directed: {
            graph1: graph1.edges.some(e => e.directed),
            graph2: graph2.edges.some(e => e.directed),
            match: graph1.edges.some(e => e.directed) === graph2.edges.some(e => e.directed)
        },
        weighted: {
            graph1: graph1.edges.some(e => e.weight !== null),
            graph2: graph2.edges.some(e => e.weight !== null),
            match: graph1.edges.some(e => e.weight !== null) === graph2.edges.some(e => e.weight !== null)
        }
    };

    // Check degree sequences
    const degreeCheck = {
        graph1: calculateDegreeSequence(graph1),
        graph2: calculateDegreeSequence(graph2),
        match: false
    };
    
    // Sort and compare degree sequences
    const sortedDegrees1 = [...degreeCheck.graph1].sort((a, b) => b - a);
    const sortedDegrees2 = [...degreeCheck.graph2].sort((a, b) => b - a);
    degreeCheck.match = JSON.stringify(sortedDegrees1) === JSON.stringify(sortedDegrees2);

    // If basic checks fail, show results immediately
    if (!basicChecks.nodeCount.match || !basicChecks.edgeCount.match || 
        !basicChecks.directed.match || !basicChecks.weighted.match || !degreeCheck.match) {
        
        displayIsomorphismResults(basicChecks, degreeCheck, null);
        return;
    }

    // Try to find isomorphism (with timeout for large graphs)
    setTimeout(() => {
        try {
            const adj1 = createAdjacencyMatrix(graph1);
            const adj2 = createAdjacencyMatrix(graph2);
            
            const mapping = findIsomorphism(adj1, adj2);
            displayIsomorphismResults(basicChecks, degreeCheck, mapping);
            
            // Visualize the mapping if found
            if (mapping) {
                visualizeMapping(graph1, graph2, mapping);
            }
        } catch (error) {
            resultsTableBody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center py-4">
                        <div class="text-rose-500 font-semibold">Error during comparison</div>
                        <div class="text-sm text-slate-400 mt-2">${error.message}</div>
                    </td>
                </tr>
            `;
        }
    }, 100);
}

// Helper functions used by checkGraphIsomorphism:

function calculateDegreeSequence(graphData) {
    const degrees = {};
    
    // Initialize degrees
    graphData.nodes.forEach(node => {
        degrees[node.id] = 0;
    });
    
    // Calculate degrees
    graphData.edges.forEach(edge => {
        degrees[edge.source]++;
        if (!edge.directed) {
            degrees[edge.target]++;
        }
    });
    
    // Return as array of values
    return Object.values(degrees);
}

function createAdjacencyMatrix(graphData) {
    const matrix = {};
    const nodeIds = graphData.nodes.map(n => n.id);

    // Initialize matrix
    nodeIds.forEach(id1 => {
        matrix[id1] = {};
        nodeIds.forEach(id2 => {
            matrix[id1][id2] = 0; // 0 means no edge
        });
    });

    // Fill matrix with edges
    graphData.edges.forEach(edge => {
        matrix[edge.source][edge.target] = 1;
        if (!edge.directed) {
            matrix[edge.target][edge.source] = 1;
        }
    });

    return matrix;
}

function findIsomorphism(adj1, adj2, nodes1, nodes2) {
    nodes1 = nodes1 || Object.keys(adj1);
    nodes2 = nodes2 || Object.keys(adj2);

    // For small graphs (≤ 6 nodes), use brute force
    if (nodes1.length <= 6) {
        return bruteForceIsomorphism(adj1, adj2, nodes1, nodes2);
    }

    // For larger graphs, use a heuristic approach
    return heuristicIsomorphism(adj1, adj2, nodes1, nodes2);
}

function bruteForceIsomorphism(adj1, adj2, nodes1, nodes2) {
    // Try all possible node mappings
    const permutations = getPermutations(nodes2);
    
    for (const perm of permutations) {
        let isMatch = true;
        
        for (let i = 0; i < nodes1.length; i++) {
            for (let j = 0; j < nodes1.length; j++) {
                const node1 = nodes1[i];
                const node2 = nodes1[j];
                const mapped1 = perm[i];
                const mapped2 = perm[j];
                
                if (adj1[node1][node2] !== adj2[mapped1][mapped2]) {
                    isMatch = false;
                    break;
                }
            }
            if (!isMatch) break;
        }
        
        if (isMatch) {
            // Create mapping dictionary
            const mapping = {};
            for (let i = 0; i < nodes1.length; i++) {
                mapping[nodes1[i]] = perm[i];
            }
            return mapping;
        }
    }
    
    return null;
}

function getPermutations(arr) {
    if (arr.length <= 1) return [arr];
    const result = [];
    
    for (let i = 0; i < arr.length; i++) {
        const current = arr[i];
        const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
        const remainingPerms = getPermutations(remaining);
        
        for (const perm of remainingPerms) {
            result.push([current, ...perm]);
        }
    }
    
    return result;
}

function heuristicIsomorphism(adj1, adj2, nodes1, nodes2) {
    // This is a simplified approach that may not catch all isomorphisms
    const mapping = {};
    const used = new Set();
    
    // Sort nodes by degree for better matching
    const sorted1 = [...nodes1].sort((a, b) => 
        Object.values(adj1[b]).reduce((x,y) => x + y) - Object.values(adj1[a]).reduce((x,y) => x + y)
    );
    const sorted2 = [...nodes2].sort((a, b) => 
        Object.values(adj2[b]).reduce((x,y) => x + y) - Object.values(adj2[a]).reduce((x,y) => x + y)
    );
    
    // Try to match nodes with same degree
    for (const node1 of sorted1) {
        const degree1 = Object.values(adj1[node1]).reduce((a,b) => a + b);
        const candidates = sorted2.filter(node2 => 
            !used.has(node2) && 
            Object.values(adj2[node2]).reduce((a,b) => a + b) === degree1
        );
        
        for (const candidate of candidates) {
            // Verify neighbors match existing mapping
            let valid = true;
            for (const neighbor in adj1[node1]) {
                if (adj1[node1][neighbor] && mapping[neighbor]) {
                    if (!adj2[candidate][mapping[neighbor]]) {
                        valid = false;
                        break;
                    }
                }
            }
            
            if (valid) {
                mapping[node1] = candidate;
                used.add(candidate);
                break;
            }
        }
        
        if (!mapping[node1]) {
            return null; // No valid mapping found
        }
    }
    
    return mapping;
}

function displayIsomorphismResults(basicChecks, degreeCheck, mapping) {
    resultsTableBody.innerHTML = '';
    
    // Add summary row
    const summaryRow = document.createElement('tr');
    summaryRow.innerHTML = `
        <td colspan="3" class="text-center py-2">
            <div class="font-semibold ${mapping ? 'text-green-500' : 'text-rose-500'}">
                ${mapping ? 'Graphs ARE Isomorphic' : 'Graphs are NOT Isomorphic'}
            </div>
        </td>
    `;
    resultsTableBody.appendChild(summaryRow);
    
    // Add basic checks
    const basicChecksRow = document.createElement('tr');
    basicChecksRow.innerHTML = `
        <td colspan="3" class="px-4 py-2">
            <div class="font-semibold text-slate-300">Basic Properties</div>
            <div class="text-sm text-slate-400 mt-1 grid grid-cols-2 gap-2">
                <div class="${basicChecks.nodeCount.match ? 'text-green-400' : 'text-rose-400'}">
                    Nodes: ${basicChecks.nodeCount.graph1} vs ${basicChecks.nodeCount.graph2}
                </div>
                <div class="${basicChecks.edgeCount.match ? 'text-green-400' : 'text-rose-400'}">
                    Edges: ${basicChecks.edgeCount.graph1} vs ${basicChecks.edgeCount.graph2}
                </div>
                <div class="${basicChecks.directed.match ? 'text-green-400' : 'text-rose-400'}">
                    Directed: ${basicChecks.directed.graph1 ? 'Yes' : 'No'} vs ${basicChecks.directed.graph2 ? 'Yes' : 'No'}
                </div>
                <div class="${basicChecks.weighted.match ? 'text-green-400' : 'text-rose-400'}">
                    Weighted: ${basicChecks.weighted.graph1 ? 'Yes' : 'No'} vs ${basicChecks.weighted.graph2 ? 'Yes' : 'No'}
                </div>
            </div>
        </td>
    `;
    resultsTableBody.appendChild(basicChecksRow);
    
    // Add degree sequence check
    const degreeRow = document.createElement('tr');
    degreeRow.innerHTML = `
        <td colspan="3" class="px-4 py-2">
            <div class="font-semibold text-slate-300">Degree Sequence</div>
            <div class="text-sm ${degreeCheck.match ? 'text-green-400' : 'text-rose-400'}">
                ${degreeCheck.match ? 'Match' : 'Do not match'}
            </div>
            <div class="text-xs text-slate-400 mt-1">
                Graph 1: [${degreeCheck.graph1.join(', ')}]<br>
                Graph 2: [${degreeCheck.graph2.join(', ')}]
            </div>
        </td>
    `;
    resultsTableBody.appendChild(degreeRow);
    
    // Add mapping if found
    if (mapping) {
        const mappingRow = document.createElement('tr');
        mappingRow.innerHTML = `
            <td colspan="3" class="px-4 py-2">
                <div class="font-semibold text-slate-300">Node Mapping</div>
                <div class="text-xs font-mono bg-slate-800 p-2 rounded mt-1">
                    ${Object.entries(mapping).map(([k, v]) => `${k} → ${v}`).join(', ')}
                </div>
            </td>
        `;
        resultsTableBody.appendChild(mappingRow);
    }
}

function visualizeMapping(graph1, graph2, mapping) {
    // Highlight nodes in graph1
    graph1.nodes.forEach(node => {
        const nodeElement = document.querySelector(`.node[data-id="${node.id}"]`);
        if (nodeElement && mapping[node.id]) {
            nodeElement.classList.add('bg-green-500', 'text-white');
        }
    });

    // Highlight nodes in graph2
    graph2.nodes.forEach(node => {
        const nodeElement = document.querySelector(`.node[data-id="${node.id}"]`);
        if (nodeElement && Object.values(mapping).includes(node.id)) {
            nodeElement.classList.add('bg-green-500', 'text-white');
        }
    });

    // Highlight edges in graph1
    graph1.edges.forEach(edge => {
        const edgeElement = document.getElementById(edge.id);
        if (edgeElement && mapping[edge.source] && mapping[edge.target]) {
            edgeElement.classList.add('stroke-green-500', 'stroke-3');
        }
    });

    // Highlight edges in graph2
    graph2.edges.forEach(edge => {
        const edgeElement = document.getElementById(edge.id);
        if (edgeElement) {
            // Find if this edge corresponds to a mapped edge in graph1
            for (const [src1, src2] of Object.entries(mapping)) {
                for (const [tgt1, tgt2] of Object.entries(mapping)) {
                    if ((edge.source === src2 && edge.target === tgt2) || 
                        (!edge.directed && edge.source === tgt2 && edge.target === src2)) {
                        edgeElement.classList.add('stroke-green-500', 'stroke-3');
                    }
                }
            }
        }
    });
}
class HuffmanNode {
    constructor(char, freq, left = null, right = null) {
        this.char = char;
        this.freq = freq;
        this.left = left;
        this.right = right;
        this.id = crypto.randomUUID(); // Add unique ID for each node
    }
}


// Huffman Coding implementation
function runHuffmanCoding() {
    // Get frequencies either from text or custom inputs
    const frequencies = getFrequencies();
    
    if (!frequencies || Object.keys(frequencies).length === 0) {
        alert('Please provide input text or custom frequencies');
        return;
    }
    
    // Build Huffman Tree
    const huffmanTree = buildHuffmanTree(frequencies);
    
    // Generate codes
    const codes = {};
    generateCodes(huffmanTree, '', codes);
    
    // Calculate compression stats
    const stats = calculateCompressionStats(frequencies, codes);
    
    // Display results
    displayHuffmanResults(frequencies, codes, stats, huffmanTree);
}

function getFrequencies() {
    const inputText = document.getElementById('huffman-input-text').value;
    const customFrequencies = {};
    
    // Check custom frequency inputs first
    const frequencyInputs = document.querySelectorAll('.frequency-input');
    frequencyInputs.forEach(input => {
        const char = input.querySelector('.frequency-char').value;
        const freq = parseInt(input.querySelector('.frequency-value').value);
        if (char && !isNaN(freq) && freq > 0) {
            customFrequencies[char] = freq;
        }
    });
    
    // If custom frequencies exist, use them
    if (Object.keys(customFrequencies).length > 0) {
        return customFrequencies;
    }
    
    // Otherwise analyze input text
    if (inputText.trim() === '') {
        return null;
    }
    
    const frequencies = {};
    for (const char of inputText) {
        frequencies[char] = (frequencies[char] || 0) + 1;
    }
    
    return frequencies;
}

function buildHuffmanTree(frequencies) {
    // Validate input
    if (!frequencies || Object.keys(frequencies).length === 0) {
        console.error("No frequencies provided to build Huffman tree");
        return null;
    }

    const nodes = [];
    
    // Create leaf nodes for each character
    for (const [char, freq] of Object.entries(frequencies)) {
        if (freq > 0) {  // Only add nodes with positive frequency
            nodes.push(new HuffmanNode(char, freq));
        }
    }
    
    // Handle case where all frequencies are zero
    if (nodes.length === 0) {
        console.error("All frequencies are zero - cannot build tree");
        return null;
    }

    // Special case: only one character
    if (nodes.length === 1) {
        const singleNode = nodes[0];
        // Create a dummy root to maintain binary tree structure
        return new HuffmanNode(null, singleNode.freq, singleNode);
    }
    
    // Build the tree
    while (nodes.length > 1) {
        // Sort nodes by frequency (ascending)
        nodes.sort((a, b) => a.freq - b.freq);
        
        // Take two nodes with lowest frequency
        const left = nodes.shift();
        const right = nodes.shift();
        
        // Create new internal node
        const newNode = new HuffmanNode(
            null, 
            left.freq + right.freq, 
            left, 
            right
        );
        nodes.push(newNode);
    }
    
    return nodes[0];
}

function generateCodes(node, currentCode, codes) {
    if (node === null) return;
    
    // Leaf node - contains a character
    if (node.char !== null) {
        codes[node.char] = currentCode;
        return;
    }
    
    // Traverse left (add '0' to code)
    generateCodes(node.left, currentCode + '0', codes);
    
    // Traverse right (add '1' to code)
    generateCodes(node.right, currentCode + '1', codes);
}

function calculateCompressionStats(frequencies, codes) {
    let totalChars = 0;
    let originalBits = 0;
    let compressedBits = 0;
    
    // Calculate frequencies and bits
    for (const [char, freq] of Object.entries(frequencies)) {
        totalChars += freq;
        originalBits += freq * 8; // Assuming 8-bit ASCII
        compressedBits += freq * codes[char].length;
    }
    
    return {
        totalChars: totalChars,
        originalBits: originalBits,
        compressedBits: compressedBits,
        compressionRatio: (compressedBits / originalBits * 100).toFixed(2)
    };
}

function displayHuffmanResults(frequencies, codes, stats, huffmanTree) {
    // Show loading state
    noResults.classList.add('hidden');
    resultsTableContainer.classList.remove('hidden');
    isomorphismResults.classList.add('hidden');
    
    // Clear previous results
    resultsTableBody.innerHTML = '';
    
    // Add summary row
    const summaryRow = document.createElement('tr');
    summaryRow.innerHTML = `
        <td colspan="3" class="text-center py-2">
            <div class="font-semibold text-indigo-400">Huffman Coding Results</div>
            <div class="text-sm">Compression Ratio: ${stats.compressionRatio}%</div>
        </td>
    `;
    resultsTableBody.appendChild(summaryRow);
    
    // Add character codes table
    const charsRow = document.createElement('tr');
    charsRow.innerHTML = `
        <td colspan="3" class="px-4 py-2">
            <div class="font-semibold text-slate-300 mb-2">Character Codes</div>
            <div class="grid grid-cols-3 gap-2 text-sm">
                ${Object.entries(frequencies).map(([char, freq]) => `
                    <div class="bg-slate-800 p-2 rounded">
                        <span class="font-mono">'${char === ' ' ? '␣' : char}'</span>
                        <span class="text-slate-400 text-xs">(Freq: ${freq})</span>
                        <div class="font-mono text-indigo-300 mt-1">${codes[char]}</div>
                    </div>
                `).join('')}
            </div>
        </td>
    `;
    resultsTableBody.appendChild(charsRow);
    
    // Add compression stats
    const statsRow = document.createElement('tr');
    statsRow.innerHTML = `
        <td colspan="3" class="px-4 py-2">
            <div class="font-semibold text-slate-300 mb-2">Compression Statistics</div>
            <div class="grid grid-cols-3 gap-4 text-sm">
                <div class="bg-slate-800 p-2 rounded">
                    <div class="text-slate-400">Original Size</div>
                    <div class="font-mono">${stats.originalBits} bits</div>
                </div>
                <div class="bg-slate-800 p-2 rounded">
                    <div class="text-slate-400">Compressed Size</div>
                    <div class="font-mono">${stats.compressedBits} bits</div>
                </div>
                <div class="bg-slate-800 p-2 rounded">
                    <div class="text-slate-400">Savings</div>
                    <div class="font-mono">${stats.compressionRatio}%</div>
                </div>
            </div>
        </td>
    `;
    resultsTableBody.appendChild(statsRow);
    
    // Visualize the Huffman tree
    visualizeHuffmanTree(huffmanTree);
}

function getTreeDepth(node) {
    if (!node) return 0;
    return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
}

function countNodes(node) {
    if (!node) return 0;
    return 1 + countNodes(node.left) + countNodes(node.right);
}

// Main tree visualization function
function visualizeHuffmanTree(root) {
    // Clear previous visualization
    const existingTree = document.getElementById('huffman-tree-vis');
    if (existingTree) existingTree.remove();
    
    if (!root) {
        console.error("No tree to visualize - root is null");
        const errorRow = document.createElement('tr');
        errorRow.innerHTML = `<td colspan="3" class="text-rose-500">Error: No tree generated</td>`;
        resultsTableBody.appendChild(errorRow);
        return;
    }

    // Create container
    const treeContainer = document.createElement('div');
    treeContainer.id = 'huffman-tree-vis';
    treeContainer.className = 'w-full mt-4 p-4 bg-slate-800 rounded-lg overflow-x-auto';
    treeContainer.innerHTML = '<h3 class="font-semibold text-slate-300 mb-4">Huffman Tree</h3>';
    
    // Calculate dimensions based on tree structure
    const depth = getTreeDepth(root);
    const maxLeaves = Math.pow(2, depth - 1);
    const svgWidth = Math.max(800, maxLeaves * 100);
    const svgHeight = depth * 120;
    
    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', svgHeight);
    svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
    svg.className = 'bg-slate-900 rounded-lg';
    
    // Calculate node positions (using a queue for BFS)
    const nodePositions = {};
    const queue = [];
    const startX = svgWidth / 2;
    const startY = 60;
    const levelHeight = 100;
    
    queue.push({ node: root, x: startX, y: startY, minX: 0, maxX: svgWidth });
    
    while (queue.length > 0) {
        const { node, x, y, minX, maxX } = queue.shift();
        nodePositions[node.id] = { x, y, node };
        
        if (node.left) {
            const leftX = x - (maxX - x) / 2;
            queue.push({
                node: node.left,
                x: leftX,
                y: y + levelHeight,
                minX: minX,
                maxX: x
            });
        }
        
        if (node.right) {
            const rightX = x + (x - minX) / 2;
            queue.push({
                node: node.right,
                x: rightX,
                y: y + levelHeight,
                minX: x,
                maxX: maxX
            });
        }
    }
    
    // Draw edges first (so nodes appear on top)
    for (const nodeId in nodePositions) {
        const { x, y, node } = nodePositions[nodeId];
        
        if (node.left) {
            const leftPos = nodePositions[node.left.id];
            drawEdge(svg, x, y, leftPos.x, leftPos.y, '0');
        }
        
        if (node.right) {
            const rightPos = nodePositions[node.right.id];
            drawEdge(svg, x, y, rightPos.x, rightPos.y, '1');
        }
    }
    
    // Draw nodes
    for (const nodeId in nodePositions) {
        const { x, y, node } = nodePositions[nodeId];
        const isLeaf = !node.left && !node.right;
        const displayText = isLeaf ? 
            (node.char === ' ' ? '␣' : node.char) : 
            node.freq;
        
        drawNode(svg, x, y, displayText, isLeaf, node.freq);
    }
    
    treeContainer.appendChild(svg);
    resultsTableBody.appendChild(treeContainer);
}

// Helper functions
function getTreeDepth(node) {
    if (!node) return 0;
    return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
}

function drawEdge(svg, x1, y1, x2, y2, label) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#64748b');
    line.setAttribute('stroke-width', '2');
    svg.appendChild(line);
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', (x1 + x2) / 2);
    text.setAttribute('y', (y1 + y2) / 2 + 5);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#94a3b8');
    text.setAttribute('font-size', '12');
    text.textContent = label;
    svg.appendChild(text);
}

function drawNode(svg, x, y, textContent, isLeaf, freq) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', isLeaf ? 18 : 15);
    circle.setAttribute('fill', isLeaf ? '#7c3aed' : '#334155');
    circle.setAttribute('stroke', isLeaf ? '#5b21b6' : '#475569');
    circle.setAttribute('stroke-width', '2');
    svg.appendChild(circle);
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y + 5);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', 'white');
    text.setAttribute('font-size', isLeaf ? '12' : '10');
    text.textContent = textContent;
    svg.appendChild(text);
    
    if (isLeaf) {
        const freqText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        freqText.setAttribute('x', x);
        freqText.setAttribute('y', y + 25);
        freqText.setAttribute('text-anchor', 'middle');
        freqText.setAttribute('fill', '#a78bfa');
        freqText.setAttribute('font-size', '10');
        freqText.textContent = freq;
        svg.appendChild(freqText);
    }
}
// Add event listeners for Huffman UI
function initHuffmanUI() {
    // Show Huffman params when algorithm is selected
    document.querySelectorAll('.algorithm-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const algo = this.getAttribute('data-algo');
            document.getElementById('huffman-params').classList.toggle('hidden', algo !== 'huffman');
        });
    });
    
    // Add frequency input
    document.getElementById('add-frequency-btn').addEventListener('click', function() {
        const container = document.getElementById('frequency-inputs');
        const div = document.createElement('div');
        div.className = 'frequency-input flex items-center space-x-2';
        div.innerHTML = `
            <input type="text" class="frequency-char bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm w-8" maxlength="1" placeholder="Char">
            <span class="text-slate-400">:</span>
            <input type="number" class="frequency-value bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm w-16" min="1" value="1" placeholder="Freq">
            <button class="remove-frequency-btn p-1 text-rose-500 hover:text-rose-400">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(div);
        
        // Add remove handler
        div.querySelector('.remove-frequency-btn').addEventListener('click', function() {
            div.remove();
        });
    });
    
    // Analyze frequencies button
    document.getElementById('analyze-frequencies-btn').addEventListener('click', function() {
        runHuffmanCoding();
    });
}
function runNotationConversion() {
    // Create a modal for input
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Notation Conversion</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body p-4">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm text-slate-400 mb-1">Expression</label>
                        <input id="expression-input" class="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm" placeholder="e.g., 3 + 4 * 5">
                    </div>
                    <div>
                        <label class="block text-sm text-slate-400 mb-1">Input Notation</label>
                        <select id="input-notation" class="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm">
                            <option value="infix">Infix</option>
                            <option value="prefix">Prefix (Polish)</option>
                            <option value="postfix">Postfix (Reverse Polish)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm text-slate-400 mb-1">Output Notation</label>
                        <select id="output-notation" class="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm">
                            <option value="infix">Infix</option>
                            <option value="prefix">Prefix (Polish)</option>
                            <option value="postfix">Postfix (Reverse Polish)</option>
                        </select>
                    </div>
                    <button id="convert-btn" class="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm">
                        Convert
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';

    // Close modal when clicking close button
    modal.querySelector('.close-btn').addEventListener('click', () => {
        modal.remove();
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Handle conversion
    modal.querySelector('#convert-btn').addEventListener('click', () => {
        const expression = modal.querySelector('#expression-input').value.trim();
        const inputNotation = modal.querySelector('#input-notation').value;
        const outputNotation = modal.querySelector('#output-notation').value;

        if (!expression) {
            alert('Please enter an expression');
            return;
        }

        // Show loading state
        noResults.classList.add('hidden');
        resultsTableContainer.classList.remove('hidden');
        isomorphismResults.classList.add('hidden');
        resultsTableBody.innerHTML = '<tr><td colspan="3" class="text-center py-2">Converting notation...</td></tr>';

        // Process in a timeout to allow UI to update
        setTimeout(() => {
            try {
                let result;
                let steps = [];

                // Convert based on input and output notation
                if (inputNotation === 'infix' && outputNotation === 'postfix') {
                    result = infixToPostfix(expression, steps);
                } else if (inputNotation === 'infix' && outputNotation === 'prefix') {
                    result = infixToPrefix(expression, steps);
                } else if (inputNotation === 'postfix' && outputNotation === 'infix') {
                    result = postfixToInfix(expression, steps);
                } else if (inputNotation === 'postfix' && outputNotation === 'prefix') {
                    const infix = postfixToInfix(expression, steps);
                    result = infixToPrefix(infix, steps);
                } else if (inputNotation === 'prefix' && outputNotation === 'infix') {
                    result = prefixToInfix(expression, steps);
                } else if (inputNotation === 'prefix' && outputNotation === 'postfix') {
                    const infix = prefixToInfix(expression, steps);
                    result = infixToPostfix(infix, steps);
                } else {
                    result = expression; // Same notation
                }

                // Display results
                displayNotationConversionResults(expression, inputNotation, result, outputNotation, steps);
            } catch (error) {
                resultsTableBody.innerHTML = `
                    <tr>
                        <td colspan="3" class="text-center py-4">
                            <div class="text-rose-500 font-semibold">Error in conversion</div>
                            <div class="text-sm text-slate-400 mt-2">${error.message}</div>
                        </td>
                    </tr>
                `;
            }

            // Close the modal
            modal.remove();
        }, 100);
    });
}

// Helper functions for notation conversion
function infixToPostfix(infix, steps = []) {
    const precedence = {
        '^': 4,
        '*': 3,
        '/': 3,
        '+': 2,
        '-': 2
    };
    
    const stack = [];
    let postfix = '';
    
    // Add initial state to steps
    steps.push({
        description: `Initial infix expression: ${infix}`,
        stack: [...stack],
        output: postfix
    });
    
    // Process each token
    const tokens = infix.match(/(\d+|\+|\-|\*|\/|\^|\(|\))/g) || [];
    
    for (const token of tokens) {
        if (/\d+/.test(token)) {
            // Operand
            postfix += token + ' ';
            steps.push({
                description: `Found operand ${token}, added to output`,
                stack: [...stack],
                output: postfix
            });
        } else if (token === '(') {
            // Left parenthesis
            stack.push(token);
            steps.push({
                description: `Found '(', pushed to stack`,
                stack: [...stack],
                output: postfix
            });
        } else if (token === ')') {
            // Right parenthesis
            while (stack.length && stack[stack.length - 1] !== '(') {
                postfix += stack.pop() + ' ';
                steps.push({
                    description: `Found ')', popping operators until '('`,
                    stack: [...stack],
                    output: postfix
                });
            }
            stack.pop(); // Remove '('
            steps.push({
                description: `Removed '(' from stack`,
                stack: [...stack],
                output: postfix
            });
        } else {
            // Operator
            while (stack.length && stack[stack.length - 1] !== '(' && 
                   precedence[token] <= precedence[stack[stack.length - 1]]) {
                postfix += stack.pop() + ' ';
                steps.push({
                    description: `Found operator ${token}, popping higher precedence operators`,
                    stack: [...stack],
                    output: postfix
                });
            }
            stack.push(token);
            steps.push({
                description: `Pushed operator ${token} to stack`,
                stack: [...stack],
                output: postfix
            });
        }
    }
    
    // Pop remaining operators
    while (stack.length) {
        postfix += stack.pop() + ' ';
        steps.push({
            description: `Popping remaining operators from stack`,
            stack: [...stack],
            output: postfix
        });
    }
    
    return postfix.trim();
}

function infixToPrefix(infix, steps = []) {
    // Reverse the infix expression
    const reversed = infix.split('').reverse().join('');
    
    // Replace '(' with ')' and vice versa
    const reversedWithParentheses = reversed.replace(/\(/g, 'temp').replace(/\)/g, '(').replace(/temp/g, ')');
    
    // Convert to postfix
    const postfix = infixToPostfix(reversedWithParentheses, steps);
    
    // Reverse the postfix to get prefix
    const prefix = postfix.split(' ').reverse().join(' ');
    
    // Update steps for prefix conversion
    steps.push({
        description: `Reversed postfix to get prefix notation`,
        stack: [],
        output: prefix
    });
    
    return prefix;
}

function postfixToInfix(postfix, steps = []) {
    const stack = [];
    const tokens = postfix.split(/\s+/);
    
    steps.push({
        description: `Initial postfix expression: ${postfix}`,
        stack: [...stack],
        output: ''
    });
    
    for (const token of tokens) {
        if (/\d+/.test(token)) {
            // Operand
            stack.push(token);
            steps.push({
                description: `Found operand ${token}, pushed to stack`,
                stack: [...stack],
                output: ''
            });
        } else {
            // Operator
            const operand2 = stack.pop();
            const operand1 = stack.pop();
            const expression = `(${operand1} ${token} ${operand2})`;
            stack.push(expression);
            steps.push({
                description: `Found operator ${token}, created subexpression ${expression}`,
                stack: [...stack],
                output: ''
            });
        }
    }
    
    return stack.pop();
}

function prefixToInfix(prefix, steps = []) {
    const stack = [];
    const tokens = prefix.split(/\s+/).reverse();
    
    steps.push({
        description: `Initial prefix expression: ${prefix}`,
        stack: [...stack],
        output: ''
    });
    
    for (const token of tokens) {
        if (/\d+/.test(token)) {
            // Operand
            stack.push(token);
            steps.push({
                description: `Found operand ${token}, pushed to stack`,
                stack: [...stack],
                output: ''
            });
        } else {
            // Operator
            const operand1 = stack.pop();
            const operand2 = stack.pop();
            const expression = `(${operand1} ${token} ${operand2})`;
            stack.push(expression);
            steps.push({
                description: `Found operator ${token}, created subexpression ${expression}`,
                stack: [...stack],
                output: ''
            });
        }
    }
    
    return stack.pop();
}

function displayNotationConversionResults(original, originalNotation, result, resultNotation, steps) {
    resultsTableBody.innerHTML = '';
    
    // Add summary row
    const summaryRow = document.createElement('tr');
    summaryRow.innerHTML = `
        <td colspan="3" class="text-center py-2">
            <div class="font-semibold text-blue-400">Notation Conversion Complete</div>
            <div class="text-sm">${originalNotation} → ${resultNotation}</div>
        </td>
    `;
    resultsTableBody.appendChild(summaryRow);
    
    // Add original and result
    const originalRow = document.createElement('tr');
    originalRow.innerHTML = `
        <td>Original (${originalNotation})</td>
        <td colspan="2"><code>${original}</code></td>
    `;
    resultsTableBody.appendChild(originalRow);
    
    const resultRow = document.createElement('tr');
    resultRow.innerHTML = `
        <td>Result (${resultNotation})</td>
        <td colspan="2"><code>${result}</code></td>
    `;
    resultsTableBody.appendChild(resultRow);
    
    // Add steps header
    const stepsHeader = document.createElement('tr');
    stepsHeader.innerHTML = `
        <td colspan="3" class="font-semibold bg-slate-800">Conversion Steps</td>
    `;
    resultsTableBody.appendChild(stepsHeader);
    
    // Add each step
    steps.forEach((step, index) => {
        const stepRow = document.createElement('tr');
        stepRow.innerHTML = `
            <td>Step ${index + 1}</td>
            <td>${step.description}</td>
            <td>
                <div class="text-xs">Stack: [${step.stack.join(', ')}]</div>
                ${step.output ? `<div class="text-xs">Output: ${step.output}</div>` : ''}
            </td>
        `;
        resultsTableBody.appendChild(stepRow);
    });
}

// Expression tree construction
function runExpressionTree() {
    // Create a modal for input
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Expression Tree</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body p-4">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm text-slate-400 mb-1">Expression</label>
                        <input id="tree-expression-input" class="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm" placeholder="e.g., 3 + 4 * 5 or + * 3 4 5">
                    </div>
                    <div>
                        <label class="block text-sm text-slate-400 mb-1">Input Notation</label>
                        <select id="tree-input-notation" class="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm">
                            <option value="infix">Infix</option>
                            <option value="prefix">Prefix (Polish)</option>
                            <option value="postfix">Postfix (Reverse Polish)</option>
                        </select>
                    </div>
                    <button id="build-tree-btn" class="w-full py-2 bg-green-600 hover:bg-green-500 rounded text-sm">
                        Build Tree
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';

    // Close modal when clicking close button
    modal.querySelector('.close-btn').addEventListener('click', () => {
        modal.remove();
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Handle tree construction
    modal.querySelector('#build-tree-btn').addEventListener('click', () => {
        const expression = modal.querySelector('#tree-expression-input').value.trim();
        const inputNotation = modal.querySelector('#tree-input-notation').value;

        if (!expression) {
            alert('Please enter an expression');
            return;
        }

        // Show loading state
        noResults.classList.add('hidden');
        resultsTableContainer.classList.remove('hidden');
        isomorphismResults.classList.add('hidden');
        resultsTableBody.innerHTML = '<tr><td colspan="3" class="text-center py-2">Building expression tree...</td></tr>';

        // Process in a timeout to allow UI to update
        setTimeout(() => {
            try {
                let tree;
                let steps = [];

                // Build tree based on notation
                if (inputNotation === 'infix') {
                    const postfix = infixToPostfix(expression, steps);
                    tree = buildTreeFromPostfix(postfix, steps);
                } else if (inputNotation === 'prefix') {
                    tree = buildTreeFromPrefix(expression, steps);
                } else if (inputNotation === 'postfix') {
                    tree = buildTreeFromPostfix(expression, steps);
                }

                // Display results
                displayExpressionTreeResults(expression, inputNotation, tree, steps);
                
                // Visualize the tree
                visualizeExpressionTree(tree);
            } catch (error) {
                resultsTableBody.innerHTML = `
                    <tr>
                        <td colspan="3" class="text-center py-4">
                            <div class="text-rose-500 font-semibold">Error building tree</div>
                            <div class="text-sm text-slate-400 mt-2">${error.message}</div>
                        </td>
                    </tr>
                `;
            }

            // Close the modal
            modal.remove();
        }, 100);
    });
}

// Helper functions for expression tree
function buildTreeFromPostfix(postfix, steps = []) {
    const stack = [];
    const tokens = postfix.split(/\s+/);
    
    steps.push({
        description: `Starting with postfix expression: <strong>${postfix}</strong>`,
        stack: stack.map(node => node.value),
        tree: '',
        action: 'Initialize'
    });
    
    for (const token of tokens) {
        if (/\d+/.test(token)) {
            // Operand - push as leaf node
            stack.push({ value: token, left: null, right: null });
            steps.push({
                description: `Found operand <strong>${token}</strong>, pushed to stack as leaf node`,
                stack: stack.map(node => node.value),
                tree: printTree(stack[stack.length-1]),
                action: 'Push Operand'
            });
        } else {
            // Operator - pop two operands and make them children
            const right = stack.pop();
            const rightStep = {
                description: `Popped right operand <strong>${right.value}</strong> from stack`,
                stack: stack.map(node => node.value),
                tree: printTree(right),
                action: 'Pop Right'
            };
            
            const left = stack.pop();
            const leftStep = {
                description: `Popped left operand <strong>${left.value}</strong> from stack`,
                stack: stack.map(node => node.value),
                tree: printTree(left),
                action: 'Pop Left'
            };
            
            const node = { value: token, left, right };
            stack.push(node);
            
            const pushStep = {
                description: `Created subtree with operator <strong>${token}</strong> as root`,
                stack: stack.map(node => node.value),
                tree: printTree(node),
                action: 'Push Operator'
            };
            
            // Add all steps for this operator
            steps.push(rightStep, leftStep, pushStep);
        }
    }
    
    steps.push({
        description: `Final tree constructed`,
        stack: [],
        tree: printTree(stack[0]),
        action: 'Complete'
    });
    
    return stack.pop();
}

function buildTreeFromPrefix(prefix, steps = []) {
    const tokens = prefix.split(/\s+/).reverse();
    const stack = [];
    
    steps.push({
        description: `Starting with prefix expression: <strong>${prefix}</strong>`,
        stack: stack.map(node => node.value),
        tree: '',
        action: 'Initialize'
    });
    
    for (const token of tokens) {
        if (/\d+/.test(token)) {
            // Operand - push as leaf node
            stack.push({ value: token, left: null, right: null });
            steps.push({
                description: `Found operand <strong>${token}</strong>, pushed to stack as leaf node`,
                stack: stack.map(node => node.value),
                tree: printTree(stack[stack.length-1]),
                action: 'Push Operand'
            });
        } else {
            // Operator - pop two operands and make them children
            const left = stack.pop();
            const leftStep = {
                description: `Popped left operand <strong>${left.value}</strong> from stack`,
                stack: stack.map(node => node.value),
                tree: printTree(left),
                action: 'Pop Left'
            };
            
            const right = stack.pop();
            const rightStep = {
                description: `Popped right operand <strong>${right.value}</strong> from stack`,
                stack: stack.map(node => node.value),
                tree: printTree(right),
                action: 'Pop Right'
            };
            
            const node = { value: token, left, right };
            stack.push(node);
            
            const pushStep = {
                description: `Created subtree with operator <strong>${token}</strong> as root`,
                stack: stack.map(node => node.value),
                tree: printTree(node),
                action: 'Push Operator'
            };
            
            // Add all steps for this operator
            steps.push(leftStep, rightStep, pushStep);
        }
    }
    
    steps.push({
        description: `Final tree constructed`,
        stack: [],
        tree: printTree(stack[0]),
        action: 'Complete'
    });
    
    return stack.pop();
}

function printTree(node, prefix = '', isLeft = null) {
    if (!node) return '';
    
    let result = '';
    const connector = isLeft === null ? '' : (isLeft ? '└── ' : '├── ');
    
    result += prefix + connector + node.value + '\n';
    
    if (node.left || node.right) {
        const newPrefix = prefix + (isLeft === null ? '' : (isLeft ? '    ' : '│   '));
        if (node.right) {
            result += printTree(node.right, newPrefix, false);
        }
        if (node.left) {
            result += printTree(node.left, newPrefix, true);
        }
    }
    
    return result;
}


function displayExpressionTreeResults(expression, notation, tree, steps) {
    resultsTableBody.innerHTML = '';
    
    // Add summary row
    const summaryRow = document.createElement('tr');
    summaryRow.innerHTML = `
        <td colspan="3" class="text-center py-2">
            <div class="font-semibold text-green-400">Expression Tree Construction</div>
            <div class="text-sm">Input notation: ${notation}</div>
            <div class="text-xs mt-1"><strong>Expression:</strong> ${expression}</div>
        </td>
    `;
    resultsTableBody.appendChild(summaryRow);
    
    // Add tree visualization header
    const treeHeader = document.createElement('tr');
    treeHeader.innerHTML = `
        <td colspan="3" class="font-semibold bg-slate-800">Final Tree Structure</td>
    `;
    resultsTableBody.appendChild(treeHeader);
    
    // Add tree visualization
    const treeRep = printTree(tree);
    const treeRow = document.createElement('tr');
    treeRow.innerHTML = `
        <td colspan="3"><pre class="text-xs font-mono bg-slate-800 p-2 rounded">${treeRep}</pre></td>
    `;
    resultsTableBody.appendChild(treeRow);
    
    // Add steps header
    const stepsHeader = document.createElement('tr');
    stepsHeader.innerHTML = `
        <td colspan="3" class="font-semibold bg-slate-800">Construction Steps</td>
    `;
    resultsTableBody.appendChild(stepsHeader);
    
    // Add each step
    steps.forEach((step, index) => {
        const stepRow = document.createElement('tr');
        stepRow.className = 'step-row';
        stepRow.dataset.stepIndex = index;
        
        stepRow.innerHTML = `
            <td class="border-r border-slate-700">
                <div class="font-medium">${step.action}</div>
                <div class="text-xs text-slate-400">Step ${index + 1}</div>
            </td>
            <td class="border-r border-slate-700">
                <div class="text-sm">${step.description}</div>
                ${step.stack.length > 0 ? 
                    `<div class="text-xs mt-1"><strong>Stack:</strong> [${step.stack.join(', ')}]</div>` : ''}
            </td>
            <td>
                ${step.tree ? `<pre class="text-xs font-mono">${step.tree}</pre>` : ''}
            </td>
        `;
        
        // Add click handler to highlight corresponding tree part
        stepRow.addEventListener('click', () => {
            highlightStep(step, index, steps);
        });
        
        resultsTableBody.appendChild(stepRow);
    });
    
    // Add evaluation section
    const evalHeader = document.createElement('tr');
    evalHeader.innerHTML = `
        <td colspan="3" class="font-semibold bg-slate-800">Tree Evaluation</td>
    `;
    resultsTableBody.appendChild(evalHeader);
    
    const evalRow = document.createElement('tr');
    evalRow.innerHTML = `
        <td colspan="3">
            <div class="text-sm">Click on any step to see how the tree was built.</div>
            <div class="text-xs mt-2 text-slate-400">
                <strong>Note:</strong> You can drag nodes in the visualization to rearrange the tree.
            </div>
        </td>
    `;
    resultsTableBody.appendChild(evalRow);
}

function highlightStep(step, stepIndex, allSteps) {
    // Remove previous highlights
    document.querySelectorAll('.highlight-node, .highlight-edge').forEach(el => {
        el.classList.remove('highlight-node', 'highlight-edge');
    });
    
    // Highlight current step's nodes
    if (step.tree) {
        // Find the nodes involved in this step
        const nodeValues = [];
        if (step.action === 'Push Operand') {
            nodeValues.push(step.description.match(/operand <strong>(.*?)<\/strong>/)[1]);
        } else if (step.action === 'Push Operator') {
            nodeValues.push(step.description.match(/operator <strong>(.*?)<\/strong>/)[1]);
            // Also highlight children if available
            const prevSteps = allSteps.slice(0, stepIndex);
            const popRightStep = prevSteps.findLast(s => s.action === 'Pop Right');
            const popLeftStep = prevSteps.findLast(s => s.action === 'Pop Left');
            
            if (popRightStep) nodeValues.push(popRightStep.description.match(/operand <strong>(.*?)<\/strong>/)[1]);
            if (popLeftStep) nodeValues.push(popLeftStep.description.match(/operand <strong>(.*?)<\/strong>/)[1]);
        }
        
        // Highlight the nodes in the visualization
        nodeValues.forEach(value => {
            const nodeElement = [...document.querySelectorAll('.node')].find(el => el.textContent === value);
            if (nodeElement) {
                nodeElement.classList.add('highlight-node');
                nodeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
        
        // Highlight edges if this is an operator step
        if (step.action === 'Push Operator') {
            const operator = step.description.match(/operator <strong>(.*?)<\/strong>/)[1];
            const operatorNode = [...document.querySelectorAll('.node')].find(el => el.textContent === operator);
            
            if (operatorNode) {
                const operatorId = operatorNode.dataset.id;
                const edges = document.querySelectorAll(`line[data-source="${operatorId}"], line[data-target="${operatorId}"]`);
                edges.forEach(edge => edge.classList.add('highlight-edge'));
            }
        }
    }
}

function visualizeExpressionTree(tree) {
    // Clear the current graph
    clearGraph();
    
    // Calculate tree layout - now vertical (top-down)
    const nodes = [];
    const edges = [];
    let nodeId = 0;
    const levelHeight = 100; // Vertical space between levels
    const nodeWidth = 60;    // Horizontal space between nodes
    
    // Calculate tree width and position nodes
    function calculateTreeLayout(node, depth = 0, pos = 0, parentPos = {x: 0, y: 0}) {
        if (!node) return {width: 0, x: 0};
        
        // Calculate position for this node
        const x = pos * nodeWidth;
        const y = depth * levelHeight + 50; // 50px from top for root
        
        nodes.push({
            id: nodeId,
            value: node.value,
            x: x,
            y: y,
            isOperator: !/\d+/.test(node.value)
        });
        
        const currentId = nodeId++;
        
        // Calculate positions for children
        let leftWidth = 0, rightWidth = 0;
        if (node.left) {
            const left = calculateTreeLayout(node.left, depth + 1, pos, {x, y});
            leftWidth = left.width;
            edges.push({
                source: currentId,
                target: left.id,
                directed: false
            });
        }
        
        if (node.right) {
            const right = calculateTreeLayout(node.right, depth + 1, pos + leftWidth + 1, {x, y});
            rightWidth = right.width;
            edges.push({
                source: currentId,
                target: right.id,
                directed: false
            });
        }
        
        return {
            id: currentId,
            width: leftWidth + rightWidth + 1,
            x: x
        };
    }
    
    // Calculate initial layout to get total width
    const treeLayout = calculateTreeLayout(tree);
    const totalWidth = treeLayout.width * nodeWidth;
    
    // Center the tree horizontally
    const canvas = document.getElementById('graph-canvas');
    const canvasWidth = canvas.clientWidth;
    const startX = (canvasWidth - totalWidth) / 2;
    
    // Adjust all nodes to be centered
    nodes.forEach(node => {
        node.x += startX;
    });
    
    // Add nodes to the graph with enhanced styling
    nodes.forEach(node => {
        const nodeElement = document.createElement('div');
        nodeElement.className = `node absolute w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold cursor-move select-none ${
            node.isOperator ? 'bg-purple-600 border-purple-800 hover:bg-purple-500' : 'bg-green-600 border-green-800 hover:bg-green-500'
        } border-2 transition-colors duration-200`;
        nodeElement.style.left = `${node.x - 20}px`;
        nodeElement.style.top = `${node.y - 20}px`;
        nodeElement.textContent = node.value;
        nodeElement.dataset.id = node.id;
        nodeElement.dataset.value = node.value;
        
        // Make node draggable
        makeDraggable(nodeElement, true);
        
        nodesContainer.appendChild(nodeElement);
        graph.nodes.push({
            id: node.id,
            element: nodeElement,
            x: node.x,
            y: node.y,
            value: node.value
        });
    });
    
    // Add edges to the graph with enhanced styling
    edges.forEach(edge => {
        const sourceNode = graph.nodes.find(n => n.id === edge.source);
        const targetNode = graph.nodes.find(n => n.id === edge.target);
        
        if (sourceNode && targetNode) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', sourceNode.x);
            line.setAttribute('y1', sourceNode.y);
            line.setAttribute('x2', targetNode.x);
            line.setAttribute('y2', targetNode.y);
            line.classList.add('edge', 'stroke-slate-400');
            line.setAttribute('data-source', edge.source);
            line.setAttribute('data-target', edge.target);
            
            // Add arrow marker for tree edges (pointing downward)
            line.setAttribute('marker-end', 'url(#arrowhead)');
            
            const edgeId = `edge-${edge.source}-${edge.target}-${graph.edges.length}`;
            line.id = edgeId;
            
            graphSvg.appendChild(line);
            graph.edges.push({
                id: edgeId,
                source: edge.source,
                target: edge.target,
                directed: false,
                weight: null,
                element: line
            });
        }
    });
    
    // Update counters
    updateNodeCounter();
    updateEdgeCounter();
    
    // Auto-scroll to show the full tree
    const treeHeight = (Math.max(...nodes.map(n => n.y)) + 100);
    document.querySelector('.graph-container').scrollTo({
        top: treeHeight - canvas.clientHeight,
        behavior: 'smooth'
    });
}



// Run the selected algorithm
function runAlgorithm() {
    if (!graph.selectedAlgorithm) {
        alert('Please select an algorithm first');
        return;
    }
    
    // Reset previous visualizations
    resetGraphVisualization();
    
    // Show color key legend
    colorKeyLegend.classList.remove('hidden');
    
    // Run the selected algorithm
    switch (graph.selectedAlgorithm) {
        case 'prim':
            const startNodePrim = startNodeSelect.value || graph.nodes[0]?.id;
            if (startNodePrim) runPrim(startNodePrim);
            break;
        case 'kruskal':
            runKruskal();
            break;
        case 'dijkstra':
            const startNodeDijkstra = startNodeSelect.value || graph.nodes[0]?.id;
            const endNodeDijkstra = endNodeSelect.value || graph.nodes[graph.nodes.length - 1]?.id;
            if (startNodeDijkstra && endNodeDijkstra) runDijkstra(startNodeDijkstra, endNodeDijkstra);
            break;
        case 'kuratowski':
            runKuratowski();
            break;
        case 'hamiltonian':
            runHamiltonian();
            break;
        case 'eulerian':
            runEulerian();
            break;
        case 'vertex-coloring':
            runVertexColoring();
            break;
        case 'edge-coloring':
            runEdgeColoring();
            break;
        case 'bipartite-check':
            runBipartiteCheck();
            break;
        case 'isomorphism':
            checkGraphIsomorphism();
            break;
        case 'notation-conversion':
            runNotationConversion();
            break;
        case 'expression-tree':
            runExpressionTree();
            break;    
        default:
            alert('Algorithm not implemented yet');
    }
}

// Reset graph visualization (remove all highlighting)
function resetGraphVisualization() {
    // Reset nodes
    graph.nodes.forEach(node => {
        node.element.className = 'node absolute w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-xs font-bold text-slate-200 cursor-move select-none';
    });
    
    // Reset edges
    graph.edges.forEach(edge => {
        edge.element.className = 'edge';
        if (edge.directed) {
            edge.element.classList.add('directed');
            edge.element.setAttribute('marker-end', 'url(#arrowhead)');
        }
    });
}

// Export visualization as image
function exportVisualization() {
    alert('Export functionality would be implemented here');
    // In a real implementation, you would use html2canvas or similar library
    // to capture the graph visualization as an image
}

// Toggle results visibility
function toggleResultsVisibility() {
    const resultsContainer = document.querySelector('.results-container');
    const isHidden = resultsContainer.style.maxHeight === '0px' || !resultsContainer.style.maxHeight;
    
    if (isHidden) {
        resultsContainer.style.maxHeight = '500px';
        toggleResultsBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    } else {
        resultsContainer.style.maxHeight = '0px';
        toggleResultsBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
    }
}

// Update graph structure parameters visibility
function updateGraphStructureParams() {
    const structure = graphStructureSelect.value;
    
    randomGraphParams.classList.add('hidden');
    cycleGraphParams.classList.add('hidden');
    completeGraphParams.classList.add('hidden');
    wheelGraphParams.classList.add('hidden');
    bipartiteGraphParams.classList.add('hidden');
    
    switch (structure) {
        case 'random':
            randomGraphParams.classList.remove('hidden');
            break;
        case 'cycle':
            cycleGraphParams.classList.remove('hidden');
            break;
        case 'complete':
            completeGraphParams.classList.remove('hidden');
            break;
        case 'wheel':
            wheelGraphParams.classList.remove('hidden');
            break;
        case 'complete-bipartite':
            bipartiteGraphParams.classList.remove('hidden');
            break;
    }
}

// Update cycle size value display
function updateCycleSizeValue() {
    cycleSizeValue.textContent = cycleSizeInput.value;
}

// Update complete graph size value display
function updateCompleteSizeValue() {
    completeSizeValue.textContent = completeSizeInput.value;
}

// Update wheel size value display
function updateWheelSizeValue() {
    wheelSizeValue.textContent = wheelSizeInput.value;
}

// Update bipartite m value display
function updateBipartiteMValue() {
    bipartiteMValue.textContent = bipartiteMInput.value;
}

// Update bipartite n value display
function updateBipartiteNValue() {
    bipartiteNValue.textContent = bipartiteNInput.value;
}

// Initialize modal dialogs
function initModals() {
    // Settings modal
    const settingsModal = document.createElement('div');
    settingsModal.id = 'settings-modal';
    settingsModal.className = 'modal';
    settingsModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Settings</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="settings-option">
                    <label class="settings-label">Animation Speed</label>
                    <select id="animation-speed" class="settings-select">
                        <option value="slow">Slow</option>
                        <option value="medium" selected>Medium</option>
                        <option value="fast">Fast</option>
                    </select>
                </div>
                <div class="settings-option">
                    <label class="settings-label">Default Graph Type</label>
                    <select id="default-graph-type" class="settings-select">
                        <option value="undirected">Undirected</option>
                        <option value="directed">Directed</option>
                        <option value="weighted">Weighted</option>
                    </select>
                </div>
                <div class="settings-option">
                    <label class="settings-label">Edge Display</label>
                    <select id="edge-display" class="settings-select">
                        <option value="straight">Straight Lines</option>
                        <option value="curved" selected>Curved Lines</option>
                    </select>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(settingsModal);

    // Help modal
    const helpModal = document.createElement('div');
    helpModal.id = 'help-modal';
    helpModal.className = 'modal';
    helpModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Help</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="help-content">
                    <div class="help-section">
                        <h4 class="help-section-title">Graph Creation</h4>
                        <p>Click the "+" button to add nodes to the graph. Click on a node and then another node to create an edge between them.</p>
                        <p>Use the right-click menu on nodes and edges to delete them.</p>
                    </div>
                    <div class="help-section">
                        <h4 class="help-section-title">Algorithms</h4>
                        <p>Select an algorithm from the sidebar and click "Run" to visualize it on your graph.</p>
                        <p>Some algorithms require you to select start and/or end nodes.</p>
                    </div>
                    <div class="help-section">
                        <h4 class="help-section-title">Graph Types</h4>
                        <p>You can generate different types of graphs using the "Generate Graph" panel.</p>
                        <p>Choose between random, cycle, complete, wheel, and bipartite graphs.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(helpModal);

    // Close modals when clicking close button
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

// Open settings modal
function openSettings() {
    const modal = document.getElementById('settings-modal');
    modal.style.display = 'flex';
}

// Open help modal
function openHelp() {
    const modal = document.getElementById('help-modal');
    modal.style.display = 'flex';
}

// Toggle between light and dark theme
function toggleTheme() {
    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        themeToggle.innerHTML = '<i class="fas fa-moon text-xl"></i>';
    } else {
        html.classList.add('dark');
        themeToggle.innerHTML = '<i class="fas fa-sun text-xl"></i>';
    }
}
document.getElementById('back-btn').addEventListener('click', function(e) {
e.preventDefault();

// Create particle transition
const particleTransition = document.createElement('div');
particleTransition.className = 'particle-transition';
document.body.appendChild(particleTransition);

// Activate transition
setTimeout(() => {  
    particleTransition.classList.add('active');
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random direction and distance
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 200;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        // Random position
        particle.style.left = `${50 + (Math.random() - 0.5) * 20}%`;
        particle.style.top = `${50 + (Math.random() - 0.5) * 20}%`;
        
        // Random size and delay
        particle.style.width = `${5 + Math.random() * 10}px`;
        particle.style.height = particle.style.width;
        particle.style.animationDelay = `${Math.random() * 0.5}s`;
        
        particleTransition.appendChild(particle);
    }
    
    // Fade out main content
    document.body.classList.add('page-fade-out');
    
    // Redirect after animation
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}, 50);
});


// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);