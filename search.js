function navigateTo(url) {
    document.body.classList.add('page-fade-out');
    setTimeout(() => {
        window.location.href = url;
    }, 500);
}

// Go back button functionality
document.getElementById('back-button').addEventListener('click', function() {
    navigateTo('index.html');
});

// Theme toggle - switch to light mode
document.getElementById('theme-toggle').addEventListener('click', function() {
    // Navigate to light version with transition
    document.body.classList.add('page-fade-out');
    setTimeout(() => {
        window.location.href = 'searching-light.html';
    }, 500);
});

// Tutorial modal functionality
const tutorialModal = document.getElementById('tutorial-modal');
const tutorialBtn = document.getElementById('tutorial-btn');
const closeTutorial = document.querySelector('.close-tutorial');

tutorialBtn.addEventListener('click', function() {
    tutorialModal.style.display = 'flex';
});

closeTutorial.addEventListener('click', function() {
    tutorialModal.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target === tutorialModal) {
        tutorialModal.style.display = 'none';
    }
});

// =============== Searching Section ===============
let searchArray = [];
let searchTarget = 50;
let searchAlgorithm = 'linear';
let searchAnimationSpeed = 500;
let isSearching = false;
let searchComparisons = 0;
let searchStartTime = 0;
let searchTimeout = null;
let isPaused = false;
let pauseResume = null;

// Initialize search visualization
function initializeSearch() {
    const arraySize = parseInt(document.getElementById('search-array-size').value);
    searchTarget = parseInt(document.getElementById('search-target').value);
    
    // Only generate new array if we're not loading a custom one
    if (!document.getElementById('custom-array-input').classList.contains('show')) {
        searchArray = generateSearchArray(arraySize, searchAlgorithm !== 'linear');
    }
    
    renderSearchArray();
    
    // Reset stats
    searchComparisons = 0;
    document.getElementById('search-comparisons').textContent = '0';
    document.getElementById('search-index').textContent = '-';
    document.getElementById('search-time').textContent = '0';
    document.getElementById('search-status').innerHTML = '<p class="text-gray-600 dark:text-gray-300">Search results will appear here</p>';
}

// Generate search array
function generateSearchArray(size, needsSorting = false) {
    let array = Array.from({length: size}, () => Math.floor(Math.random() * 100) + 1);
    if (needsSorting) {
        array.sort((a, b) => a - b);
    }
    return array;
}

// Render search array
function renderSearchArray() {
    const container = document.getElementById('search-visualization');
    container.innerHTML = '';
    
    const maxValue = Math.max(...searchArray);
    const minHeight = 20; // Minimum height in percentage
    
    searchArray.forEach((value, index) => {
        const item = document.createElement('div');
        item.className = 'search-item text-center text-sm font-medium py-2 px-1 rounded';
        item.textContent = value;
        
        // Calculate height based on value (visual representation)
        const heightPercent = minHeight + ((value / maxValue) * (100 - minHeight));
        item.style.height = `${heightPercent}%`;
        item.style.width = `${100 / searchArray.length}%`;
        item.setAttribute('data-index', index);
        container.appendChild(item);
    });
}

// Update search item appearance
function updateSearchItem(index, state) {
    const items = document.querySelectorAll('.search-item');
    if (index >= 0 && index < items.length) {
        items[index].classList.remove(
            'search-item-highlight', 
            'search-item-found', 
            'search-item-checked',
            'search-item-notfound',
            'search-item-jump',
            'search-item-partition'
        );
        
        if (state === 'current') {
            items[index].classList.add('search-item-highlight');
        } else if (state === 'found') {
            items[index].classList.add('search-item-found');
        } else if (state === 'checked') {
            items[index].classList.add('search-item-checked');
        } else if (state === 'notfound') {
            items[index].classList.add('search-item-notfound');
        } else if (state === 'jump') {
            items[index].classList.add('search-item-jump');
        } else if (state === 'partition') {
            items[index].classList.add('search-item-partition');
        }
    }
}

