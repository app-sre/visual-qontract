import chroma from 'chroma-js';

const sortByName = items =>
  items.slice().sort((a, b) => {
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
    return 0;
});

const sortByValue = items =>
  items.slice().sort((a, b) => {
    if (a.value.toLowerCase() > b.value.toLowerCase()) return 1;
    if (a.value.toLowerCase() < b.value.toLowerCase()) return -1;
    return 0;
});

const sortByLabel = items =>
  items.slice().sort((a, b) => {
    if (a.label.toLowerCase() > b.label.toLowerCase()) return 1;
    if (a.label.toLowerCase() < b.label.toLowerCase()) return -1;
    return 0;
});

const sortByDate = items =>
  items.slice().sort((a, b) => {
    var dateA = new Date(a.date);
    var dateB = new Date(b.date);
    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;
    return 0;
});

export { sortByName, sortByValue, sortByLabel, sortByDate};
