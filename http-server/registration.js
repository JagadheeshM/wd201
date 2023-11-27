let users = [];
let entries = localStorage.getItem('userEntries');
if (!entries) {
    localStorage.setItem('userEntries', JSON.stringify(users));
}

const retreive = () => {
    let entries = localStorage.getItem('userEntries');
    if (entries) {
        entries = JSON.parse(entries);
    }
    else {
        entries = [];
    }
    return entries;
}

let userEntries = retreive();

const displayEntries = () => {
    const entries = retreive();
    const tableEntries = entries.map((entry) => {
        const name = `<td>${entry.name}</td>`;
        const email = `<td>${entry.email}</td>`;
        const password = `<td>${entry.password}</td>`;
        const dob = `<td>${entry.dob}</td>`;
        const tnc = `<td>${entry.tnc}</td>`;

        const row = `<tr>${name} ${email} ${password} ${dob} ${tnc}</tr>`
        return row;
    }).join('\n');

    const table = `${tableEntries}`
    document.getElementById('display').innerHTML = table;
}
const saveForm = (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const dob = document.getElementById('dob').value;
    const tnc = document.getElementById('acceptTerms').checked;
    const entry = {
        name,
        email,
        password,
        dob,
        tnc
    };
    users = JSON.parse(localStorage.getItem('userEntries'));
    users.push(entry);
    localStorage.setItem('userEntries', JSON.stringify(users));
    displayEntries();
}

let myform = document.getElementById('myform');
myform.addEventListener('submit', saveForm);
displayEntries();