// Clear all highlights
function clearAllHighlights() {
    const items = document.querySelectorAll('.search-item');
    items.forEach(item => {
        item.classList.remove(
            'search-item-highlight', 
            'search-item-found', 
            'search-item-checked',
            'search-item-notfound',
            'search-item-jump',
            'search-item-partition'
        );
    });
}

// Update search status
function updateSearchStatus(message, isFound = false) {
    const statusDiv = document.getElementById('search-status');
    if (isFound) {
        statusDiv.innerHTML = `<p class="text-green-600 dark:text-green-400 font-medium">${message}</p>`;
    } else {
        statusDiv.innerHTML = `<p class="text-red-600 dark:text-red-400 font-medium">${message}</p>`;
    }
}

// Update search stats
function updateSearchStats(comparisons, index = null, time = null) {
    document.getElementById('search-comparisons').textContent = comparisons;
    if (index !== null) {
        document.getElementById('search-index').textContent = index >= 0 ? index : '-';
    }
    if (time !== null) {
        document.getElementById('search-time').textContent = time.toFixed(2);
    }
}

// =============== Search Algorithms ===============
// Linear Search
async function linearSearch() {
    searchComparisons = 0;
    searchStartTime = performance.now();
    clearAllHighlights();
    
    for (let i = 0; i < searchArray.length; i++) {
        if (!isSearching) return;
        if (isPaused) {
            await new Promise(resolve => {
                pauseResume = resolve;
            });
        }
        
        // Highlight current item
        updateSearchItem(i, 'current');
        searchComparisons++;
        updateSearchStats(searchComparisons, i);
        
        await new Promise(resolve => setTimeout(resolve, searchAnimationSpeed));
        
        if (searchArray[i] === searchTarget) {
            // Found
            updateSearchItem(i, 'found');
            updateSearchStatus(`Found ${searchTarget} at index ${i} (${searchComparisons} comparisons)`, true);
            updateSearchStats(searchComparisons, i, performance.now() - searchStartTime);
            isSearching = false;
            document.getElementById('pause-search').disabled = true;
            document.getElementById('start-search').disabled = false;
            return;
        } else {
            // Mark as checked
            updateSearchItem(i, 'checked');
        }
    }
    
    // Not found
    for (let i = 0; i < searchArray.length; i++) {
        updateSearchItem(i, 'notfound');
    }
    updateSearchStatus(`${searchTarget} not found in array (${searchComparisons} comparisons)`);
    updateSearchStats(searchComparisons, -1, performance.now() - searchStartTime);
    isSearching = false;
    document.getElementById('pause-search').disabled = true;
    document.getElementById('start-search').disabled = false;
}

// Binary Search
async function binarySearch() {
    searchComparisons = 0;
    searchStartTime = performance.now();
    let left = 0;
    let right = searchArray.length - 1;
    clearAllHighlights();
    
    while (left <= right) {
        if (!isSearching) return;
        if (isPaused) {
            await new Promise(resolve => {
                pauseResume = resolve;
            });
        }
        
        const mid = Math.floor((left + right) / 2);
        
        // Highlight middle element
        updateSearchItem(mid, 'current');
        searchComparisons++;
        updateSearchStats(searchComparisons);
        
        await new Promise(resolve => setTimeout(resolve, searchAnimationSpeed));
        
        if (searchArray[mid] === searchTarget) {
            // Found
            updateSearchItem(mid, 'found');
            updateSearchStatus(`Found ${searchTarget} at index ${mid} (${searchComparisons} comparisons)`, true);
            updateSearchStats(searchComparisons, mid, performance.now() - searchStartTime);
            isSearching = false;
            document.getElementById('pause-search').disabled = true;
            document.getElementById('start-search').disabled = false;
            return;
        } else if (searchArray[mid] < searchTarget) {
            // Search right half
            for (let i = left; i <= mid; i++) {
                if (i !== mid) updateSearchItem(i, 'checked');
            }
            left = mid + 1;
        } else {
            // Search left half
            for (let i = mid; i <= right; i++) {
                if (i !== mid) updateSearchItem(i, 'checked');
            }
            right = mid - 1;
        }
        
        await new Promise(resolve => setTimeout(resolve, searchAnimationSpeed));
    }
    
    // Not found
    for (let i = 0; i < searchArray.length; i++) {
        updateSearchItem(i, 'notfound');
    }
    updateSearchStatus(`${searchTarget} not found in array (${searchComparisons} comparisons)`);
    updateSearchStats(searchComparisons, -1, performance.now() - searchStartTime);
    isSearching = false;
    document.getElementById('pause-search').disabled = true;
    document.getElementById('start-search').disabled = false;
}

