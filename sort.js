function createParticles() {
    const container = document.querySelector('.fixed.inset-0');
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = `absolute rounded-full bg-${['indigo','purple','blue'][Math.floor(Math.random()*3)]}-400/20`;
        particle.style.width = `${Math.random() * 4 + 2}px`;
        particle.style.height = particle.style.width;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animation = `float ${Math.random() * 10 + 5}s ease-in-out infinite ${Math.random() * 5}s`;
        container.appendChild(particle);
    }
}

class SortingVisualizer {
    constructor() {
        this.array = [];
        this.algorithm = 'bubble';
        this.speed = 500;
        this.isSorting = false;
        this.shouldStop = false;
        this.comparisons = 0;
        this.swaps = 0;
        this.startTime = 0;
        this.sortingInterval = null;
        this.pseudocodeMap = {
            bubble: `function bubbleSort(arr):
                    n = arr.length
                    for i from 0 to n-1:
                    for j from 0 to n-i-1:
                    if arr[j] > arr[j+1]:
                    swap(arr[j], arr[j+1])`,
            selection: `function selectionSort(arr):
                    n = arr.length
                    for i from 0 to n-1:
                    min_idx = i
                    for j from i+1 to n:
                    if arr[j] < arr[min_idx]:
                    min_idx = j
                    swap(arr[i], arr[min_idx])`,
            insertion: `function insertionSort(arr):
                    n = arr.length
                    for i from 1 to n-1:
                    key = arr[i]
                    j = i-1
                    while j >= 0 and arr[j] > key:
                    arr[j+1] = arr[j]
                    j = j-1
                    arr[j+1] = key`,
            merge: `function mergeSort(arr, l, r):
                    if l < r:
                    m = floor((l+r)/2)
                    mergeSort(arr, l, m)
                    mergeSort(arr, m+1, r)
                    merge(arr, l, m, r)`,
            quick: `function quickSort(arr, low, high):
                    if low < high:
                    pi = partition(arr, low, high)
                    quickSort(arr, low, pi-1)
                    quickSort(arr, pi+1, high)`,
            heap: `function heapSort(arr):
                    n = arr.length
                    for i from n/2-1 down to 0:
                    heapify(arr, n, i)
                    for i from n-1 down to 0:
                    swap(arr[0], arr[i])
                    heapify(arr, i, 0)`,
            tim: `function timSort(arr):
                    MIN_MERGE = 32
                    for i from 0 to n step MIN_MERGE:
                    insertionSort(arr, i, min(i+MIN_MERGE-1, n-1))
                    size = MIN_MERGE
                    while size < n:
                    for left from 0 to n step 2*size:
                    mid = left + size - 1
                    right = min(left + 2*size - 1, n-1)
                    if mid < right:
                    merge(arr, left, mid, right)
                    size = 2 * size`
        };
        
        this.explanationMap = {
            bubble: {
                description: "Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
                timeComplexity: "O(n²) in worst and average cases, O(n) in best case (when array is already sorted)",
                spaceComplexity: "O(1) as it's an in-place sorting algorithm"
            },
            selection: {
                description: "Selection Sort divides the input list into two parts: a sorted sublist and an unsorted sublist. It repeatedly finds the smallest element from the unsorted sublist and places it at the end of the sorted sublist.",
                timeComplexity: "O(n²) in all cases as it always makes the same number of comparisons",
                spaceComplexity: "O(1) as it's an in-place sorting algorithm"
            },
            insertion: {
                description: "Insertion Sort builds the final sorted array one item at a time by repeatedly taking the next element and inserting it into the correct position in the already sorted part of the array.",
                timeComplexity: "O(n²) in worst and average cases, O(n) in best case (when array is nearly sorted)",
                spaceComplexity: "O(1) as it's an in-place sorting algorithm"
            },
            merge: {
                description: "Merge Sort is a divide and conquer algorithm that divides the input array into two halves, recursively sorts each half, and then merges the two sorted halves.",
                timeComplexity: "O(n log n) in all cases as it always divides the array in half",
                spaceComplexity: "O(n) due to the auxiliary space used for merging"
            },
            quick: {
                description: "Quick Sort is a divide and conquer algorithm that picks an element as pivot and partitions the array around the pivot such that elements smaller than pivot are before it and elements greater are after.",
                timeComplexity: "O(n log n) in best and average cases, O(n²) in worst case (when pivot is always smallest or largest element)",
                spaceComplexity: "O(log n) due to recursive call stack in best/average case, O(n) in worst case"
            },
            heap: {
                description: "Heap Sort is a comparison-based sorting algorithm that uses a binary heap data structure. It divides its input into a sorted and an unsorted region, and it iteratively shrinks the unsorted region by extracting the largest element and moving that to the sorted region.",
                timeComplexity: "O(n log n) in all cases",
                spaceComplexity: "O(1) as it's an in-place sorting algorithm"
            },
            tim: {
                description: "Tim Sort is a hybrid stable sorting algorithm, derived from merge sort and insertion sort, designed to perform well on many kinds of real-world data. It uses insertion sort for small chunks and merge sort to merge those chunks.",
                timeComplexity: "O(n log n) in worst case, O(n) in best case (when array is already sorted)",
                spaceComplexity: "O(n)"
            }
        };
        
        this.tutorialSteps = [
            {
                title: "Welcome to the Sorting Visualizer",
                content: "This interactive tool helps you understand how different sorting algorithms work by visualizing their step-by-step execution. You can compare algorithms, adjust speed, and even step through the sorting process manually.",
                element: null
            },
            {
                title: "Algorithm Selection",
                content: "Use this dropdown to select which sorting algorithm you want to visualize. Each algorithm has different characteristics in terms of time and space complexity.",
                element: "#sort-algorithm"
            },
            {
                title: "Array Controls",
                content: "Adjust the array size or load your own custom array. The 'Generate New Array' button creates a new random array with the current size.",
                element: "#array-size"
            },
            {
                title: "Animation Controls",
                content: "Start the visualization, pause it, or reset it at any time. You can also adjust the animation speed to go faster or slower.",
                element: "#start-sorting"
            },
            {
                title: "Visualization Area",
                content: "Watch the algorithm in action here. Different colors represent different states: comparison, swap, sorted elements, and pivot (for Quick Sort).",
                element: "#sorting-visualization"
            },
            {
                title: "Performance Metrics",
                content: "Track the algorithm's performance in real-time with these counters showing comparisons, swaps, and elapsed time.",
                element: "#comparison-count"
            },
            {
                title: "Algorithm Information",
                content: "Learn about each algorithm's pseudocode, explanation, and time complexity characteristics in these sections.",
                element: "#pseudocode"
            },
            {
                title: "Benchmarking",
                content: "Run a benchmark to compare the performance of different algorithms on various array sizes.",
                element: "#run-benchmark"
            }
        ];
        
        this.initElements();
        this.initEventListeners();
        this.initCharts();
        this.generateNewArray();
        this.updateAlgorithmInfo();
    }
    
