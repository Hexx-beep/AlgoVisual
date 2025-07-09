document.addEventListener("DOMContentLoaded", () => {
    // Page transition for back button
    document.getElementById('show-register').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'index_code.html';
    });

    // Tree data structure
    class TreeNode {
        constructor(value, parent = null) {
            this.value = value.toUpperCase();
            this.parent = parent;
            this.children = [];
            this.x = 0;
            this.y = 0;
            this.id = Math.random().toString(36).substr(2, 9);
        }
    }

    // Main application
    class TreeVisualizer {
        constructor() {
            this.tree = null;
            this.selectedNode = null;
            this.isBinaryTree = true;
            this.traversalSteps = [];
            this.currentStep = 0;
            this.animationInterval = null;
            this.speed = 800;
            this.isPlaying = false;
            this.nodeSize = 15;
            this.zoomTransform = d3.zoomIdentity;
            this.visitedNodes = new Set();
            this.currentNodes = new Set();
            this.activeNodes = new Set();
            this.revisitedNodes = new Set();

            // Initialize D3 tree layout
            this.treeLayout = d3.tree().nodeSize([60, 120]);
            this.svg = d3.select("#tree-svg");
            this.g = this.svg.append("g").attr("class", "zoom-group");
            
            // Initialize zoom behavior with pinch gesture only
            this.zoom = d3.zoom()
                .scaleExtent([0.1, 5])
                .on("zoom", (event) => {
                    this.zoomTransform = event.transform;
                    this.g.attr("transform", event.transform);
                });
            
            this.svg.call(this.zoom)
                .on("dblclick.zoom", null) // Disable double-click zoom
                .call(this.zoom.transform, d3.zoomIdentity);
            
            // Initialize tooltip
            this.tooltip = d3.select("#tooltip");

            // Initialize event listeners
            this.initEventListeners();

            // Create a default tree
            this.createDefaultTree();
        }

        initEventListeners() {
            // Tree type buttons
            document.getElementById("binary-tree-btn").addEventListener("click", () => {
                this.isBinaryTree = true;
                document.getElementById("binary-tree-btn").classList.remove("btn-secondary");
                document.getElementById("binary-tree-btn").classList.add("btn-primary");
                document.getElementById("nary-tree-btn").classList.remove("btn-primary");
                document.getElementById("nary-tree-btn").classList.add("btn-secondary");
                this.updateTree();
            });

            document.getElementById("nary-tree-btn").addEventListener("click", () => {
                this.isBinaryTree = false;
                document.getElementById("nary-tree-btn").classList.remove("btn-secondary");
                document.getElementById("nary-tree-btn").classList.add("btn-primary");
                document.getElementById("binary-tree-btn").classList.remove("btn-primary");
                document.getElementById("binary-tree-btn").classList.add("btn-secondary");
                this.updateTree();
            });

            // Add relationship button
            document.getElementById("add-relationship-btn").addEventListener("click", () => {
                this.addRelationshipRow();
            });

            // Reset relationships button
            document.getElementById("reset-relationships-btn").addEventListener("click", () => {
                this.resetRelationships();
            });

            // Clear tree button
            document.getElementById("clear-tree-btn").addEventListener("click", () => {
                if (this.tree && confirm("Are you sure you want to clear the current tree?")) {
                    this.tree = null;
                    this.selectedNode = null;
                    this.visitedNodes.clear();
                    this.currentNodes.clear();
                    this.activeNodes.clear();
                    this.revisitedNodes.clear();
                    this.updateTree();
                }
            });

            // Random tree button
            document.getElementById("random-tree-btn").addEventListener("click", () => {
                this.generateRandomTree();
            });

            // Generate tree button
            document.getElementById("generate-tree-btn").addEventListener("click", () => {
                this.generateTreeFromInput();
            });

            // Traversal buttons
            document.getElementById("dfs-preorder-btn").addEventListener("click", () => {
                this.startTraversal("preorder");
            });

            document.getElementById("dfs-inorder-btn").addEventListener("click", () => {
                if (this.isBinaryTree) {
                    this.startTraversal("inorder");
                } else {
                    this.showAlert("Inorder traversal is only applicable to binary trees.");
                }
            });

            document.getElementById("dfs-postorder-btn").addEventListener("click", () => {
                this.startTraversal("postorder");
            });

            document.getElementById("bfs-btn").addEventListener("click", () => {
                this.startTraversal("bfs");
            });

            // Playback controls
            document.getElementById("play-btn").addEventListener("click", () => {
                this.playAnimation();
            });

            document.getElementById("pause-btn").addEventListener("click", () => {
                this.pauseAnimation();
            });

            document.getElementById("reset-btn").addEventListener("click", () => {
                this.resetAnimation();
            });

            // Speed slider
            document.getElementById("speed-slider").addEventListener("input", (e) => {
                this.speed = 2100 - e.target.value;
                if (this.isPlaying) {
                    this.pauseAnimation();
                    this.playAnimation();
                }
            });

            // Copy result button
            document.getElementById("copy-result-btn").addEventListener("click", () => {
                const result = Array.from(document.querySelectorAll("#result-list .badge"))
                    .map(el => el.textContent.trim())
                    .join(", ");
                navigator.clipboard.writeText(result)
                    .then(() => this.showAlert("Traversal order copied to clipboard!"))
                    .catch(() => this.showAlert("Failed to copy to clipboard"));
            });

            // Click on SVG (background) to deselect node
            this.svg.on("click", () => {
                this.selectedNode = null;
                this.updateTree();
            });
        }

        addRelationshipRow() {
            const container = document.getElementById("node-relationships");
            const newRow = document.createElement("div");
            newRow.className = "node-relationship";
            newRow.innerHTML = `
                <input type="text" class="input-field parent-input" placeholder="Parent (A-Z)" maxlength="1" pattern="[A-Z]">
                <input type="text" class="input-field children-input" placeholder="Children (A,B,C)" pattern="([A-Z],)*[A-Z]">
            `;
            container.appendChild(newRow);
        }

        resetRelationships() {
            if (confirm("Are you sure you want to reset all relationships?")) {
                const container = document.getElementById("node-relationships");
                container.innerHTML = '';
                this.addRelationshipRow();
            }
        }

        createDefaultTree() {
            // Add default root and one relationship
            document.getElementById("root-value").value = "A";
            this.addRelationshipRow();
            const firstRow = document.querySelector(".node-relationship");
            firstRow.querySelector(".parent-input").value = "A";
            firstRow.querySelector(".children-input").value = "B,C";
        }

        generateTreeFromInput() {
            const rootValue = document.getElementById("root-value").value.trim().toUpperCase();
            if (!rootValue.match(/^[A-Z]$/)) {
                this.showAlert("Please enter a valid root node (A-Z)");
                return;
            }

            // Collect all relationships
            const relationships = [];
            const relationshipRows = document.querySelectorAll(".node-relationship");
            
            for (const row of relationshipRows) {
                const parentInput = row.querySelector(".parent-input").value.trim().toUpperCase();
                const childrenInput = row.querySelector(".children-input").value.trim().toUpperCase();
                
                if (parentInput === "") continue;
                
                if (!parentInput.match(/^[A-Z]$/)) {
                    this.showAlert(`Invalid parent node in relationship: ${parentInput}`);
                    return;
                }
                
                if (childrenInput && !childrenInput.match(/^([A-Z],)*[A-Z]$/)) {
                    this.showAlert(`Invalid children format in relationship for ${parentInput}`);
                    return;
                }
                
                const children = childrenInput ? childrenInput.split(",") : [];
                relationships.push({ parent: parentInput, children });
            }

            // Build the tree
            const root = new TreeNode(rootValue);
            const nodes = { [rootValue]: root };
            let hasChanges = true;
            let iterations = 0;
            const maxIterations = 100;

            while (hasChanges && iterations < maxIterations) {
                hasChanges = false;
                iterations++;
                
                for (const rel of relationships) {
                    if (!nodes[rel.parent]) continue;
                    
                    const parentNode = nodes[rel.parent];
                    
                    for (let i = 0; i < rel.children.length; i++) {
                        const childValue = rel.children[i];
                        
                        if (this.isBinaryTree && parentNode.children.length >= 2) {
                            this.showAlert(`Binary tree node ${parentNode.value} cannot have more than 2 children.`);
                            return;
                        }
                        
                        if (!nodes[childValue]) {
                            const childNode = new TreeNode(childValue, parentNode);
                            nodes[childValue] = childNode;
                            parentNode.children.push(childNode);
                            hasChanges = true;
                        } else if (nodes[childValue].parent === null) {
                            nodes[childValue].parent = parentNode;
                            parentNode.children.push(nodes[childValue]);
                            hasChanges = true;
                        } else if (nodes[childValue].parent !== parentNode) {
                            this.showAlert(`Node ${childValue} cannot have multiple parents (${nodes[childValue].parent.value} and ${parentNode.value}).`);
                            return;
                        }
                        
                        if (parentNode.children[i] !== nodes[childValue]) {
                            parentNode.children[i] = nodes[childValue];
                            hasChanges = true;
                        }
                    }
                }
            }

            if (iterations >= maxIterations) {
                this.showAlert("Could not resolve all relationships. Check for cycles or missing nodes.");
                return;
            }

            this.tree = root;
            this.visitedNodes.clear();
            this.currentNodes.clear();
            this.activeNodes.clear();
            this.revisitedNodes.clear();
            this.updateTree();
            this.showAlert("Tree generated successfully!");
        }

        generateRandomTree() {
            const nodeCount = Math.floor(Math.random() * 10) + 5;
            const root = new TreeNode(this.getRandomValue());
            
            const nodes = [root];
            
            for (let i = 1; i < nodeCount; i++) {
                const parent = nodes[Math.floor(Math.random() * nodes.length)];
                
                if (this.isBinaryTree && parent.children.length >= 2) {
                    i--;
                    continue;
                }
                
                const newNode = new TreeNode(this.getRandomValue(), parent);
                parent.children.push(newNode);
                nodes.push(newNode);
            }
            
            this.tree = root;
            this.visitedNodes.clear();
            this.currentNodes.clear();
            this.activeNodes.clear();
            this.revisitedNodes.clear();
            this.updateTree();
        }

        getRandomValue() {
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            return letters[Math.floor(Math.random() * letters.length)];
        }

        updateTree() {
            // Clear the existing tree
            this.g.selectAll("*").remove();

            // Show/hide empty state
            const emptyState = document.getElementById("empty-state");
            if (!this.tree) {
                emptyState.classList.remove("hidden");
                return;
            } else {
                emptyState.classList.add("hidden");
            }

            // Convert our tree structure to a D3 hierarchy
            const root = d3.hierarchy(this.tree, d => d.children);
            
            // Calculate the tree layout
            const treeData = this.treeLayout(root);
            
            // Calculate dimensions based on container
            const container = document.getElementById('tree-container');
            const width = container.clientWidth;
            const height = container.clientHeight;
            
            // Calculate bounds of the tree
            let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
            treeData.each(d => {
                if (d.x > x1) x1 = d.x;
                if (d.x < x0) x0 = d.x;
                if (d.y > y1) y1 = d.y;
                if (d.y < y0) y0 = d.y;
            });
            
            // Add padding
            const padding = 80;
            x0 = Math.min(x0, -padding);
            x1 = Math.max(x1, padding);
            y0 = Math.min(y0, -padding);
            y1 = Math.max(y1, padding);
            
            // Calculate scaling and translation
            const scale = Math.min(
                (width * 0.9) / (x1 - x0 + padding * 2), 
                (height * 0.9) / (y1 - y0 + padding * 2)
            );
            
            // Center the tree
            const tx = (width / 2) - ((x0 + x1) / 2) * scale;
            const ty = padding * 1.5;
            
            // Apply initial transform
            this.zoomTransform = d3.zoomIdentity.translate(tx, ty).scale(scale);
            this.g.attr('transform', this.zoomTransform);
            
            // Draw the links (edges)
            this.g.selectAll(".link")
                .data(root.links())
                .enter()
                .append("path")
                .attr("class", "link")
                .attr("d", d3.linkVertical()
                    .x(d => d.x)
                    .y(d => d.y));
            
            // Create node groups
            const node = this.g.selectAll(".node")
                .data(root.descendants())
                .enter()
                .append("g")
                .attr("class", d => {
                    let classes = "node";
                    if (d.data.id === this.selectedNode?.id) classes += " selected";
                    if (d.parent === null) classes += " root-node";
                    if (this.visitedNodes.has(d.data.id)) classes += " visited-node";
                    if (this.currentNodes.has(d.data.id)) classes += " current-node";
                    if (this.activeNodes.has(d.data.id)) classes += " active-node";
                    if (this.revisitedNodes.has(d.data.id)) classes += " revisited-node";
                    return classes;
                })
                .attr("transform", d => `translate(${d.x},${d.y})`)
                .on("click", (event, d) => {
                    event.stopPropagation();
                    this.selectedNode = d.data;
                    this.updateTree();
                });
            
            // Draw circles for nodes
            node.append("circle")
                .attr("r", this.nodeSize);
            
            // Add text labels
            node.append("text")
                .attr("dy", "0.35em")
                .style("text-anchor", "middle")
                .style("font-size", "16px")
                .text(d => d.data.value);
            
            // Highlight selected node
            if (this.selectedNode) {
                this.g.selectAll(".node")
                    .filter(d => d.data.id === this.selectedNode.id)
                    .select("circle")
                    .attr("stroke", "#93c5fd")
                    .attr("stroke-width", "2px");
            }
            
            // Add tooltips
            node.on("mouseover", (event, d) => {
                this.tooltip
                    .style("opacity", 1)
                    .html(`<strong>Node ${d.data.value}</strong><br>
                            Children: ${d.data.children.length}<br>
                            ${d.data.parent ? `Parent: ${d.data.parent.value}` : 'Root node'}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY + 10) + "px");
            })
            .on("mouseout", () => {
                this.tooltip.style("opacity", 0);
            });
        }

        startTraversal(type) {
            if (!this.tree) {
                this.showAlert("Please generate a tree first.");
                return;
            }

            this.resetAnimation();
            
            // Generate traversal steps
            this.traversalSteps = [];
            const result = [];
            
            switch (type) {
                case "preorder":
                    this.dfsPreorder(this.tree, result);
                    this.updateExplanationHeader("DFS Preorder Traversal", 
                        "Visits nodes in the order: Root → Left subtree → Right subtree");
                    break;
                case "inorder":
                    if (this.isBinaryTree) {
                        this.dfsInorder(this.tree, result);
                        this.updateExplanationHeader("DFS Inorder Traversal", 
                            "Visits nodes in the order: Left subtree → Root → Right subtree");
                    }
                    break;
                case "postorder":
                    this.dfsPostorder(this.tree, result);
                    this.updateExplanationHeader("DFS Postorder Traversal", 
                        "Visits nodes in the order: Left subtree → Right subtree → Root");
                    break;
                case "bfs":
                    this.bfs(this.tree, result);
                    this.updateExplanationHeader("BFS (Level Order) Traversal", 
                        "Visits nodes level by level from top to bottom, left to right");
                    break;
            }
            
            // Show traversal result
            this.showTraversalResult(result);
            
            // Start animation
            this.playAnimation();
        }

        dfsPreorder(node, result, parentId = null) {
            if (!node) return;
            
            // Mark as current node (yellow)
            this.traversalSteps.push({
                nodeId: node.id,
                action: "visit",
                explanation: `Visiting node <strong>${node.value}</strong> (preorder)`
            });
            result.push(node.value);
            
            for (const child of node.children) {
                // Mark parent as active (blue) while moving to child
                this.traversalSteps.push({
                    nodeId: node.id,
                    action: "traverse",
                    explanation: `Moving to child node <strong>${child.value}</strong> from <strong>${node.value}</strong>`
                });
                
                this.dfsPreorder(child, result, node.id);
                
                if (parentId) {
                    // When returning to parent, mark as revisited (purple)
                    this.traversalSteps.push({
                        nodeId: node.id,
                        action: "return",
                        explanation: `Returning to parent node <strong>${node.value}</strong>`
                    });
                }
            }
        }

        dfsInorder(node, result, parentId = null) {
            if (!node) return;
            
            if (node.children.length > 0) {
                // Move to left child
                this.traversalSteps.push({
                    nodeId: node.id,
                    action: "traverse-left",
                    explanation: `Moving to left child <strong>${node.children[0].value}</strong> from <strong>${node.value}</strong>`
                });
                this.dfsInorder(node.children[0], result, node.id);
                
                // Visit current node (yellow)
                this.traversalSteps.push({
                    nodeId: node.id,
                    action: "visit",
                    explanation: `Visiting node <strong>${node.value}</strong> (inorder)`
                });
                result.push(node.value);
                
                if (node.children.length > 1) {
                    // Move to right child
                    this.traversalSteps.push({
                        nodeId: node.id,
                        action: "traverse-right",
                        explanation: `Moving to right child <strong>${node.children[1].value}</strong> from <strong>${node.value}</strong>`
                    });
                    this.dfsInorder(node.children[1], result, node.id);
                }
            } else {
                // Visit leaf node (yellow)
                this.traversalSteps.push({
                    nodeId: node.id,
                    action: "visit",
                    explanation: `Visiting node <strong>${node.value}</strong> (inorder)`
                });
                result.push(node.value);
            }
            
            if (parentId) {
                // Return to parent (purple)
                this.traversalSteps.push({
                    nodeId: node.id,
                    action: "return",
                    explanation: `Returning to parent node <strong>${node.parent?.value || 'root'}</strong>`
                });
            }
        }

        dfsPostorder(node, result, parentId = null) {
            if (!node) return;
            
            for (const child of node.children) {
                // Mark parent as active (blue) while moving to child
                this.traversalSteps.push({
                    nodeId: node.id,
                    action: "traverse",
                    explanation: `Moving to child node <strong>${child.value}</strong> from <strong>${node.value}</strong>`
                });
                
                this.dfsPostorder(child, result, node.id);
                
                // When returning to parent, mark as revisited (purple)
                this.traversalSteps.push({
                    nodeId: node.id,
                    action: "return",
                    explanation: `Returning to parent node <strong>${node.value}</strong>`
                });
            }
            
            // Visit current node (yellow)
            this.traversalSteps.push({
                nodeId: node.id,
                action: "visit",
                explanation: `Visiting node <strong>${node.value}</strong> (postorder)`
            });
            result.push(node.value);
        }

        bfs(root, result) {
            const queue = [{ node: root, parent: null }];
            
            while (queue.length > 0) {
                const { node, parent } = queue.shift();
                
                // Visit current node (yellow)
                this.traversalSteps.push({
                    nodeId: node.id,
                    action: "visit",
                    explanation: `Visiting node <strong>${node.value}</strong> (BFS)`
                });
                result.push(node.value);
                
                for (const child of node.children) {
                    // Mark parent as active (blue) while enqueuing children
                    this.traversalSteps.push({
                        nodeId: node.id,
                        action: "enqueue",
                        explanation: `Adding child <strong>${child.value}</strong> to the queue`
                    });
                    queue.push({ node: child, parent: node });
                }
            }
        }

        updateExplanationHeader(title, description) {
            const explanation = document.getElementById("explanation");
            explanation.innerHTML = `
                <div class="mb-3">
                    <h3 class="text-lg font-semibold text-indigo-300">${title}</h3>
                    <p class="text-gray-400 text-sm">${description}</p>
                </div>
                <div id="step-explanation" class="text-gray-300">
                    <p>Click Play to start visualization</p>
                </div>
            `;
        }

        showTraversalResult(result) {
            const resultList = document.getElementById("result-list");
            resultList.innerHTML = "";
            
            result.forEach((value, index) => {
                const badge = document.createElement("div");
                badge.className = "badge";
                badge.innerHTML = `<span class="text-gray-400">${index + 1}.</span> ${value}`;
                resultList.appendChild(badge);
            });
            
            document.getElementById("traversal-result").classList.remove("hidden");
            
            // Update progress text
            document.getElementById("progress-text").textContent = `0/${this.traversalSteps.length} steps`;
            document.getElementById("progress-fill").style.width = "0%";
        }

        playAnimation() {
            if (this.traversalSteps.length === 0 || this.isPlaying) return;
            
            this.isPlaying = true;
            document.getElementById("play-btn").disabled = true;
            document.getElementById("pause-btn").disabled = false;
            
            this.animationInterval = setInterval(() => {
                if (this.currentStep >= this.traversalSteps.length) {
                    this.pauseAnimation();
                    
                    // Show completion message
                    const explanation = document.getElementById("explanation");
                    const stepDiv = document.createElement("div");
                    stepDiv.className = "mt-3 p-3 bg-gray-600 rounded-md fade-in";
                    stepDiv.innerHTML = `<i class="fas fa-check-circle text-green-400 mr-2"></i> <strong>Traversal complete!</strong>`;
                    explanation.appendChild(stepDiv);
                    
                    return;
                }
                
                const step = this.traversalSteps[this.currentStep];
                this.executeStep(step);
                
                // Update progress
                const progress = (this.currentStep + 1) / this.traversalSteps.length * 100;
                document.getElementById("progress-fill").style.width = `${progress}%`;
                document.getElementById("progress-text").textContent = 
                    `${this.currentStep + 1}/${this.traversalSteps.length} steps`;
                
                this.currentStep++;
            }, this.speed);
        }

        pauseAnimation() {
            if (!this.isPlaying) return;
            
            clearInterval(this.animationInterval);
            this.isPlaying = false;
            document.getElementById("play-btn").disabled = false;
            document.getElementById("pause-btn").disabled = true;
        }

        resetAnimation() {
            this.pauseAnimation();
            this.currentStep = 0;
            this.currentNodes.clear();
            this.activeNodes.clear();
            this.revisitedNodes.clear();
            this.updateTree();
            
            // Reset progress
            document.getElementById("progress-fill").style.width = "0%";
            document.getElementById("progress-text").textContent = `0/0 steps`;
            
            // Reset explanation but keep header if exists
            const explanation = document.getElementById("explanation");
            const header = explanation.querySelector("div.mb-3");
            
            if (header) {
                explanation.innerHTML = header.outerHTML + 
                    `<div id="step-explanation" class="text-gray-300">
                        <p>Click Play to start visualization</p>
                    </div>`;
            } else {
                explanation.innerHTML = 
                    `<p class="text-gray-300">Select a traversal algorithm to see step-by-step explanations here.</p>`;
            }
        }

        executeStep(step) {
            // Update explanation
            const stepDiv = document.createElement("div");
            stepDiv.className = "mt-2 p-2 bg-gray-600 rounded-md fade-in";
            stepDiv.innerHTML = step.explanation;
            
            const stepExplanation = document.getElementById("step-explanation");
            if (stepExplanation) {
                stepExplanation.appendChild(stepDiv);
                
                // Auto-scroll to bottom
                stepExplanation.scrollTop = stepExplanation.scrollHeight;
            }
            
            // Clear previous states
            this.currentNodes.clear();
            this.activeNodes.clear();
            this.revisitedNodes.clear();
            
            // Update node states based on step action
            switch (step.action) {
                case "visit":
                    this.visitedNodes.add(step.nodeId);
                    this.currentNodes.add(step.nodeId);
                    break;
                    
                case "traverse":
                case "traverse-left":
                case "traverse-right":
                case "enqueue":
                    this.activeNodes.add(step.nodeId);
                    break;
                    
                case "return":
                    this.revisitedNodes.add(step.nodeId);
                    break;
            }
            
            // Update the tree visualization
            this.updateTree();
        }

        showAlert(message) {
            const alert = document.createElement("div");
            alert.className = "alert fade-in";
            alert.innerHTML = `
                <i class="fas fa-info-circle text-indigo-300"></i>
                <span>${message}</span>
            `;
            
            document.body.appendChild(alert);
            
            setTimeout(() => {
                alert.classList.add("fade-out");
                setTimeout(() => {
                    alert.remove();
                }, 300);
            }, 3000);
        }
    }

    // Initialize the application
    new TreeVisualizer();
});