// Jump Search
async function jumpSearch() {
    searchComparisons = 0;
    searchStartTime = performance.now();
    const n = searchArray.length;
    const step = Math.floor(Math.sqrt(n));
    let prev = 0;
    let currentJump = 0;
    clearAllHighlights();

    // Visualize the step size
    document.getElementById('search-status').innerHTML = 
        `<p class="text-blue-500">Jump size: ${step} (√${n} rounded down)</p>`;

    // Jumping phase
    while (currentJump < n && searchArray[currentJump] < searchTarget) {
        if (!isSearching) return;
        if (isPaused) {
            await new Promise(resolve => {
                pauseResume = resolve;
            });
        }

        // Visualize the jump
        updateSearchItem(currentJump, 'jump');
        searchComparisons++;
        updateSearchStats(searchComparisons);
        await new Promise(resolve => setTimeout(resolve, searchAnimationSpeed));

        // Mark previous block as checked (except current jump point)
        for (let i = prev; i < currentJump; i++) {
            updateSearchItem(i, 'checked');
        }

        prev = currentJump;
        currentJump += step;

        // Don't jump beyond array bounds
        if (currentJump >= n) {
            currentJump = n - 1;
            break;
        }
    }

    // Linear search phase
    const end = Math.min(currentJump, n - 1);
    for (let i = prev; i <= end; i++) {
        if (!isSearching) return;
        if (isPaused) {
            await new Promise(resolve => {
                pauseResume = resolve;
            });
        }

        // Visualize current element being checked
        updateSearchItem(i, 'current');
        searchComparisons++;
        updateSearchStats(searchComparisons);
        await new Promise(resolve => setTimeout(resolve, searchAnimationSpeed));

        if (searchArray[i] === searchTarget) {
            // Found - visualize success
            updateSearchItem(i, 'found');
            for (let j = prev; j <= end; j++) {
                if (j !== i) updateSearchItem(j, 'checked');
            }
            updateSearchStatus(`Found ${searchTarget} at index ${i} (${searchComparisons} comparisons)`, true);
            updateSearchStats(searchComparisons, i, performance.now() - searchStartTime);
            isSearching = false;
            document.getElementById('pause-search').disabled = true;
            document.getElementById('start-search').disabled = false;
            return;
        } else {
            updateSearchItem(i, 'checked');
        }
    }

    // Not found - visualize entire array as checked
    for (let i = 0; i < n; i++) {
        updateSearchItem(i, 'notfound');
    }
    updateSearchStatus(`${searchTarget} not found (${searchComparisons} comparisons)`);
    updateSearchStats(searchComparisons, -1, performance.now() - searchStartTime);
    isSearching = false;
    document.getElementById('pause-search').disabled = true;
    document.getElementById('start-search').disabled = false;
}
// Interpolation Search
async function interpolationSearch() {
    searchComparisons = 0;
    searchStartTime = performance.now();
    let low = 0;
    let high = searchArray.length - 1;
    clearAllHighlights();
    
    while (low <= high && searchTarget >= searchArray[low] && searchTarget <= searchArray[high]) {
        if (!isSearching) return;
        if (isPaused) {
            await new Promise(resolve => {
                pauseResume = resolve;
            });
        }
        
        // Estimate position using interpolation formula
        const pos = low + Math.floor(((searchTarget - searchArray[low]) * (high - low)) / (searchArray[high] - searchArray[low]));
        
        // Highlight the estimated position
        updateSearchItem(pos, 'partition');
        searchComparisons++;
        updateSearchStats(searchComparisons);
        
        await new Promise(resolve => setTimeout(resolve, searchAnimationSpeed));
        
        if (searchArray[pos] === searchTarget) {
            // Found
            updateSearchItem(pos, 'found');
            updateSearchStatus(`Found ${searchTarget} at index ${pos} (${searchComparisons} comparisons)`, true);
            updateSearchStats(searchComparisons, pos, performance.now() - searchStartTime);
            isSearching = false;
            document.getElementById('pause-search').disabled = true;
            document.getElementById('start-search').disabled = false;
            return;
        }
        
        if (searchArray[pos] < searchTarget) {
            // Search right part
            for (let i = low; i <= pos; i++) {
                updateSearchItem(i, 'checked');
            }
            low = pos + 1;
        } else {
            // Search left part
            for (let i = pos; i <= high; i++) {
                updateSearchItem(i, 'checked');
            }
            high = pos - 1;
        }
        
        await new Promise(resolve => setTimeout(resolve, searchAnimationSpeed));
    }
    
    // Not found
    for (let i = 0; i < searchArray.length; i++) {
        updateSearchItem(i, 'notfound');
    }
    updateSearchStatus(`${searchTarget} not found in array (${searchComparisons} comparisons)`);
    updateSearchStats(searchComparisons, -1, performance.now() - searchStartTime);
    isSearching = false;
    document.getElementById('pause-search').disabled = true;
    document.getElementById('start-search').disabled = false;
}