    initElements() {
        this.sortingVisualization = document.getElementById('sorting-visualization');
        this.arraySizeInput = document.getElementById('array-size');
        this.currentArraySizeDisplay = document.getElementById('current-array-size');
        this.newArrayButton = document.getElementById('new-array');
        this.startButton = document.getElementById('start-sorting');
        this.pauseButton = document.getElementById('pause-sorting');
        this.resetButton = document.getElementById('reset-sorting');
        this.algorithmSelect = document.getElementById('sort-algorithm');
        this.speedInput = document.getElementById('animation-speed');
        this.comparisonCount = document.getElementById('comparison-count');
        this.swapCount = document.getElementById('swap-count');
        this.timeCount = document.getElementById('time-count');
        this.explanationDiv = document.getElementById('sorting-explanation');
        this.pseudocodeDiv = document.getElementById('pseudocode');
        this.customArrayInput = document.getElementById('custom-array');
        this.loadCustomArrayButton = document.getElementById('load-custom-array');
        this.benchmarkButton = document.getElementById('run-benchmark');
        this.themeToggle = document.getElementById('theme-toggle');
        this.backButton = document.getElementById('back-btn');
        this.tutorialButton = document.getElementById('tutorial-btn');
        this.tutorialModal = document.getElementById('tutorial-modal');
        this.tutorialTitle = document.getElementById('tutorial-title');
        this.tutorialContent = document.getElementById('tutorial-content');
        this.closeTutorial = document.getElementById('close-tutorial');
        this.benchmarkModal = document.getElementById('benchmark-modal');
        this.benchmarkResults = document.getElementById('benchmark-results');
        this.closeBenchmark = document.getElementById('close-benchmark');
        this.closeBenchmarkBtn = document.getElementById('close-benchmark-btn');
    }
    
    initEventListeners() {
        // Array size slider
        this.arraySizeInput.addEventListener('input', () => {
            this.currentArraySizeDisplay.textContent = this.arraySizeInput.value;
            if (!this.isSorting) {
                this.generateNewArray();
            }
        });
        
        // New array button
        this.newArrayButton.addEventListener('click', () => {
            if (!this.isSorting) {
                this.generateNewArray();
                this.resetStats();
                this.resetBarColors();
            }
        });
        
        // Start button
        this.startButton.addEventListener('click', () => this.startSorting());
        
        // Pause button
        this.pauseButton.addEventListener('click', () => this.pauseSorting());
        
        // Reset button
        this.resetButton.addEventListener('click', () => this.resetSorting());
        
        // Algorithm selection
        this.algorithmSelect.addEventListener('change', () => {
            this.algorithm = this.algorithmSelect.value;
            this.updateAlgorithmInfo();
        });
        
        // Animation speed slider
        this.speedInput.addEventListener('input', () => {
            this.speed = 1100 - (this.speedInput.value * 100);
        });
        
        // Custom array input
        this.loadCustomArrayButton.addEventListener('click', () => {
            const input = this.customArrayInput.value;
            const customArray = input.split(',').map(Number).filter(n => !isNaN(n));
            if (customArray.length > 1) {
                this.array = customArray;
                this.renderArray();
                this.resetStats();
                this.arraySizeInput.value = customArray.length;
                this.currentArraySizeDisplay.textContent = customArray.length;
            } else {
                alert('Please enter at least 2 valid numbers separated by commas');
            }
        });
        
        // Benchmark button
        this.benchmarkButton.addEventListener('click', () => this.runBenchmark());
        
        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Back button
        this.backButton.addEventListener('click', () => this.navigateToHome());
        
        // Tutorial button
        this.tutorialButton.addEventListener('click', () => this.startTutorial());
        this.closeTutorial.addEventListener('click', () => this.tutorialModal.classList.add('hidden'));
        
        // Benchmark modal
        this.closeBenchmark.addEventListener('click', () => this.benchmarkModal.classList.add('hidden'));
        this.closeBenchmarkBtn.addEventListener('click', () => this.benchmarkModal.classList.add('hidden'));
    }
    
