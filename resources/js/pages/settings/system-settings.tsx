const handleMaintenanceModeToggle = async () => {
  try {
    const password = await new Promise<string>((resolve) => {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 w-96">
          <h3 class="text-lg font-medium mb-4">Confirm Password</h3>
          <p class="text-sm text-gray-600 mb-4">Please enter your password to toggle maintenance mode.</p>
          <input type="password" class="w-full px-3 py-2 border rounded-md mb-4" placeholder="Enter your password" />
          <div class="flex justify-end gap-2">
            <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200" onclick="this.closest('div').remove()">Cancel</button>
            <button class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700" onclick="this.closest('div').querySelector('input').value && this.closest('div').remove()">Confirm</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      const confirmButton = modal.querySelector('button:last-child');
      confirmButton?.addEventListener('click', () => {
        const input = modal.querySelector('input');
        if (input?.value) {
          resolve(input.value);
          modal.remove();
        }
      });
    });

    await axios.post('/settings/system/maintenance-mode', { password });
    setMaintenanceMode(!maintenanceMode);
    toast.success(`Maintenance mode ${!maintenanceMode ? 'enabled' : 'disabled'}`);
  } catch (error) {
    toast.error('Failed to toggle maintenance mode');
  }
}; 