// Exponential Search
async function exponentialSearch() {
    searchComparisons = 0;
    searchStartTime = performance.now();
    clearAllHighlights();
    
    // Check first element
    updateSearchItem(0, 'current');
    searchComparisons++;
    updateSearchStats(searchComparisons);
    
    await new Promise(resolve => setTimeout(resolve, searchAnimationSpeed));
    
    if (searchArray[0] === searchTarget) {
        updateSearchItem(0, 'found');
        updateSearchStatus(`Found ${searchTarget} at index 0 (${searchComparisons} comparisons)`, true);
        updateSearchStats(searchComparisons, 0, performance.now() - searchStartTime);
        isSearching = false;
        document.getElementById('pause-search').disabled = true;
        document.getElementById('start-search').disabled = false;
        return;
    }
    
    // Find range by doubling index
    let i = 1;
    while (i < searchArray.length && searchArray[i] <= searchTarget) {
        if (!isSearching) return;
        if (isPaused) {
            await new Promise(resolve => {
                pauseResume = resolve;
            });
        }
        
        updateSearchItem(i, 'jump');
        searchComparisons++;
        updateSearchStats(searchComparisons);
        
        await new Promise(resolve => setTimeout(resolve, searchAnimationSpeed));
        
        i = i * 2;
    }
    
    // Perform binary search in the found range
    let left = Math.floor(i / 2);
    let right = Math.min(i, searchArray.length - 1);
    
    while (left <= right) {
        if (!isSearching) return;
        if (isPaused) {
            await new Promise(resolve => {
                pauseResume = resolve;
            });
        }
        
        const mid = Math.floor((left + right) / 2);
        
        // Highlight middle element
        updateSearchItem(mid, 'current');
        searchComparisons++;
        updateSearchStats(searchComparisons);
        
        await new Promise(resolve => setTimeout(resolve, searchAnimationSpeed));
        
        if (searchArray[mid] === searchTarget) {
            // Found
            updateSearchItem(mid, 'found');
            updateSearchStatus(`Found ${searchTarget} at index ${mid} (${searchComparisons} comparisons)`, true);
            updateSearchStats(searchComparisons, mid, performance.now() - searchStartTime);
            isSearching = false;
            document.getElementById('pause-search').disabled = true;
            document.getElementById('start-search').disabled = false;
            return;
        } else if (searchArray[mid] < searchTarget) {
            // Search right half
            for (let i = left; i <= mid; i++) {
                if (i !== mid) updateSearchItem(i, 'checked');
            }
            left = mid + 1;
        } else {
            // Search left half
            for (let i = mid; i <= right; i++) {
                if (i !== mid) updateSearchItem(i, 'checked');
            }
            right = mid - 1;
        }
        
        await new Promise(resolve => setTimeout(resolve, searchAnimationSpeed));
    }
    
    // Not found
    for (let i = 0; i < searchArray.length; i++) {
        updateSearchItem(i, 'notfound');
    }
    updateSearchStatus(`${searchTarget} not found in array (${searchComparisons} comparisons)`);
    updateSearchStats(searchComparisons, -1, performance.now() - searchStartTime);
    isSearching = false;
    document.getElementById('pause-search').disabled = true;
    document.getElementById('start-search').disabled = false;
}

