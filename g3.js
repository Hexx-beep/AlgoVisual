document.addEventListener('DOMContentLoaded', function() {
  // Color key hamburger menu functionality
  const colorKeyToggle = document.getElementById('color-key-toggle');
  const colorKeyDropdown = document.getElementById('color-key-dropdown');
  
  // Toggle color key dropdown
  colorKeyToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      colorKeyDropdown.classList.toggle('hidden');
      
      // Populate color key legend if empty
      if (document.getElementById('color-key-legend').children.length === 0) {
          populateColorKeyLegend();
      }
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function() {
      colorKeyDropdown.classList.add('hidden');
  });
  
  // Prevent dropdown from closing when clicking inside it
  colorKeyDropdown.addEventListener('click', function(e) {
      e.stopPropagation();
  });
  
  // Close dropdown when scrolling (optional)
  window.addEventListener('scroll', function() {
      colorKeyDropdown.classList.add('hidden');
  });
  
  // Function to populate the color key legend
  function populateColorKeyLegend() {
      const colorKeyLegend = document.getElementById('color-key-legend');
      
      // Clear any existing content
      colorKeyLegend.innerHTML = '';
      
      // Create title
      const title = document.createElement('h3');
      title.className = 'text-sm font-semibold text-slate-200 mb-2';
      title.textContent = 'Color Key';
      colorKeyLegend.appendChild(title);
      
      // Create color items container
      const colorItemsContainer = document.createElement('div');
      colorItemsContainer.className = 'space-y-1';
      
      // Color items data
      const colorItems = [
          { color: 'bg-teal-400', text: 'Visited Node' },
          { color: 'bg-amber-400', text: 'Shortest Path Node' },
          { color: 'bg-emerald-500', text: 'Start Node' },
          { color: 'bg-blue-500', text: 'End Node' },
          { color: 'bg-purple-500', text: 'Eulerian Path Node' },
          { color: 'bg-pink-500', text: 'Hamiltonian Path Node' },
          { color: 'bg-teal-400', text: 'Visited Edge' },
          { color: 'bg-amber-400', text: 'Shortest Path Edge' },
          { color: 'bg-purple-500', text: 'Eulerian Path Edge' },
          { color: 'bg-pink-500', text: 'Hamiltonian Path Edge' },
          { color: 'bg-rose-500', text: 'Rejected Edge' },
          { color: 'bg-blue-500', text: 'Color 0 (Vertex)' },
          { color: 'bg-red-500', text: 'Color 1 (Vertex)' },
          { color: 'bg-green-500', text: 'Color 2 (Vertex)' },
          { color: 'bg-yellow-500', text: 'Color 3 (Vertex)' },
          { color: 'bg-blue-500', text: 'Color 0 (Edge)' },
          { color: 'bg-red-500', text: 'Color 1 (Edge)' },
          { color: 'bg-green-500', text: 'Color 2 (Edge)' },
          { color: 'bg-yellow-500', text: 'Color 3 (Edge)' }
      ];
      
      // Create and append color items
      colorItems.forEach(item => {
          const colorItem = document.createElement('div');
          colorItem.className = 'color-key-item flex items-center';
          
          const colorBox = document.createElement('div');
          colorBox.className = `color-key-color w-3 h-3 rounded-full mr-2 ${item.color}`;
          
          const textSpan = document.createElement('span');
          textSpan.className = 'text-xs text-slate-300';
          textSpan.textContent = item.text;
          
          colorItem.appendChild(colorBox);
          colorItem.appendChild(textSpan);
          colorItemsContainer.appendChild(colorItem);
      });
      
      colorKeyLegend.appendChild(colorItemsContainer);
  }
  
  // Initialize color key legend when needed
  document.addEventListener('click', function(e) {
      if (e.target.closest('#color-key-toggle') && 
          document.getElementById('color-key-legend').children.length === 0) {
          populateColorKeyLegend();
      }
  });
});
