console.log('hello world!');

routes.forEach(route => {
    const div = document.createElement('div');
    const a = document.createElement('a')
    a.href = `${route}${ext}`;
    console.log(a.href);
    a.textContent = route;
    div.appendChild(a);
    document.body.appendChild(div);
});