// =============== Search Controls ===============
// Search algorithm selection
document.getElementById('search-algorithm').addEventListener('change', function() {
    searchAlgorithm = this.value;
    
    // Update algorithm name display
    const algoNames = {
        'linear': 'Linear',
        'binary': 'Binary',
        'jump': 'Jump',
        'interpolation': 'Interpolation',
        'exponential': 'Exponential'
    };
    document.getElementById('search-algo-name').textContent = algoNames[searchAlgorithm];
    
    // Update explanation
    document.getElementById('linear-search-explanation').classList.toggle('hidden', searchAlgorithm !== 'linear');
    document.getElementById('binary-search-explanation').classList.toggle('hidden', searchAlgorithm !== 'binary');
    document.getElementById('jump-search-explanation').classList.toggle('hidden', searchAlgorithm !== 'jump');
    document.getElementById('interpolation-search-explanation').classList.toggle('hidden', searchAlgorithm !== 'interpolation');
    document.getElementById('exponential-search-explanation').classList.toggle('hidden', searchAlgorithm !== 'exponential');
    
    // Update pseudocode
    document.getElementById('linear-search-pseudocode').classList.toggle('hidden', searchAlgorithm !== 'linear');
    document.getElementById('binary-search-pseudocode').classList.toggle('hidden', searchAlgorithm !== 'binary');
    document.getElementById('jump-search-pseudocode').classList.toggle('hidden', searchAlgorithm !== 'jump');
    document.getElementById('interpolation-search-pseudocode').classList.toggle('hidden', searchAlgorithm !== 'interpolation');
    document.getElementById('exponential-search-pseudocode').classList.toggle('hidden', searchAlgorithm !== 'exponential');
    
    if (!isSearching) {
        initializeSearch();
    }
});

// Array size slider
document.getElementById('search-array-size').addEventListener('input', function() {
    document.getElementById('current-search-array-size').textContent = this.value;
    if (!isSearching && !document.getElementById('custom-array-input').classList.contains('show')) {
        initializeSearch();
    }
});

// Target value input
document.getElementById('search-target').addEventListener('input', function() {
    const value = parseInt(this.value) || 0;
    this.value = Math.min(100, Math.max(1, value)); // Clamp between 1 and 100
    searchTarget = parseInt(this.value);
});

// Animation speed slider
document.getElementById('search-animation-speed').addEventListener('input', function() {
    // Map 1-10 to 1000-100ms (1=slowest, 10=fastest)
    searchAnimationSpeed = 1100 - (this.value * 100);
});