    initCharts() {
        // Time complexity chart
        const complexityCtx = document.getElementById('complexity-chart').getContext('2d');
        this.complexityChart = new Chart(complexityCtx, {
            type: 'line',
            data: {
                labels: ['5', '10', '50', '100', '500', '1000'],
                datasets: [
                    {
                        label: 'Bubble Sort (O(n²))',
                        data: [25, 100, 2500, 10000, 250000, 1000000],
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        tension: 0.3,
                        borderWidth: 2
                    },
                    {
                        label: 'Selection Sort (O(n²))',
                        data: [25, 100, 2500, 10000, 250000, 1000000],
                        borderColor: '#ec4899',
                        backgroundColor: 'rgba(236, 72, 153, 0.1)',
                        tension: 0.3,
                        borderWidth: 2
                    },
                    {
                        label: 'Insertion Sort (O(n²))',
                        data: [25, 100, 2500, 10000, 250000, 1000000],
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        tension: 0.3,
                        borderWidth: 2
                    },
                    {
                        label: 'Merge Sort (O(n log n))',
                        data: [8, 23, 195, 460, 4483, 9966],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.3,
                        borderWidth: 2
                    },
                    {
                        label: 'Quick Sort (O(n log n))',
                        data: [7, 20, 141, 320, 3229, 7219],
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        tension: 0.3,
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.raw.toLocaleString() + ' operations';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        type: 'logarithmic',
                        title: {
                            display: true,
                            text: 'Operations (log scale)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Array Size'
                        }
                    }
                }
            }
        });
    }
    
    // =============== Core Functions ===============
    generateNewArray() {
        const arraySize = parseInt(this.arraySizeInput.value);
        this.array = Array.from({length: arraySize}, () => Math.floor(Math.random() * 100) + 5);
        this.renderArray();
    }
    
    renderArray() {
        this.sortingVisualization.innerHTML = '';
        
        const maxValue = Math.max(...this.array);
        const barWidth = 90 / this.array.length; // Reduced width to accommodate spacing
        
        this.array.forEach((value, index) => {
            const barContainer = document.createElement('div');
            barContainer.className = 'bar-container';
            barContainer.style.width = `${barWidth}%`;
            
            const bar = document.createElement('div');
            bar.className = 'sorting-bar bg-indigo-500 dark:bg-indigo-600 rounded-t mx-0.5';
            bar.style.height = `${(value / maxValue) * 80}%`;
            bar.setAttribute('data-value', value);
            bar.setAttribute('data-index', index);
            
            const valueLabel = document.createElement('div');
            valueLabel.className = 'bar-value';
            valueLabel.textContent = value;
            
            barContainer.appendChild(bar);
            barContainer.appendChild(valueLabel);
            this.sortingVisualization.appendChild(barContainer);
        });
    }


    
    updateStats() {
        this.comparisonCount.textContent = this.comparisons;
        this.swapCount.textContent = this.swaps;
        this.timeCount.textContent = (performance.now() - this.startTime).toFixed(2);
    }
    
    resetStats() {
        this.comparisons = 0;
        this.swaps = 0;
        this.updateStats();
    }
    
    resetBarColors() {
        const bars = document.querySelectorAll('.sorting-bar');
        bars.forEach(bar => {
            bar.style.backgroundColor = '';
            bar.classList.remove('compare-animation', 'swap-animation', 'sorted-bar', 'pivot-bar');
        });
    }
    
    highlightBars(index1, index2, action) {
        const bars = document.querySelectorAll('.sorting-bar');
        
        if (index1 >= 0 && index1 < bars.length) {
            if (action === 'compare') {
                bars[index1].style.backgroundColor = '#ec4899';
                bars[index1].classList.add('compare-animation');
            } else if (action === 'swap') {
                bars[index1].style.backgroundColor = '#ef4444';
                bars[index1].classList.add('swap-animation');
            } else if (action === 'pivot') {
                bars[index1].style.backgroundColor = '#d946ef';
                bars[index1].classList.add('pivot-bar');
            }
        }
        
        if (index2 >= 0 && index2 < bars.length) {
            if (action === 'compare') {
                bars[index2].style.backgroundColor = '#ec4899';
                bars[index2].classList.add('compare-animation');
            } else if (action === 'swap') {
                bars[index2].style.backgroundColor = '#ef4444';
                bars[index2].classList.add('swap-animation');
            }
        }
    }
    
    markBarAsSorted(index) {
        const bars = document.querySelectorAll('.sorting-bar');
        if (index >= 0 && index < bars.length) {
            bars[index].classList.remove('compare-animation', 'swap-animation', 'pivot-bar');
            bars[index].classList.add('sorted-bar');
        }
    }
    
