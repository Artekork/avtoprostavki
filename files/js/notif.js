

const notifications = document.querySelector(".notifications"),
buttons = document.querySelectorAll(".buttons .btn");

const toastDetails = {
    timer: 1500,
    success: {
        icon: '/files/images/other/tick.png',
        text: 'Success: This is a success toast.',
    },
    error: {
        icon: '/files/images/other/cross.png',
        text: 'Error: This is an error toast.',
    },
    warning: {
        icon: 'fa-triangle-exclamation',
        text: 'Warning: This is a warning toast.',
    },
    info: {
        icon: 'fa-circle-info',
        text: 'Info: This is an information toast.',
    }
}

const removeToast = (toast) => {
    toast.classList.add("hide");
    if(toast.timeoutId) clearTimeout(toast.timeoutId); // Clearing the timeout for the toast
    setTimeout(() => toast.remove(), 500); // Removing the toast after 500ms
}

const createToast = (id, inputText) => {
    // Getting the icon and text for the toast based on the id passed
    const { icon } = toastDetails[id];
    const toast = document.createElement("li"); // Creating a new 'li' element for the toast
    toast.className = `toast ${id}`; // Setting the classes for the toast
    // Setting the inner HTML for the toast
    toast.innerHTML = `<div class="column" onclick="removeToast(this.parentElement)">
                         <img class="notif_img" src="${icon}">
                         <span>${inputText}</span>
                      </div>`;
    notifications.appendChild(toast); // Append the toast to the notification ul
    // Setting a timeout to remove the toast after the specified duration
    toast.timeoutId = setTimeout(() => removeToast(toast), toastDetails.timer);
}


function createtete(){
    alert("text")
}
// Adding a click event listener to each button to create a toast when clicked
buttons.forEach(btn => {
    btn.addEventListener("click", () => createToast(btn.id, "Тестовый ввод"));
});



export { createToast }