// Toggle custom array input
document.getElementById('toggle-custom-array').addEventListener('click', function() {
    const customArrayInput = document.getElementById('custom-array-input');
    customArrayInput.classList.toggle('show');
    
    if (customArrayInput.classList.contains('show')) {
        this.innerHTML = '<i class="fas fa-times mr-2"></i>Close Custom Array';
        this.classList.remove('bg-purple-600');
        this.classList.add('bg-gray-600');
    } else {
        this.innerHTML = '<i class="fas fa-edit mr-2"></i>Custom Array';
        this.classList.remove('bg-gray-600');
        this.classList.add('bg-purple-600');
        if (!isSearching) {
            initializeSearch();
        }
    }
});

// Load custom array
document.getElementById('load-custom-array').addEventListener('click', function() {
    const input = document.getElementById('custom-array-values').value;
    if (input.trim() === '') return;
    
    try {
        // Parse the input string into an array of numbers
        let array = input.split(',').map(item => parseInt(item.trim()));
        
        // Validate the array
        if (array.some(isNaN)) {
            throw new Error('Array contains non-numeric values');
        }
        
        // Update the array size slider to match the custom array length
        const sizeSlider = document.getElementById('search-array-size');
        sizeSlider.value = array.length;
        document.getElementById('current-search-array-size').textContent = array.length;
        
        // Check if we need to sort the array based on selected algorithm
        const needsSorting = document.getElementById('search-algorithm').value !== 'linear';
        if (needsSorting) {
            array.sort((a, b) => a - b);
        }
        
        searchArray = array;
        renderSearchArray();
        
        // Show success message
        document.getElementById('search-status').innerHTML = 
            '<p class="text-green-600 dark:text-green-400 font-medium">Custom array loaded successfully!</p>';
    } catch (error) {
        document.getElementById('search-status').innerHTML = 
            `<p class="text-red-600 dark:text-red-400 font-medium">Error: ${error.message}</p>`;
    }
});

// Save current array
document.getElementById('save-custom-array').addEventListener('click', function() {
    document.getElementById('custom-array-values').value = searchArray.join(', ');
    document.getElementById('search-status').innerHTML = 
        '<p class="text-green-600 dark:text-green-400 font-medium">Current array saved to custom input!</p>';
});

// Copy pseudocode to clipboard
document.getElementById('copy-pseudocode').addEventListener('click', function() {
    const activePseudocode = document.querySelector('#search-explanation pre:not(.hidden)');
    if (activePseudocode) {
        navigator.clipboard.writeText(activePseudocode.textContent)
            .then(() => {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check mr-1"></i>Copied!';
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy pseudocode: ', err);
            });
    }
});

// Start search
document.getElementById('start-search').addEventListener('click', function() {
    if (!isSearching) {
        isSearching = true;
        isPaused = false;
        this.disabled = true;
        document.getElementById('pause-search').disabled = false;
        
        // Reset array highlighting
        clearAllHighlights();
        
        if (searchAlgorithm === 'linear') {
            linearSearch();
        } else if (searchAlgorithm === 'binary') {
            binarySearch();
        } else if (searchAlgorithm === 'jump') {
            jumpSearch();
        } else if (searchAlgorithm === 'interpolation') {
            interpolationSearch();
        } else if (searchAlgorithm === 'exponential') {
            exponentialSearch();
        }
    } else if (isPaused) {
        isPaused = false;
        this.disabled = true;
        document.getElementById('pause-search').disabled = false;
        if (pauseResume) pauseResume();
    }
});

// Pause search
document.getElementById('pause-search').addEventListener('click', function() {
    isPaused = true;
    this.disabled = true;
    document.getElementById('start-search').disabled = false;
});

// Reset search
document.getElementById('reset-search').addEventListener('click', function() {
    isSearching = false;
    isPaused = false;
    clearTimeout(searchTimeout);
    document.getElementById('pause-search').disabled = true;
    document.getElementById('start-search').disabled = false;
    initializeSearch();
});

// New array
document.getElementById('new-search-array').addEventListener('click', function() {
    if (!isSearching) {
        // Hide custom array input if visible
        if (document.getElementById('custom-array-input').classList.contains('show')) {
            document.getElementById('toggle-custom-array').click();
        }
        initializeSearch();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
});