    swapElements(index1, index2) {
            [this.array[index1], this.array[index2]] = [this.array[index2], this.array[index1]];
            this.swaps++;
            
            const barContainers = document.querySelectorAll('.bar-container');
            if (index1 >= 0 && index1 < barContainers.length && index2 >= 0 && index2 < barContainers.length) {
                // Animate the swap with spacing maintained
                const bar1 = barContainers[index1].querySelector('.sorting-bar');
                const value1 = barContainers[index1].querySelector('.bar-value');
                const bar2 = barContainers[index2].querySelector('.sorting-bar');
                const value2 = barContainers[index2].querySelector('.bar-value');
                
                const tempHeight = bar1.style.height;
                const tempValue = value1.textContent;
                
                bar1.style.height = bar2.style.height;
                value1.textContent = value2.textContent;
                
                bar2.style.height = tempHeight;
                value2.textContent = tempValue;
            }
            
            this.updateStats();
        }
    
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    updateBarHeight(index, value) {
        const barContainers = document.querySelectorAll('.bar-container');
        const maxValue = Math.max(...this.array);
        
        if (index >= 0 && index < barContainers.length) {
            const bar = barContainers[index].querySelector('.sorting-bar');
            const valueLabel = barContainers[index].querySelector('.bar-value');
            
            bar.style.height = `${(value / maxValue) * 80}%`;
            valueLabel.textContent = value;
        }
    }

    
    highlightSegment(start, end, color) {
        const bars = document.querySelectorAll('.sorting-bar');
        for (let i = start; i <= end; i++) {
            if (i >= 0 && i < bars.length) {
                bars[i].style.backgroundColor = color;
            }
        }
    }
    
    updateAlgorithmInfo() {
        this.pseudocodeDiv.textContent = this.pseudocodeMap[this.algorithm];
        
        const explanation = this.explanationMap[this.algorithm];
        this.explanationDiv.innerHTML = `
            <p class="mb-3"><strong class="text-indigo-600 dark:text-indigo-400">${this.algorithmSelect.options[this.algorithmSelect.selectedIndex].text}</strong>: ${explanation.description}</p>
            <p class="mb-1"><strong>Time Complexity:</strong> ${explanation.timeComplexity}</p>
            <p><strong>Space Complexity:</strong> ${explanation.spaceComplexity}</p>
        `;
    }
    
    // =============== Sorting Algorithms ===============
    async bubbleSort() {
        let n = this.array.length;
        let swapped;
        
        do {
            swapped = false;
            for (let i = 0; i < n - 1; i++) {
                if (this.shouldStop) return;
                
                this.highlightBars(i, i + 1, 'compare');
                this.comparisons++;
                this.updateStats();
                
                await this.sleep(this.speed);
                
                if (this.array[i] > this.array[i + 1]) {
                    this.swapElements(i, i + 1);
                    swapped = true;
                    await this.sleep(this.speed);
                }
                
                this.resetBarColors();
            }
            
            this.markBarAsSorted(n - 1);
            n--;
        } while (swapped);
        
        // Mark all as sorted
        for (let i = 0; i < this.array.length; i++) {
            this.markBarAsSorted(i);
        }
        
        this.sortingComplete();
    }
    
    async selectionSort() {
        const n = this.array.length;
        
        for (let i = 0; i < n - 1; i++) {
            if (this.shouldStop) return;
            
            let minIdx = i;
            
            // Highlight current minimum
            this.highlightBars(minIdx, -1, 'compare');
            await this.sleep(this.speed);
            
            for (let j = i + 1; j < n; j++) {
                if (this.shouldStop) return;
                
                // Highlight current comparison
                this.highlightBars(minIdx, j, 'compare');
                this.comparisons++;
                this.updateStats();
                
                await this.sleep(this.speed);
                
                if (this.array[j] < this.array[minIdx]) {
                    // Reset previous min highlight
                    this.resetBarColors();
                    minIdx = j;
                    
                    // Highlight new min
                    this.highlightBars(minIdx, -1, 'compare');
                    await this.sleep(this.speed);
                } else {
                    this.resetBarColors();
                    this.highlightBars(minIdx, -1, 'compare');
                }
            }
            
            if (minIdx !== i) {
                this.swapElements(i, minIdx);
                await this.sleep(this.speed);
            }
            
            this.markBarAsSorted(i);
            this.resetBarColors();
        }
        
        // Mark last element as sorted
        this.markBarAsSorted(n - 1);
        this.sortingComplete();
    }
    
    async insertionSort() {
        const n = this.array.length;
        
        for (let i = 1; i < n; i++) {
            if (this.shouldStop) return;
            
            const key = this.array[i];
            let j = i - 1;
            
            // Highlight current element being inserted
            this.highlightBars(i, -1, 'swap');
            await this.sleep(this.speed);
            
            while (j >= 0 && this.array[j] > key) {
                if (this.shouldStop) return;
                
                // Highlight comparison
                this.highlightBars(j, -1, 'compare');
                this.comparisons++;
                this.updateStats();
                
                this.array[j + 1] = this.array[j];
                this.updateBarHeight(j + 1, this.array[j + 1]);
                this.swaps++;
                this.updateStats();
                
                await this.sleep(this.speed);
                this.resetBarColors();
                this.highlightBars(i, -1, 'swap');
                
                j = j - 1;
            }
            
            this.array[j + 1] = key;
            this.updateBarHeight(j + 1, key);
            this.swaps++;
            this.updateStats();
            
            this.resetBarColors();
            this.markBarAsSorted(i);
            await this.sleep(this.speed / 2);
        }
        
        // Mark first element as sorted
        this.markBarAsSorted(0);
        this.sortingComplete();
    }
    
