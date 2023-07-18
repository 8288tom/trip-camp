document.addEventListener('DOMContentLoaded', function () {
    // Get the file input element
    const fileInput = document.getElementById('formFileMultiple');

    // Add an event listener for file selection change
    fileInput.addEventListener('change', handleFileSelection);

    // Function to handle file selection change event
    function handleFileSelection(event) {
        const selectedFiles = event.target.files;

        // Array to store valid files
        const validFiles = [];

        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];

            if (file.size > 20 * 1024 * 1024) {
                disableInvalidFile(file, 'One of the images exceeded the limit (20MB), please try again');
            } else {
                validFiles.push(file);
            }
        }

        // Update the selected files with valid files only
        fileInput.files = validFiles;
    }

    // Function to disable or remove invalid file from selection
    function disableInvalidFile(file, message) {
        // Disable the file input element
        fileInput.disabled = true;

        // Show an error message
        alert(message);

        // Reset the file input element
        fileInput.value = '';

        // Enable the file input element after a short delay
        setTimeout(function () {
            fileInput.disabled = false;
        }, 100);
    }
});
