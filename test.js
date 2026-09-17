fetch("https://placehold.co/800x1200/0f172a/94a3b8.png?text=test", {mode: 'cors'}).then(r => console.log(r.headers.get('access-control-allow-origin'))).catch(e => console.log(e))