    async mergeSort() {
        await this.mergeSortHelper(0, this.array.length - 1);
        
        // Mark all as sorted when done
        for (let i = 0; i < this.array.length; i++) {
            if (this.shouldStop) return;
            this.markBarAsSorted(i);
            await this.sleep(50);
        }
        
        this.sortingComplete();
    }
    
    async mergeSortHelper(l, r) {
        if (l < r) {
            if (this.shouldStop) return;
            
            const m = Math.floor((l + r) / 2);
            
            // Highlight current segment
            this.highlightSegment(l, r, '#ec4899');
            await this.sleep(this.speed);
            
            await this.mergeSortHelper(l, m);
            await this.mergeSortHelper(m + 1, r);
            
            await this.merge(l, m, r);
            
            // Unhighlight segment
            this.resetBarColors();
        }
    }
    
    async merge(l, m, r) {
        if (this.shouldStop) return;
        
        const n1 = m - l + 1;
        const n2 = r - m;
        
        const L = new Array(n1);
        const R = new Array(n2);
        
        for (let i = 0; i < n1; i++) {
            L[i] = this.array[l + i];
        }
        for (let j = 0; j < n2; j++) {
            R[j] = this.array[m + 1 + j];
        }
        
        let i = 0, j = 0, k = l;
        
        while (i < n1 && j < n2) {
            if (this.shouldStop) return;
            
            // Highlight the two elements being compared
            this.highlightBars(l + i, m + 1 + j, 'compare');
            this.comparisons++;
            this.updateStats();
            await this.sleep(this.speed);
            
            if (L[i] <= R[j]) {
                this.array[k] = L[i];
                i++;
            } else {
                this.array[k] = R[j];
                j++;
            }
            
            // Update the visualization
            this.updateBarHeight(k, this.array[k]);
            this.swaps++;
            this.updateStats();
            await this.sleep(this.speed);
            
            this.resetBarColors();
            k++;
        }
        
        while (i < n1) {
            if (this.shouldStop) return;
            this.array[k] = L[i];
            this.updateBarHeight(k, this.array[k]);
            await this.sleep(this.speed / 2);
            i++;
            k++;
        }
        
        while (j < n2) {
            if (this.shouldStop) return;
            this.array[k] = R[j];
            this.updateBarHeight(k, this.array[k]);
            await this.sleep(this.speed / 2);
            j++;
            k++;
        }
    }
    
    async quickSort() {
        await this.quickSortHelper(0, this.array.length - 1);
        
        // Mark all as sorted when done
        for (let i = 0; i < this.array.length; i++) {
            if (this.shouldStop) return;
            this.markBarAsSorted(i);
            await this.sleep(50);
        }
        
        this.sortingComplete();
    }
    
    async quickSortHelper(low, high) {
        if (low < high) {
            if (this.shouldStop) return;
            
            const pi = await this.partition(low, high);
            
            // Highlight pivot in final position
            this.markBarAsSorted(pi);
            await this.sleep(this.speed);
            
            await this.quickSortHelper(low, pi - 1);
            await this.quickSortHelper(pi + 1, high);
        }
    }
    
    async partition(low, high) {
        if (this.shouldStop) return -1;
        
        const pivot = this.array[high];
        let i = low - 1;
        
        // Highlight the pivot
        this.highlightBars(high, -1, 'pivot');
        await this.sleep(this.speed);
        
        for (let j = low; j <= high - 1; j++) {
            if (this.shouldStop) return -1;
            
            // Highlight comparison
            this.highlightBars(j, high, 'compare');
            this.comparisons++;
            this.updateStats();
            await this.sleep(this.speed);
            
            if (this.array[j] < pivot) {
                i++;
                if (i !== j) {
                    this.swapElements(i, j);
                    await this.sleep(this.speed);
                }
            }
            
            this.resetBarColors();
            this.highlightBars(high, -1, 'pivot');
        }
        
        this.swapElements(i + 1, high);
        await this.sleep(this.speed);
        
        this.resetBarColors();
        return i + 1;
    }
    
    async heapSort() {
        const n = this.array.length;
        
        // Build heap (rearrange array)
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            if (this.shouldStop) return;
            await this.heapify(n, i);
        }
        
        // One by one extract an element from heap
        for (let i = n - 1; i > 0; i--) {
            if (this.shouldStop) return;
            
            // Move current root to end
            this.swapElements(0, i);
            await this.sleep(this.speed);
            
            // Mark sorted element
            this.markBarAsSorted(i);
            
            // call max heapify on the reduced heap
            await this.heapify(i, 0);
        }
        
        // Mark first element as sorted
        this.markBarAsSorted(0);
        this.sortingComplete();
    }
    
    async heapify(n, i) {
        if (this.shouldStop) return;
        
        let largest = i; // Initialize largest as root
        const l = 2 * i + 1; // left = 2*i + 1
        const r = 2 * i + 2; // right = 2*i + 2
        
        // Highlight comparison
        if (l < n) {
            this.highlightBars(largest, l, 'compare');
            this.comparisons++;
            this.updateStats();
            await this.sleep(this.speed);
        }
        
        // If left child is larger than root
        if (l < n && this.array[l] > this.array[largest]) {
            largest = l;
        }
        
        // Highlight comparison
        if (r < n) {
            this.highlightBars(largest, r, 'compare');
            this.comparisons++;
            this.updateStats();
            await this.sleep(this.speed);
        }
        
        // If right child is larger than largest so far
        if (r < n && this.array[r] > this.array[largest]) {
            largest = r;
        }
        
        // If largest is not root
        if (largest !== i) {
            this.swapElements(i, largest);
            await this.sleep(this.speed);
            
            // Recursively heapify the affected sub-tree
            await this.heapify(n, largest);
        }
        
        this.resetBarColors();
    }
    
    async timSort() {
        const MIN_MERGE = 32;
        const n = this.array.length;
        
        // Sort individual subarrays of size MIN_MERGE
        for (let i = 0; i < n; i += MIN_MERGE) {
            await this.insertionSortRun(i, Math.min(i + MIN_MERGE - 1, n - 1));
        }
        
        // Start merging from size MIN_MERGE
        for (let size = MIN_MERGE; size < n; size = 2 * size) {
            // Pick starting point of left subarray
            for (let left = 0; left < n; left += 2 * size) {
                // Find ending point of left subarray
                const mid = left + size - 1;
                const right = Math.min(left + 2 * size - 1, n - 1);
                
                // Merge subarrays arr[left..mid] and arr[mid+1..right]
                if (mid < right) {
                    await this.mergeTim(left, mid, right);
                }
            }
        }
        
        // Mark all as sorted when done
        for (let i = 0; i < this.array.length; i++) {
            if (this.shouldStop) return;
            this.markBarAsSorted(i);
            await this.sleep(50);
        }
        
        this.sortingComplete();
    }
    
    async insertionSortRun(left, right) {
        for (let i = left + 1; i <= right; i++) {
            if (this.shouldStop) return;
            
            const key = this.array[i];
            let j = i - 1;
            
            // Highlight current element being inserted
            this.highlightBars(i, -1, 'swap');
            await this.sleep(this.speed / 2);
            
            while (j >= left && this.array[j] > key) {
                if (this.shouldStop) return;
                
                // Highlight comparison
                this.highlightBars(j, -1, 'compare');
                this.comparisons++;
                this.updateStats();
                
                this.array[j + 1] = this.array[j];
                this.updateBarHeight(j + 1, this.array[j + 1]);
                this.swaps++;
                this.updateStats();
                
                await this.sleep(this.speed / 2);
                this.resetBarColors();
                this.highlightBars(i, -1, 'swap');
                
                j = j - 1;
            }
            
            this.array[j + 1] = key;
            this.updateBarHeight(j + 1, key);
            this.swaps++;
            this.updateStats();
            
            this.resetBarColors();
            await this.sleep(this.speed / 4);
        }
    }
    
    async mergeTim(left, mid, right) {
        if (this.shouldStop) return;
        
        const len1 = mid - left + 1;
        const len2 = right - mid;
        
        const leftArr = new Array(len1);
        const rightArr = new Array(len2);
        
        for (let x = 0; x < len1; x++) {
            leftArr[x] = this.array[left + x];
        }
        for (let x = 0; x < len2; x++) {
            rightArr[x] = this.array[mid + 1 + x];
        }
        
        let i = 0, j = 0, k = left;
        
        while (i < len1 && j < len2) {
            if (this.shouldStop) return;
            
            // Highlight the two elements being compared
            this.highlightBars(left + i, mid + 1 + j, 'compare');
            this.comparisons++;
            this.updateStats();
            await this.sleep(this.speed);
            
            if (leftArr[i] <= rightArr[j]) {
                this.array[k] = leftArr[i];
                i++;
            } else {
                this.array[k] = rightArr[j];
                j++;
            }
            
            // Update the visualization
            this.updateBarHeight(k, this.array[k]);
            this.swaps++;
            this.updateStats();
            await this.sleep(this.speed);
            
            this.resetBarColors();
            k++;
        }
        
        while (i < len1) {
            if (this.shouldStop) return;
            this.array[k] = leftArr[i];
            this.updateBarHeight(k, this.array[k]);
            await this.sleep(this.speed / 2);
            i++;
            k++;
        }
        
        while (j < len2) {
            if (this.shouldStop) return;
            this.array[k] = rightArr[j];
            this.updateBarHeight(k, this.array[k]);
            await this.sleep(this.speed / 2);
            j++;
            k++;
        }
    }
    
    // =============== Control Functions ===============
    startSorting() {
        if (this.isSorting) return;
        
        this.isSorting = true;
        this.shouldStop = false;
        this.comparisons = 0;
        this.swaps = 0;
        this.startTime = performance.now();
        this.updateStats();
        this.updateControlButtons();
        
        switch(this.algorithm) {
            case 'bubble':
                this.bubbleSort();
                break;
            case 'selection':
                this.selectionSort();
                break;
            case 'insertion':
                this.insertionSort();
                break;
            case 'merge':
                this.mergeSort();
                break;
            case 'quick':
                this.quickSort();
                break;
            case 'heap':
                this.heapSort();
                break;
            case 'tim':
                this.timSort();
                break;
        }
    }
    
    pauseSorting() {
        this.shouldStop = true;
        this.isSorting = false;
        this.updateControlButtons();
    }
    
    resetSorting() {
        this.shouldStop = true;
        this.isSorting = false;
        this.generateNewArray();
        this.resetStats();
        this.resetBarColors();
        this.updateControlButtons();
    }
    
    sortingComplete() {
        this.isSorting = false;
        this.shouldStop = false;
        this.updateControlButtons();
    }
    
    updateControlButtons() {
        this.startButton.disabled = this.isSorting;
        this.pauseButton.disabled = !this.isSorting;
        this.resetButton.disabled = this.isSorting;
    }
    
    // =============== Benchmark Functions ===============
    async runBenchmark() {
        const sizes = [10, 20, 30, 40, 50];
        const algorithms = ['bubble', 'selection', 'insertion', 'merge', 'quick'];
        const results = {};
        
        // Show loading state
        this.benchmarkModal.classList.remove('hidden');
        document.getElementById('benchmark-results').innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-4 text-center">Running benchmark tests...</td>
            </tr>
        `;
        
        // Initialize results structure
        algorithms.forEach(algo => {
            results[algo] = [];
        });
        
        // Run benchmarks for each algorithm and size
        for (const algo of algorithms) {
            for (const size of sizes) {
                const testArray = Array.from({length: size}, () => Math.floor(Math.random() * 100) + 5);
                const startTime = performance.now();
                
                // Create a copy of the visualizer to run the benchmark without affecting the display
                const tempVisualizer = {
                    array: [...testArray],
                    comparisons: 0,
                    swaps: 0,
                    algorithm: algo,
                    speed: 0, // Run at maximum speed
                    shouldStop: false
                };
                
                // Run the appropriate algorithm
                switch(algo) {
                    case 'bubble':
                        await this.bubbleSortBenchmark(tempVisualizer);
                        break;
                    case 'selection':
                        await this.selectionSortBenchmark(tempVisualizer);
                        break;
                    case 'insertion':
                        await this.insertionSortBenchmark(tempVisualizer);
                        break;
                    case 'merge':
                        await this.mergeSortBenchmark(tempVisualizer);
                        break;
                    case 'quick':
                        await this.quickSortBenchmark(tempVisualizer);
                        break;
                }
                
                const duration = performance.now() - startTime;
                results[algo].push({
                    size,
                    time: duration,
                    comparisons: tempVisualizer.comparisons,
                    swaps: tempVisualizer.swaps
                });
            }
        }
        
        // Display results
        this.displayBenchmarkResults(results);
    }
    
    async bubbleSortBenchmark(visualizer) {
        let n = visualizer.array.length;
        let swapped;
        
        do {
            swapped = false;
            for (let i = 0; i < n - 1; i++) {
                if (visualizer.shouldStop) return;
                
                visualizer.comparisons++;
                
                if (visualizer.array[i] > visualizer.array[i + 1]) {
                    [visualizer.array[i], visualizer.array[i + 1]] = [visualizer.array[i + 1], visualizer.array[i]];
                    visualizer.swaps++;
                    swapped = true;
                }
            }
            n--;
        } while (swapped);
    }
    
    async selectionSortBenchmark(visualizer) {
        const n = visualizer.array.length;
        
        for (let i = 0; i < n - 1; i++) {
            if (visualizer.shouldStop) return;
            
            let minIdx = i;
            
            for (let j = i + 1; j < n; j++) {
                visualizer.comparisons++;
                
                if (visualizer.array[j] < visualizer.array[minIdx]) {
                    minIdx = j;
                }
            }
            
            if (minIdx !== i) {
                [visualizer.array[i], visualizer.array[minIdx]] = [visualizer.array[minIdx], visualizer.array[i]];
                visualizer.swaps++;
            }
        }
    }
    
    async insertionSortBenchmark(visualizer) {
        const n = visualizer.array.length;
        
        for (let i = 1; i < n; i++) {
            if (visualizer.shouldStop) return;
            
            const key = visualizer.array[i];
            let j = i - 1;
            
            while (j >= 0 && visualizer.array[j] > key) {
                visualizer.comparisons++;
                visualizer.array[j + 1] = visualizer.array[j];
                visualizer.swaps++;
                j = j - 1;
            }
            
            visualizer.array[j + 1] = key;
            visualizer.swaps++;
        }
    }
    
    async mergeSortBenchmark(visualizer) {
        await this.mergeSortBenchmarkHelper(visualizer, 0, visualizer.array.length - 1);
    }
    
    async mergeSortBenchmarkHelper(visualizer, l, r) {
        if (l < r) {
            const m = Math.floor((l + r) / 2);
            await this.mergeSortBenchmarkHelper(visualizer, l, m);
            await this.mergeSortBenchmarkHelper(visualizer, m + 1, r);
            await this.mergeBenchmark(visualizer, l, m, r);
        }
    }
    
    async mergeBenchmark(visualizer, l, m, r) {
        const n1 = m - l + 1;
        const n2 = r - m;
        
        const L = new Array(n1);
        const R = new Array(n2);
        
        for (let i = 0; i < n1; i++) {
            L[i] = visualizer.array[l + i];
        }
        for (let j = 0; j < n2; j++) {
            R[j] = visualizer.array[m + 1 + j];
        }
        
        let i = 0, j = 0, k = l;
        
        while (i < n1 && j < n2) {
            visualizer.comparisons++;
            if (L[i] <= R[j]) {
                visualizer.array[k] = L[i];
                i++;
            } else {
                visualizer.array[k] = R[j];
                j++;
            }
            visualizer.swaps++;
            k++;
        }
        
        while (i < n1) {
            visualizer.array[k] = L[i];
            visualizer.swaps++;
            i++;
            k++;
        }
        
        while (j < n2) {
            visualizer.array[k] = R[j];
            visualizer.swaps++;
            j++;
            k++;
        }
    }
    
    async quickSortBenchmark(visualizer) {
        await this.quickSortBenchmarkHelper(visualizer, 0, visualizer.array.length - 1);
    }
    
    async quickSortBenchmarkHelper(visualizer, low, high) {
        if (low < high) {
            const pi = await this.partitionBenchmark(visualizer, low, high);
            await this.quickSortBenchmarkHelper(visualizer, low, pi - 1);
            await this.quickSortBenchmarkHelper(visualizer, pi + 1, high);
        }
    }
    
    async partitionBenchmark(visualizer, low, high) {
        const pivot = visualizer.array[high];
        let i = low - 1;
        
        for (let j = low; j <= high - 1; j++) {
            visualizer.comparisons++;
            if (visualizer.array[j] < pivot) {
                i++;
                [visualizer.array[i], visualizer.array[j]] = [visualizer.array[j], visualizer.array[i]];
                visualizer.swaps++;
            }
        }
        
        [visualizer.array[i + 1], visualizer.array[high]] = [visualizer.array[high], visualizer.array[i + 1]];
        visualizer.swaps++;
        return i + 1;
    }
    
    displayBenchmarkResults(results) {
        // Update results table
        const sizes = [10, 20, 30, 40, 50];
        const algorithms = ['bubble', 'selection', 'insertion', 'merge', 'quick'];
        const algorithmNames = {
            bubble: 'Bubble Sort',
            selection: 'Selection Sort',
            insertion: 'Insertion Sort',
            merge: 'Merge Sort',
            quick: 'Quick Sort'
        };
        
        let tableHTML = '';
        
        sizes.forEach(size => {
            tableHTML += `<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    ${size}
                </th>`;
            
            algorithms.forEach(algo => {
                const result = results[algo].find(r => r.size === size);
                tableHTML += `<td class="px-6 py-4">
                    ${result.time.toFixed(2)} ms<br>
                    <span class="text-xs text-gray-500">${result.comparisons} cmp / ${result.swaps} swp</span>
                </td>`;
            });
            
            tableHTML += `</tr>`;
        });
        
        document.getElementById('benchmark-results').innerHTML = tableHTML;
        
        // Update chart
        const benchmarkCtx = document.getElementById('benchmark-chart').getContext('2d');
        
        if (this.benchmarkChart) {
            this.benchmarkChart.destroy();
        }
        
        this.benchmarkChart = new Chart(benchmarkCtx, {
            type: 'line',
            data: {
                labels: sizes.map(String),
                datasets: algorithms.map(algo => ({
                    label: algorithmNames[algo],
                    data: results[algo].map(r => r.time),
                    borderColor: this.getAlgorithmColor(algo),
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    tension: 0.3,
                    borderWidth: 2
                }))
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Sorting Algorithm Performance Comparison'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const algo = algorithms[context.datasetIndex];
                                const result = results[algo].find(r => r.size === sizes[context.dataIndex]);
                                return `${context.dataset.label}: ${result.time.toFixed(2)} ms (${result.comparisons} cmp, ${result.swaps} swp)`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Time (ms)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Array Size'
                        }
                    }
                }
            }
        });
    }
    
    getAlgorithmColor(algorithm) {
        const colors = {
            bubble: '#6366f1',
            selection: '#ec4899',
            insertion: '#f59e0b',
            merge: '#10b981',
            quick: '#8b5cf6',
            heap: '#d946ef',
            tim: '#3b82f6'
        };
        
        return colors[algorithm] || '#6366f1';
    }
    
    // =============== Tutorial Functions ===============
    startTutorial() {
        this.currentTutorialStep = 0;
        this.tutorialModal.classList.remove('hidden');
        this.showTutorialStep(0);
    }
    
    showTutorialStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.tutorialSteps.length) {
            this.tutorialModal.classList.add('hidden');
            return;
        }
        
        this.currentTutorialStep = stepIndex;
        const step = this.tutorialSteps[stepIndex];
        
        // Update tutorial content
        this.tutorialTitle.textContent = step.title;
        this.tutorialContent.textContent = step.content;
        
        // Update navigation buttons
        this.nextTutorialStep.textContent = stepIndex === this.tutorialSteps.length - 1 ? 'Finish' : 'Next';
        
        // Highlight the relevant element if specified
        if (step.element) {
            const element = document.querySelector(step.element);
            if (element) {
                // Remove highlight from all elements first
                document.querySelectorAll('.tutorial-highlight').forEach(el => {
                    el.classList.remove('tutorial-highlight');
                });
                
                element.classList.add('tutorial-highlight');
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            // Remove all highlights if no specific element
            document.querySelectorAll('.tutorial-highlight').forEach(el => {
                el.classList.remove('tutorial-highlight');
            });
        }
    }
    
    // =============== UI Functions ===============
    toggleTheme() {
        const html = document.documentElement;
        const isDark = html.classList.contains('dark');
        
        if (isDark) {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            this.themeToggle.innerHTML = '<i class="fas fa-moon text-yellow-300"></i>';
        } else {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            this.themeToggle.innerHTML = '<i class="fas fa-sun text-yellow-200"></i>';
        }
    }
    
    
    navigateToHome() {
        window.location.href = 'index.html';
    }
}


// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const visualizer = new SortingVisualizer();
});